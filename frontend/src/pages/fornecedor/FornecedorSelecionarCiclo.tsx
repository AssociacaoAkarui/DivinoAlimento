import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { useListarCiclos } from "@/hooks/graphql";
import { formatDate, getCicloPeriodoLabel } from "@/lib/ciclo-helpers";

export default function FornecedorSelecionarCiclo() {
  const navigate = useNavigate();

  // GraphQL hook
  const { data, isLoading, error } = useListarCiclos(100);

  const ciclos = data?.listarCiclos?.ciclos || [];

  // Filtra apenas ciclos ativos (status !== 'finalizado')
  const ciclosAtivos = useMemo(() => {
    return ciclos
      .filter((ciclo) => ciclo.status !== "finalizado")
      .sort(
        (a, b) =>
          new Date(b.ofertaInicio).getTime() -
          new Date(a.ofertaInicio).getTime(),
      );
  }, [ciclos]);

  const handleOfertarAlimento = (cicloId: string) => {
    navigate(`/oferta/${cicloId}`);
  };

  if (isLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/fornecedor/loja")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/fornecedor/loja")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Erro ao carregar ciclos: {error.message}
          </p>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/fornecedor/loja")}
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
            page="Selecione o Ciclo para Ofertar"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Escolha em qual ciclo ativo voce deseja ofertar seus alimentos.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Ciclo</TableHead>
                  <TableHead>Periodo de Ofertas</TableHead>
                  <TableHead>Ponto de Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ciclosAtivos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum ciclo ativo disponivel no momento.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  ciclosAtivos.map((ciclo) => (
                    <TableRow key={ciclo.id}>
                      <TableCell className="font-medium">
                        {ciclo.nome}
                      </TableCell>
                      <TableCell>{getCicloPeriodoLabel(ciclo)}</TableCell>
                      <TableCell>{ciclo.pontoEntrega?.nome || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="success">Ativo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleOfertarAlimento(ciclo.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Ofertar Alimento
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {ciclosAtivos.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                Nenhum ciclo ativo disponivel no momento.
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
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">Periodo:</span>{" "}
                      {getCicloPeriodoLabel(ciclo)}
                    </p>
                    <p>
                      <span className="font-medium">Ponto:</span>{" "}
                      {ciclo.pontoEntrega?.nome || "-"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleOfertarAlimento(ciclo.id)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ofertar Alimento
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}
