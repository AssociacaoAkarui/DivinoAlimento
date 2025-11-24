import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useListarCiclos } from "@/hooks/graphql";

// Formatar data para exibição
function formatarDataBR(dataStr: string): string {
  if (!dataStr) return "";
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ConsumidorSelecionarCiclo() {
  const navigate = useNavigate();

  const { data: ciclosData, isLoading, error } = useListarCiclos(20);

  const ciclosAtivos = useMemo(() => {
    if (!ciclosData?.listarCiclos?.ciclos) return [];
    return ciclosData.listarCiclos.ciclos
      .filter((ciclo) => ciclo.status === "oferta")
      .sort(
        (a, b) =>
          new Date(b.ofertaInicio).getTime() -
          new Date(a.ofertaInicio).getTime(),
      );
  }, [ciclosData]);

  const handlePedidoVarejo = (cicloId: string) => {
    navigate(`/pedidoConsumidores/${cicloId}`);
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6 pt-8">
        <div>
          <RoleTitle
            page="Selecione o Ciclo para Pedido em Varejo"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Escolha em qual ciclo ativo você deseja fazer seu pedido de varejo.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 text-center">
            <p className="text-destructive">
              Erro ao carregar ciclos: {error.message}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Por favor, verifique se você está autenticado e tente novamente.
            </p>
          </Card>
        )}

        {/* Desktop Table */}
        {!isLoading && !error && (
          <div className="hidden md:block">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Ciclo</TableHead>
                    <TableHead>Período de Ofertas</TableHead>
                    <TableHead>Local de Entrega</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ciclosAtivos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-muted-foreground">
                          Nenhum ciclo ativo disponível no momento.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ciclosAtivos.map((ciclo) => (
                      <TableRow key={ciclo.id}>
                        <TableCell className="font-medium">
                          {ciclo.nome}
                        </TableCell>
                        <TableCell>
                          {formatarDataBR(ciclo.ofertaInicio)} –{" "}
                          {formatarDataBR(ciclo.ofertaFim)}
                        </TableCell>
                        <TableCell>
                          {ciclo.pontoEntrega?.nome || "A definir"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handlePedidoVarejo(ciclo.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Pedido em Varejo
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* Mobile Cards */}
        {!isLoading && !error && (
          <div className="md:hidden space-y-4">
            {ciclosAtivos.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">
                  Nenhum ciclo ativo disponível no momento.
                </p>
              </Card>
            ) : (
              ciclosAtivos.map((ciclo) => (
                <Card key={ciclo.id} className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg">{ciclo.nome}</h3>
                      <Badge variant="success">Ativo</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <span className="font-medium">Período:</span>{" "}
                        {formatarDataBR(ciclo.ofertaInicio)} –{" "}
                        {formatarDataBR(ciclo.ofertaFim)}
                      </p>
                      <p>
                        <span className="font-medium">Local:</span>{" "}
                        {ciclo.pontoEntrega?.nome || "A definir"}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePedidoVarejo(ciclo.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Pedido em Varejo
                  </Button>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}
