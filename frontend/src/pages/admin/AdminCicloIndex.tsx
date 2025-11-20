import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { FiltersPanel } from "@/components/admin/FiltersPanel";
import { useFilters } from "@/hooks/useFilters";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Settings,
  Trash2,
  Tags,
  ArrowLeft,
  Truck,
  Users,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { useListarCiclos, useDeletarCiclo } from "@/hooks/graphql";
import {
  formatDate,
  formatStatus,
  getStatusColor,
  getCicloPeriodoLabel,
} from "@/lib/ciclo-helpers";

export default function AdminCicloIndex() {
  const navigate = useNavigate();
  const {
    filters,
    debouncedSearch,
    updateFilter,
    toggleArrayValue,
    clearFilters,
    clearFilterGroup,
    getActiveChips,
    hasActiveFilters,
    isOpen,
    setIsOpen,
  } = useFilters("/admin/ciclo-index");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cicloToDelete, setCicloToDelete] = useState<string | null>(null);

  // GraphQL hooks
  const { data, isLoading, error } = useListarCiclos(100);
  const deletarCicloMutation = useDeletarCiclo();

  const ciclos = data?.listarCiclos?.ciclos || [];

  const filteredCiclos = useMemo(() => {
    let result = [...ciclos];

    if (debouncedSearch) {
      result = result.filter((ciclo) =>
        ciclo.nome.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    if (filters.status.length > 0) {
      result = result.filter((ciclo) => filters.status.includes(ciclo.status));
    }

    return result.sort(
      (a, b) =>
        new Date(b.ofertaInicio).getTime() - new Date(a.ofertaInicio).getTime(),
    );
  }, [ciclos, filters, debouncedSearch]);

  const handleDelete = (id: string) => {
    setCicloToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (cicloToDelete) {
      try {
        await deletarCicloMutation.mutateAsync({ id: cicloToDelete });
        toast({
          title: "Ciclo excluido",
          description: "O ciclo foi excluido com sucesso.",
        });
        setDeleteDialogOpen(false);
        setCicloToDelete(null);
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Nao foi possivel excluir o ciclo.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/dashboard")}
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
            onClick={() => navigate("/admin/dashboard")}
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
          onClick={() => navigate("/admin/dashboard")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        <div>
          <RoleTitle page="Gestao de Ciclos" className="text-2xl md:text-3xl" />
          <p className="text-sm md:text-base text-muted-foreground">
            Acompanhe, edite e crie novos ciclos operacionais.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <FiltersBar
              searchValue={filters.search}
              onSearchChange={(value) => updateFilter("search", value)}
              onFiltersClick={() => setIsOpen(true)}
              activeChips={getActiveChips()}
              onRemoveChip={clearFilterGroup}
              resultCount={filteredCiclos.length}
              hasActiveFilters={hasActiveFilters()}
              filtersOpen={isOpen}
            />
          </div>
          <Button
            onClick={() => navigate("/admin/ciclo")}
            className="bg-primary hover:bg-primary/90 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Ciclo
          </Button>
        </div>

        <div className="hidden md:block">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Ciclo</TableHead>
                  <TableHead>Ponto de Entrega</TableHead>
                  <TableHead>Periodo de Ofertas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCiclos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 space-y-4"
                    >
                      <p className="text-muted-foreground">
                        {hasActiveFilters()
                          ? "Sem resultados para os filtros selecionados."
                          : "Nenhum ciclo encontrado."}
                      </p>
                      {hasActiveFilters() && (
                        <Button variant="outline" onClick={clearFilters}>
                          Limpar filtros
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCiclos.map((ciclo) => (
                    <TableRow key={ciclo.id}>
                      <TableCell className="font-medium">
                        {ciclo.nome}
                      </TableCell>
                      <TableCell>{ciclo.pontoEntrega?.nome || "-"}</TableCell>
                      <TableCell>{getCicloPeriodoLabel(ciclo)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ciclo.status)}>
                          {formatStatus(ciclo.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <div className="flex justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    navigate(`/admin/ciclo/${ciclo.id}`)
                                  }
                                  className="h-10 w-10 border-2 border-primary hover:bg-primary/10"
                                >
                                  <Settings className="h-5 w-5 text-primary" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar Ciclo</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    navigate(`/oferta/${ciclo.id}`)
                                  }
                                  className="h-10 w-10 border-2 border-primary hover:bg-primary/10"
                                >
                                  <Tags className="h-5 w-5 text-primary" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Inserir/editar ofertas</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    navigate(
                                      `/admin/migrar-ofertas/${ciclo.id}`,
                                    )
                                  }
                                  disabled={ciclo.status === "finalizado"}
                                  className="h-10 w-10 border-2 border-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Migrar ofertas de outro ciclo"
                                >
                                  <RefreshCw className="h-5 w-5 text-primary" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Migrar ofertas de outro ciclo</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    navigate(
                                      `/admin/entregas-fornecedores/${ciclo.id}`,
                                    )
                                  }
                                  className="h-10 w-10 border-2 border-primary hover:bg-primary/10"
                                >
                                  <Truck className="h-5 w-5 text-primary" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Entregas dos Fornecedores</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    navigate(
                                      `/admin/pedidos-consumidores/${ciclo.id}`,
                                    )
                                  }
                                  className="h-10 w-10 border-2 border-primary hover:bg-primary/10"
                                >
                                  <Users className="h-5 w-5 text-primary" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Pedidos dos Consumidores</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDelete(ciclo.id)}
                                  className="h-10 w-10 border-2 border-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-5 w-5 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Excluir Ciclo</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {filteredCiclos.length === 0 ? (
            <Card className="p-4 text-center">
              <p className="text-muted-foreground">
                {hasActiveFilters()
                  ? "Sem resultados para os filtros selecionados."
                  : "Nenhum ciclo encontrado."}
              </p>
              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Limpar filtros
                </Button>
              )}
            </Card>
          ) : (
            filteredCiclos.map((ciclo) => (
              <Card key={ciclo.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{ciclo.nome}</h3>
                    <Badge className={getStatusColor(ciclo.status)}>
                      {formatStatus(ciclo.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Ponto: {ciclo.pontoEntrega?.nome || "-"}</p>
                    <p>Periodo: {getCicloPeriodoLabel(ciclo)}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/ciclo/${ciclo.id}`)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ciclo.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <FiltersPanel
        open={isOpen}
        onOpenChange={setIsOpen}
        onApply={() => {}}
        onClear={clearFilters}
      >
        <div className="space-y-4">
          <Label>Status</Label>
          <div className="space-y-2">
            {["oferta", "composicao", "atribuicao", "finalizado"].map(
              (status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => toggleArrayValue("status", status)}
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="text-sm font-medium cursor-pointer capitalize"
                  >
                    {formatStatus(status)}
                  </label>
                </div>
              ),
            )}
          </div>
        </div>
      </FiltersPanel>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir este ciclo? Esta acao nao pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deletarCicloMutation.isPending}
            >
              {deletarCicloMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir Ciclo"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
}
