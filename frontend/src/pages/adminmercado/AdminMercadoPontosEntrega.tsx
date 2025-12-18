import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { FiltersPanel } from "@/components/admin/FiltersPanel";
import { useFilters } from "@/hooks/useFilters";
import { Plus, Edit2, Trash2, ArrowLeft, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusToggle } from "@/components/ui/status-toggle";
import { RoleTitle } from "@/components/layout/RoleTitle";
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
  useListarPontosEntrega,
  useAtualizarPontoEntrega,
  useDeletarPontoEntrega,
  PontoEntrega,
} from "@/hooks/graphql";
import {
  formatarEndereco,
  formatarCidadeEstado,
} from "@/lib/pontoentrega-formatters";

const AdminMercadoPontosEntrega = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  } = useFilters("/adminmercado/pontos-entrega");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pontoToDelete, setPontoToDelete] = useState<PontoEntrega | null>(null);

  const { data, isLoading, error } = useListarPontosEntrega();
  const pontosEntrega = data?.listarPontosEntrega ?? [];
  const { mutate: atualizarPontoEntrega } = useAtualizarPontoEntrega();
  const { mutate: deletarPontoEntrega } = useDeletarPontoEntrega();

  const filteredPontosEntrega = useMemo(() => {
    let result = [...pontosEntrega];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (ponto) =>
          ponto.nome.toLowerCase().includes(searchLower) ||
          ponto.endereco?.toLowerCase().includes(searchLower) ||
          ponto.bairro?.toLowerCase().includes(searchLower) ||
          ponto.cidade?.toLowerCase().includes(searchLower),
      );
    }

    if (filters.status.length > 0) {
      result = result.filter((ponto) => {
        const statusDisplay = ponto.status === "ativo" ? "Ativo" : "Inativo";
        return filters.status.includes(statusDisplay);
      });
    }

    if (filters.cidade?.length > 0) {
      result = result.filter((ponto) =>
        ponto.cidade ? filters.cidade.includes(ponto.cidade) : false,
      );
    }

    return result;
  }, [pontosEntrega, filters, debouncedSearch]);

  const cidadesUnicas = useMemo(() => {
    const cidades: string[] = [];
    for (const ponto of pontosEntrega) {
      if (ponto.cidade && !cidades.includes(ponto.cidade)) {
        cidades.push(ponto.cidade);
      }
    }
    return cidades.sort();
  }, [pontosEntrega]);

  if (isLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/adminmercado/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Carregando pontos de entrega...
          </p>
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
            size="icon-sm"
            onClick={() => navigate("/adminmercado/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Erro ao carregar pontos de entrega: {error.message}
          </p>
        </div>
      </ResponsiveLayout>
    );
  }

  const handleEdit = (id: string) => {
    navigate(`/adminmercado/pontos-entrega/${id}`);
  };

  const handleDelete = (ponto: PontoEntrega) => {
    setPontoToDelete(ponto);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (pontoToDelete) {
      deletarPontoEntrega(
        { id: pontoToDelete.id },
        {
          onSuccess: () => {
            toast({
              title: "Sucesso",
              description: `Ponto de entrega "${pontoToDelete.nome}" excluído com sucesso`,
            });
            setDeleteDialogOpen(false);
            setPontoToDelete(null);
          },
          onError: (err) => {
            toast({
              title: "Erro",
              description: err.message,
              variant: "destructive",
            });
          },
        },
      );
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Ativo" | "Inativo",
  ) => {
    const statusBackend = newStatus === "Ativo" ? "ativo" : "inativo";
    atualizarPontoEntrega(
      { id, input: { status: statusBackend } },
      {
        onSuccess: () => {
          toast({
            title: "Status atualizado",
            description: `Status do ponto de entrega alterado para ${newStatus}.`,
          });
        },
        onError: (err) => {
          toast({
            title: "Erro",
            description: err.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/adminmercado/dashboard")}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6 md:space-y-8">
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <RoleTitle
              page="Pontos de Entrega"
              className="text-2xl md:text-3xl"
            />
            <p className="text-sm md:text-base text-muted-foreground">
              Gerenciar pontos de entrega para distribuição
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <FiltersBar
              searchValue={filters.search}
              onSearchChange={(value) => updateFilter("search", value)}
              onFiltersClick={() => setIsOpen(true)}
              activeChips={getActiveChips()}
              onRemoveChip={clearFilterGroup}
              resultCount={filteredPontosEntrega.length}
              hasActiveFilters={hasActiveFilters()}
              filtersOpen={isOpen}
            />
          </div>
          <Button
            onClick={() => navigate("/adminmercado/pontos-entrega/novo")}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Ponto
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Lista de Pontos de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPontosEntrega.length === 0 ? (
              <div className="p-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  {hasActiveFilters()
                    ? "Sem resultados para os filtros selecionados."
                    : "Nenhum ponto de entrega cadastrado."}
                </p>
                {hasActiveFilters() && (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead>Cidade/Estado</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPontosEntrega.map((ponto) => (
                      <TableRow key={ponto.id}>
                        <TableCell className="font-medium">
                          {ponto.nome}
                        </TableCell>
                        <TableCell>{formatarEndereco(ponto) || "-"}</TableCell>
                        <TableCell>
                          {formatarCidadeEstado(ponto) || "-"}
                        </TableCell>
                        <TableCell>
                          <StatusToggle
                            currentStatus={
                              ponto.status === "ativo" ? "Ativo" : "Inativo"
                            }
                            onStatusChange={(newStatus) =>
                              handleStatusChange(ponto.id, newStatus)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(ponto.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden md:inline">Editar</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(ponto)}
                              className="flex items-center gap-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden md:inline">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
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
            {["Ativo", "Inativo"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => toggleArrayValue("status", status)}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>
        {cidadesUnicas.length > 0 && (
          <div className="space-y-4">
            <Label>Cidade</Label>
            <div className="space-y-2">
              {cidadesUnicas.map((cidade) => (
                <div key={cidade} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cidade-${cidade}`}
                    checked={filters.cidade?.includes(cidade) || false}
                    onCheckedChange={() => toggleArrayValue("cidade", cidade)}
                  />
                  <label
                    htmlFor={`cidade-${cidade}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {cidade}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </FiltersPanel>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o ponto de entrega "
              {pontoToDelete?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
};

export default AdminMercadoPontosEntrega;
