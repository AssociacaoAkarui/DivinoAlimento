import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import {
  ShoppingCart,
  FileText,
  UserCircle,
  ChevronRight,
  ShoppingBasket,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatBRL } from "@/utils/currency";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import leafTitleIcon from "@/assets/leaf-title-icon.png";
import { useAuth } from "@/contexts/AuthContext";
import {
  useListarCiclos,
  useListarPedidosPorUsuario,
  useListarComposicoesPorCiclo,
} from "@/hooks/graphql";
import { useMemo, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cicloSelecionadoId, setCicloSelecionadoId] = useState<string | null>(
    null,
  );

  const { data: ciclosData, isLoading: ciclosLoading } = useListarCiclos(10);

  const ciclosAtivos = useMemo(() => {
    if (!ciclosData?.listarCiclos?.ciclos) return [];
    return ciclosData.listarCiclos.ciclos.filter((c) => c.status === "oferta");
  }, [ciclosData]);

  const cicloAtivo = useMemo(() => {
    if (ciclosAtivos.length === 0) return null;
    if (cicloSelecionadoId) {
      return (
        ciclosAtivos.find((c) => c.id === cicloSelecionadoId) || ciclosAtivos[0]
      );
    }
    return ciclosAtivos[0];
  }, [ciclosAtivos, cicloSelecionadoId]);

  const { data: pedidosData, isLoading: pedidosLoading } =
    useListarPedidosPorUsuario(user?.id ? parseInt(user.id) : 0);

  const { data: composicoesData, isLoading: composicoesLoading } =
    useListarComposicoesPorCiclo(cicloAtivo?.id ?? "");

  // Encontrar pedido del usuario en el ciclo activo
  const pedidoCicloAtivo = useMemo(() => {
    if (!pedidosData?.listarPedidosPorUsuario || !cicloAtivo) return null;
    return pedidosData.listarPedidosPorUsuario.find(
      (p) => p.cicloId === parseInt(cicloAtivo.id),
    );
  }, [pedidosData, cicloAtivo]);

  // Calcular totales
  const { produtosCesta, produtosVarejo, valorTotalCesta, valorTotalVarejo } =
    useMemo(() => {
      const produtos = pedidoCicloAtivo?.pedidoConsumidoresProdutos || [];

      // Por ahora, todos los productos son de varejo (venda direta)
      // La cesta viene de composiciones
      const varejo = produtos;
      const totalVarejo = varejo.reduce((acc, p) => {
        const valor = p.valorCompra || p.valorOferta || 0;
        return acc + valor * p.quantidade;
      }, 0);

      // Productos de la cesta (de composiciones)
      const cesta: typeof produtos = [];
      let totalCesta = 0;

      if (composicoesData && Array.isArray(composicoesData)) {
        composicoesData.forEach((cicloCesta) => {
          cicloCesta.composicoes?.forEach((comp) => {
            comp.composicaoOfertaProdutos?.forEach((cop) => {
              if (cop.produto) {
                cesta.push({
                  id: cop.id,
                  pedidoConsumidorId: 0,
                  produtoId: cop.produtoId,
                  quantidade: cop.quantidade,
                  valorOferta: cop.valor,
                  produto: cop.produto,
                });
                totalCesta += (cop.valor || 0) * cop.quantidade;
              }
            });
          });
        });
      }

      return {
        produtosCesta: cesta,
        produtosVarejo: varejo,
        valorTotalCesta: totalCesta,
        valorTotalVarejo: totalVarejo,
      };
    }, [pedidoCicloAtivo, composicoesData]);

  // Formatear fecha de entrega
  const formatDataEntrega = (dataStr?: string) => {
    if (!dataStr) return "A definir";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const acoes = [
    {
      titulo: "Minha Cesta",
      descricao: "Ver itens da sua cesta no ciclo atual",
      icone: ShoppingBasket,
      rota: cicloAtivo ? `/minhaCesta/${cicloAtivo.id}` : "/minhaCesta",
      habilitado: !!cicloAtivo,
      badge: undefined,
    },
    {
      titulo: "Pedido em Varejo",
      descricao: "Comprar alimentos da venda direta",
      icone: ShoppingCart,
      rota: "/consumidor/selecionar-ciclo",
      habilitado: true,
      badge: undefined,
    },
    {
      titulo: "Relatório de Pedidos",
      descricao: "Visualize e exporte relatórios dos seus pedidos",
      icone: FileText,
      rota: "/consumidor/relatorio-pedidos",
      habilitado: true,
      badge: undefined,
    },
    {
      titulo: "Dados Pessoais",
      descricao: "Atualize seu perfil e contato",
      icone: UserCircle,
      rota: user ? `/usuario/${user.id}` : "/usuario",
      habilitado: true,
      badge: undefined,
    },
  ];

  const isLoading = ciclosLoading || pedidosLoading || composicoesLoading;

  return (
    <ResponsiveLayout headerContent={<UserMenuLarge />}>
      <div className="space-y-6 pt-8">
        {/* Header */}
        <div className="text-center relative mb-8">
          <img
            src={leafTitleIcon}
            alt=""
            className="absolute left-1/2 -translate-x-[175px] md:-translate-x-[250px] top-1/2 -translate-y-[80%] w-10 h-10 md:w-16 md:h-16"
          />
          <h1 className="text-xl md:text-[28px] font-bold text-primary">
            Gerencie suas compras
          </h1>
        </div>

        {/* Resumo do Ciclo Atual */}
        <div className="mb-8 bg-white rounded-[14px] shadow-[0px_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Cabeçalho */}
          <div className="px-6 pt-6 pb-4">
            <h3
              className="text-center text-[#2C3E50] text-xl font-bold mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Resumo do Ciclo Atual
            </h3>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : cicloAtivo ? (
              <>
                {ciclosAtivos.length > 1 ? (
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {ciclosAtivos.map((ciclo) => (
                      <button
                        key={ciclo.id}
                        onClick={() => setCicloSelecionadoId(ciclo.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          cicloAtivo.id === ciclo.id
                            ? "bg-[#FFA726] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {ciclo.nome}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#FFA726] rounded-full px-6 py-2">
                      <span
                        className="text-white text-sm font-medium"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {cicloAtivo.nome}
                      </span>
                    </div>
                  </div>
                )}

                {/* Local e Data de Entrega */}
                <div className="bg-[#F5F5F5] rounded-lg px-4 py-3 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <span className="text-[#666] text-sm font-semibold">
                        Local de Entrega:{" "}
                      </span>
                      <span className="text-[#666] text-sm">
                        {cicloAtivo.pontoEntrega?.nome || "A definir"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#666] text-sm font-semibold">
                        Data e Hora da Entrega:{" "}
                      </span>
                      <span className="text-[#666] text-sm">
                        {formatDataEntrega(cicloAtivo.retiradaConsumidorInicio)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum ciclo ativo no momento
              </div>
            )}
          </div>

          {/* Conteúdo - Duas Colunas */}
          {cicloAtivo && !isLoading && (
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna Esquerda - Alimentos da Cesta */}
              <div className="bg-[#E8F5E9] rounded-[10px] p-4">
                <h4
                  className="text-[#2C3E50] text-base font-bold mb-3"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Alimentos da Cesta:
                </h4>
                <ul className="space-y-2 text-[#333] text-sm mb-4">
                  {produtosCesta.length > 0 ? (
                    produtosCesta.map((item) => (
                      <li key={item.id}>
                        - {item.produto?.nome} ({item.quantidade}{" "}
                        {item.produto?.medida || "un"})
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">
                      Nenhum item na cesta
                    </li>
                  )}
                </ul>
                <div className="pt-3 border-t border-[#126B3F]/20">
                  <p className="text-[#2C3E50] text-base font-bold">
                    Valor Total Cesta: {formatBRL(valorTotalCesta)}
                  </p>
                </div>
              </div>

              {/* Coluna Direita - Compras em Varejo */}
              <div className="bg-white border border-[#E0E0E0] rounded-[10px] p-4">
                <h4
                  className="text-[#2C3E50] text-base font-bold mb-3"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Compras em Varejo:
                </h4>
                <ul className="space-y-2 text-[#333] text-sm mb-4">
                  {produtosVarejo.length > 0 ? (
                    produtosVarejo.map((item) => (
                      <li key={item.id}>
                        - {item.produto?.nome} ({item.quantidade}{" "}
                        {item.produto?.medida || "un"})
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">
                      Nenhuma compra em varejo
                    </li>
                  )}
                </ul>
                <div className="pt-3 border-t border-[#E0E0E0]">
                  <p className="text-[#2C3E50] text-base font-bold">
                    Valor Total: {formatBRL(valorTotalVarejo)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gestão desse Ciclo */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
            Gestão desse Ciclo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoes.slice(0, 2).map((acao, idx) => (
              <Card
                key={idx}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  !acao.habilitado ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => acao.habilitado && navigate(acao.rota)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <acao.icone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {acao.titulo}
                        </h3>
                        {acao.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {acao.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {acao.descricao}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ações Administrativas */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
            Ações Administrativas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acoes.slice(2).map((acao, idx) => (
              <Card
                key={idx}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  !acao.habilitado ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => acao.habilitado && navigate(acao.rota)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <acao.icone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {acao.titulo}
                        </h3>
                        {acao.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {acao.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {acao.descricao}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Dashboard;
