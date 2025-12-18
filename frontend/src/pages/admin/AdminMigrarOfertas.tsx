import { ArrowLeft, Edit2, Check, Loader2 } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatBRL } from "@/utils/currency";
import { useListarCiclos, useMigrarOfertas } from "@/hooks/graphql";
import {
  LISTAR_OFERTAS_POR_CICLO_QUERY,
  LISTAR_PEDIDOS_POR_CICLO_QUERY,
} from "@/graphql/operations";
import { graphqlClientSecure, getSessionToken } from "@/lib/graphql-client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ProdutoMigracao {
  produtoId: number;
  fornecedorId: number;
  produto: string;
  fornecedor: string;
  unidade: string;
  valor: number;
  ofertados: number;
  pedidos: number;
  sobraram: number;
  qtdMigrar: number;
  selecionado: boolean;
  ciclosOrigem: string[];
}

const AdminMigrarOfertas = () => {
  const { destinoId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [destinoSelecionadoId, setDestinoSelecionadoId] = useState<string>(
    destinoId || "",
  );
  const [ciclosOrigemIds, setCiclosOrigemIds] = useState<string[]>([]);
  const [produtos, setProdutos] = useState<ProdutoMigracao[]>([]);
  const [busca, setBusca] = useState("");
  const [editandoProduto, setEditandoProduto] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    fornecedor: string;
    valor: string;
  }>({
    fornecedor: "",
    valor: "",
  });
  const [carregandoSobras, setCarregandoSobras] = useState(false);

  const { data: ciclosData, isLoading: ciclosLoading } = useListarCiclos();
  const ciclos = ciclosData?.listarCiclos?.ciclos || [];

  const migrarOfertasMutation = useMigrarOfertas();

  const formatarPeriodo = (ciclo: {
    ofertaInicio?: string;
    ofertaFim?: string;
  }) => {
    if (!ciclo.ofertaInicio || !ciclo.ofertaFim) return "";
    const inicio = format(new Date(ciclo.ofertaInicio), "dd/MM/yyyy", {
      locale: ptBR,
    });
    const fim = format(new Date(ciclo.ofertaFim), "dd/MM/yyyy", {
      locale: ptBR,
    });
    return `${inicio} – ${fim}`;
  };

  const cicloDestino = useMemo(
    () => ciclos.find((c: { id: string }) => c.id === destinoSelecionadoId),
    [ciclos, destinoSelecionadoId],
  );

  const ciclosFinalizados = useMemo(
    () =>
      ciclos.filter(
        (c: { id: string; status: string }) =>
          c.status === "finalizado" && c.id !== destinoSelecionadoId,
      ),
    [ciclos, destinoSelecionadoId],
  );

  const ciclosAtivos = useMemo(
    () =>
      ciclos.filter(
        (c: { status: string }) =>
          c.status === "oferta" || c.status === "ativo",
      ),
    [ciclos],
  );

  const handleCarregarSobras = async () => {
    if (ciclosOrigemIds.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um ciclo de origem.",
        variant: "destructive",
      });
      return;
    }

    if (!cicloDestino) {
      toast({
        title: "Atenção",
        description: "Selecione um ciclo de destino.",
        variant: "destructive",
      });
      return;
    }

    setCarregandoSobras(true);

    try {
      const token = getSessionToken();
      const client = graphqlClientSecure(token);

      const produtosMap = new Map<string, ProdutoMigracao>();

      for (const cicloId of ciclosOrigemIds) {
        const [ofertasResult, pedidosResult] = await Promise.all([
          client.request(LISTAR_OFERTAS_POR_CICLO_QUERY, {
            cicloId: parseInt(cicloId),
          }),
          client.request(LISTAR_PEDIDOS_POR_CICLO_QUERY, {
            cicloId: parseInt(cicloId),
          }),
        ]);

        const ofertas = ofertasResult.listarOfertasPorCiclo || [];
        const pedidos = pedidosResult.listarPedidosPorCiclo || [];

        ofertas.forEach((oferta: any) => {
          if (!oferta.ofertaProdutos) return;

          oferta.ofertaProdutos.forEach((ofertaProduto: any) => {
            const produtoId = ofertaProduto.produtoId;
            const fornecedorId = oferta.usuarioId;
            const quantidade = ofertaProduto.quantidade || 0;
            const valorOferta = ofertaProduto.valorOferta || 0;
            const produtoNome = ofertaProduto.produto?.nome || "Produto";
            const fornecedorNome = oferta.usuario?.nome || "Fornecedor";

            let quantidadePedida = 0;
            pedidos.forEach((pedido: any) => {
              if (!pedido.pedidoConsumidoresProdutos) return;

              pedido.pedidoConsumidoresProdutos.forEach(
                (pedidoProduto: any) => {
                  if (pedidoProduto.produtoId === produtoId) {
                    quantidadePedida += pedidoProduto.quantidade || 0;
                  }
                },
              );
            });

            const sobra = Math.max(quantidade - quantidadePedida, 0);
            const chave = `${produtoId}_${fornecedorId}`;
            const existente = produtosMap.get(chave);

            if (existente) {
              existente.ofertados += quantidade;
              existente.pedidos += quantidadePedida;
              existente.sobraram += sobra;
              existente.qtdMigrar += sobra;
              existente.ciclosOrigem.push(cicloId);
            } else {
              produtosMap.set(chave, {
                produtoId,
                fornecedorId,
                produto: produtoNome,
                fornecedor: fornecedorNome,
                unidade: ofertaProduto.produto?.medida || "un",
                valor: valorOferta,
                ofertados: quantidade,
                pedidos: quantidadePedida,
                sobraram: sobra,
                qtdMigrar: sobra,
                selecionado: sobra > 0,
                ciclosOrigem: [cicloId],
              });
            }
          });
        });
      }

      const todosProdutos = Array.from(produtosMap.values());

      setCarregandoSobras(false);

      if (todosProdutos.every((p) => p.sobraram === 0)) {
        toast({
          title: "Atenção",
          description:
            "Nenhum item disponível para migração nos ciclos selecionados.",
          variant: "destructive",
        });
        return;
      }

      setProdutos(todosProdutos);
    } catch (error: any) {
      setCarregandoSobras(false);
      toast({
        title: "Erro ao carregar sobras",
        description: error.message || "Ocorreu um erro ao carregar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleToggleCicloOrigem = (cicloId: string) => {
    setCiclosOrigemIds((prev) =>
      prev.includes(cicloId)
        ? prev.filter((id) => id !== cicloId)
        : [...prev, cicloId],
    );
  };

  const handleToggleProduto = (produtoId: number, checked: boolean) => {
    setProdutos((prev) =>
      prev.map((p) =>
        p.produtoId === produtoId ? { ...p, selecionado: checked } : p,
      ),
    );
  };

  const handleQtdMigrarChange = (produtoId: number, value: number) => {
    setProdutos((prev) =>
      prev.map((p) => {
        if (p.produtoId === produtoId) {
          const qtd = Math.max(1, Math.min(value, p.sobraram));
          return { ...p, qtdMigrar: qtd };
        }
        return p;
      }),
    );
  };

  const handleSelecionarTodos = () => {
    setProdutos((prev) =>
      prev.map((p) => (p.sobraram > 0 ? { ...p, selecionado: true } : p)),
    );
  };

  const handleLimparSelecao = () => {
    setProdutos((prev) => prev.map((p) => ({ ...p, selecionado: false })));
  };

  const handleEditarProduto = (produtoId: number) => {
    const produto = produtos.find((p) => p.produtoId === produtoId);
    if (produto) {
      setEditandoProduto(produtoId);
      setEditValues({
        fornecedor: produto.fornecedor,
        valor: produto.valor.toString(),
      });
    }
  };

  const handleSalvarEdicao = (produtoId: number) => {
    setProdutos((prev) =>
      prev.map((p) => {
        if (p.produtoId === produtoId) {
          return {
            ...p,
            fornecedor: editValues.fornecedor,
            valor: parseFloat(editValues.valor) || p.valor,
          };
        }
        return p;
      }),
    );
    setEditandoProduto(null);
  };

  const handleSalvarMigracao = () => {
    const selecionados = produtos.filter((p) => p.selecionado);

    if (selecionados.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um produto para salvar.",
        variant: "destructive",
      });
      return;
    }

    if (!cicloDestino) {
      toast({
        title: "Erro",
        description: "Ciclo de destino não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (cicloDestino.status !== "oferta" && cicloDestino.status !== "ativo") {
      toast({
        title: "Erro",
        description:
          "Ciclo de destino precisa estar ativo para receber migração.",
        variant: "destructive",
      });
      return;
    }

    const input = {
      ciclosOrigemIds: ciclosOrigemIds.map((id) => parseInt(id)),
      cicloDestinoId: parseInt(destinoSelecionadoId),
      produtos: selecionados.map((p) => ({
        produtoId: p.produtoId,
        quantidade: p.qtdMigrar,
        valorOferta: p.valor,
        fornecedorId: p.fornecedorId,
      })),
    };

    migrarOfertasMutation.mutate(input, {
      onSuccess: () => {
        toast({
          title: "Ofertas migradas com sucesso!",
          description: `${selecionados.length} produtos foram adicionados ao ciclo de destino.`,
        });
        navigate("/admin/ciclo-index");
      },
      onError: (error: any) => {
        toast({
          title: "Erro ao migrar ofertas",
          description: error.message || "Ocorreu um erro ao migrar as ofertas.",
          variant: "destructive",
        });
      },
    });
  };

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.produto.toLowerCase().includes(busca.toLowerCase()) ||
      p.fornecedor.toLowerCase().includes(busca.toLowerCase()),
  );

  const produtosSelecionados = produtos.filter((p) => p.selecionado);
  const totalItens = produtosSelecionados.length;
  const totalQtd = produtosSelecionados.reduce(
    (sum, p) => sum + p.qtdMigrar,
    0,
  );
  const totalValor = produtosSelecionados.reduce(
    (sum, p) => sum + p.qtdMigrar * p.valor,
    0,
  );

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/ciclo-index")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        <div>
          <RoleTitle
            page="Migrar Ofertas entre Ciclos"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Selecione o ciclo de destino e as origens de onde deseja migrar
            produtos
          </p>
        </div>

        {!cicloDestino && (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Selecione o Ciclo de Destino
              </CardTitle>
              <CardDescription>
                Escolha um ciclo ativo para onde deseja migrar as ofertas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ciclosLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <Select
                  value={destinoSelecionadoId}
                  onValueChange={setDestinoSelecionadoId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o ciclo de destino (Ativo/Iniciado)" />
                  </SelectTrigger>
                  <SelectContent>
                    {ciclosAtivos.map((ciclo) => (
                      <SelectItem key={ciclo.id} value={ciclo.id}>
                        {ciclo.nome} • {formatarPeriodo(ciclo)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        )}

        {cicloDestino && (
          <>
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-primary">
                      Ciclo de Destino
                    </CardTitle>
                    <CardDescription className="text-base">
                      {cicloDestino.nome} • {formatarPeriodo(cicloDestino)}
                    </CardDescription>
                  </div>
                  <Badge variant="success">{cicloDestino.status}</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary">
                  Selecione os ciclos que deseja migrar as sobras
                </CardTitle>
                <CardDescription>
                  Você pode selecionar múltiplos ciclos finalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ciclosFinalizados.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Não há ciclos finalizados para selecionar como origem.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ciclosFinalizados.map((ciclo) => (
                      <Card
                        key={ciclo.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          ciclosOrigemIds.includes(ciclo.id)
                            ? "border-primary border-2 bg-primary/5"
                            : "border hover:border-primary/50"
                        }`}
                        onClick={() => handleToggleCicloOrigem(ciclo.id)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={ciclosOrigemIds.includes(ciclo.id)}
                              onCheckedChange={() =>
                                handleToggleCicloOrigem(ciclo.id)
                              }
                            />
                            <div className="flex-1">
                              <CardTitle className="text-base font-semibold">
                                {ciclo.nome}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {formatarPeriodo(ciclo)}
                              </CardDescription>
                            </div>
                            <Badge variant="warning">{ciclo.status}</Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/ciclo-index")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCarregarSobras}
                    disabled={ciclosOrigemIds.length === 0 || carregandoSobras}
                    variant="success"
                  >
                    {carregandoSobras ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      "Carregar sobras selecionadas"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {produtos.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-primary">
                    Produtos que sobraram
                  </CardTitle>
                  <CardDescription>
                    Selecione os produtos e quantidades que deseja migrar
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelecionarTodos}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Selecionar todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLimparSelecao}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Limpar seleção
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Buscar produto ou fornecedor..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Sel.</TableHead>
                      <TableHead>Alimento</TableHead>
                      <TableHead>Fornecedor(a)</TableHead>
                      <TableHead>Medida</TableHead>
                      <TableHead className="text-right">Ofertados</TableHead>
                      <TableHead className="text-right">Pedidos</TableHead>
                      <TableHead className="text-right">Sobraram</TableHead>
                      <TableHead className="text-right">Valor Unit.</TableHead>
                      <TableHead className="text-right">Migrar (Qtd)</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtosFiltrados.map((produto) => (
                      <TableRow
                        key={`${produto.produtoId}_${produto.fornecedorId}`}
                        className={produto.sobraram === 0 ? "opacity-50" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={produto.selecionado}
                            disabled={produto.sobraram === 0}
                            onCheckedChange={(checked) =>
                              handleToggleProduto(
                                produto.produtoId,
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {produto.produto}
                        </TableCell>
                        <TableCell>{produto.fornecedor}</TableCell>
                        <TableCell>{produto.unidade}</TableCell>
                        <TableCell className="text-right">
                          {produto.ofertados}
                        </TableCell>
                        <TableCell className="text-right">
                          {produto.pedidos}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {produto.sobraram}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatBRL(produto.valor)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="1"
                            max={produto.sobraram}
                            value={produto.qtdMigrar}
                            disabled={
                              produto.sobraram === 0 || !produto.selecionado
                            }
                            onChange={(e) =>
                              handleQtdMigrarChange(
                                produto.produtoId,
                                Number(e.target.value),
                              )
                            }
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          {produto.sobraram > 0 && (
                            <Popover
                              open={editandoProduto === produto.produtoId}
                              onOpenChange={(open) => {
                                if (open) {
                                  handleEditarProduto(produto.produtoId);
                                } else {
                                  setEditandoProduto(null);
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="fornecedor">
                                      Fornecedor
                                    </Label>
                                    <Input
                                      id="fornecedor"
                                      value={editValues.fornecedor}
                                      onChange={(e) =>
                                        setEditValues((prev) => ({
                                          ...prev,
                                          fornecedor: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="valor">
                                      Valor Unitário
                                    </Label>
                                    <Input
                                      id="valor"
                                      type="number"
                                      step="0.01"
                                      value={editValues.valor}
                                      onChange={(e) =>
                                        setEditValues((prev) => ({
                                          ...prev,
                                          valor: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditandoProduto(null)}
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleSalvarEdicao(produto.produtoId)
                                      }
                                      variant="success"
                                    >
                                      Salvar
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-sm font-medium">
                      Itens selecionados
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold text-primary">
                      {totalItens}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-sm font-medium">
                      Quantidade total
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold text-primary">
                      {totalQtd}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-sm font-medium">
                      Valor estimado
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold text-primary">
                      {formatBRL(totalValor)}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setProdutos([]);
                    setCiclosOrigemIds([]);
                  }}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSalvarMigracao}
                  disabled={
                    produtosSelecionados.length === 0 ||
                    migrarOfertasMutation.isPending
                  }
                  variant="success"
                  className="gap-2"
                >
                  {migrarOfertasMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Salvar no ciclo destino ({totalItens}{" "}
                      {totalItens === 1 ? "item" : "itens"})
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default AdminMigrarOfertas;
