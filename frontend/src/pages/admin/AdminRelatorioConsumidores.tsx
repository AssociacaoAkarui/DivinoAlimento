import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { useListarCiclos } from "@/hooks/graphql";
import { formatDateToBR } from "@/lib/date-formatters";

const AdminRelatorioConsumidores = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedCiclos, setSelectedCiclos] = useState<number[]>([]);

  const { data, isLoading } = useListarCiclos();

  const ciclos = useMemo(() => {
    if (!data?.listarCiclos?.ciclos) return [];

    return data.listarCiclos.ciclos
      .map((ciclo) => ({
        id: parseInt(ciclo.id),
        nome: ciclo.nome,
        status: ciclo.status,
        ofertaFim: ciclo.ofertaFim,
        pontoEntrega: ciclo.pontoEntrega?.nome || "Sem ponto de entrega",
      }))
      .sort((a, b) => {
        const dateA = new Date(a.ofertaFim);
        const dateB = new Date(b.ofertaFim);
        return dateB.getTime() - dateA.getTime();
      });
  }, [data]);

  const handleCicloToggle = (cicloId: number) => {
    setSelectedCiclos((prev) =>
      prev.includes(cicloId)
        ? prev.filter((id) => id !== cicloId)
        : [...prev, cicloId],
    );
  };

  const handleMostrarRelatorio = () => {
    if (selectedCiclos.length === 0) {
      toast.error("Selecione pelo menos um ciclo");
      return;
    }
    navigate(
      `/admin/relatorio-consumidores/resultado?ciclos=${selectedCiclos.join(",")}`,
    );
  };

  return (
    <ResponsiveLayout
      headerContent={<UserMenuLarge />}
      leftHeaderContent={
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center text-primary-foreground hover:opacity-80 transition-opacity focus-ring p-2 -ml-2"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
    >
      <div className="space-y-6">
        <div>
          <RoleTitle
            page="Relatório de Pedidos dos Consumidores"
            className="text-3xl"
          />
          <p className="text-muted-foreground mt-2">
            Selecione os ciclos para gerar o relatório consolidado.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selecione os Ciclos</CardTitle>
            <CardDescription>
              Marque os ciclos que deseja incluir no relatório
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : !isMobile ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Ciclo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ponto de Entrega</TableHead>
                      <TableHead>Data Fim Ofertas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ciclos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhum ciclo encontrado
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ciclos.map((ciclo) => (
                        <TableRow
                          key={ciclo.id}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => handleCicloToggle(ciclo.id)}
                        >
                          <TableCell>
                            <Checkbox
                              id={`ciclo-${ciclo.id}`}
                              checked={selectedCiclos.includes(ciclo.id)}
                              onCheckedChange={() =>
                                handleCicloToggle(ciclo.id)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {ciclo.nome}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                ciclo.status === "ativo"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {ciclo.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{ciclo.pontoEntrega}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              {formatDateToBR(ciclo.ofertaFim)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-3">
                {ciclos.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">
                        Nenhum ciclo encontrado
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  ciclos.map((ciclo) => (
                    <Card
                      key={ciclo.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleCicloToggle(ciclo.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`ciclo-mobile-${ciclo.id}`}
                            checked={selectedCiclos.includes(ciclo.id)}
                            onCheckedChange={() => handleCicloToggle(ciclo.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-medium">{ciclo.nome}</span>
                              <Badge
                                variant={
                                  ciclo.status === "ativo"
                                    ? "default"
                                    : "secondary"
                                }
                                className="shrink-0"
                              >
                                {ciclo.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Ponto:</span>
                                <span>{ciclo.pontoEntrega}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Fim: {formatDateToBR(ciclo.ofertaFim)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
            <div className="mt-6">
              <Button
                onClick={handleMostrarRelatorio}
                className="w-full sm:w-auto"
                disabled={selectedCiclos.length === 0}
              >
                Mostrar Relatório
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminRelatorioConsumidores;
