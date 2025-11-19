import { useState, useMemo } from "react";
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
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  useListarCategorias,
  useAtualizarCategoria,
  useDeletarCategoria,
} from "@/hooks/graphql";

interface Categoria {
  id: string;
  nome: string;
  status: string;
  observacao?: string | null;
}

const AdminCategorias = () => {
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
  } = useFilters("/admin/categorias");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(
    null,
  );

  const { data: categorias = [], isLoading, error } = useListarCategorias();
  const { mutate: atualizarCategoria } = useAtualizarCategoria();
  const { mutate: deletarCategoria } = useDeletarCategoria();

  const filteredCategorias = useMemo(() => {
    let result = [...categorias];

    if (debouncedSearch) {
      result = result.filter((categoria) =>
        categoria.nome.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    if (filters.status.length > 0) {
      result = result.filter((categoria) => {
        const statusDisplay =
          categoria.status === "ativo" ? "Ativo" : "Inativo";
        return filters.status.includes(statusDisplay);
      });
    }

    return result;
  }, [categorias, filters, debouncedSearch]);

  if (isLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/admin/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando categorias...</p>
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
            onClick={() => navigate("/admin/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Erro ao carregar categorias: {error.message}
          </p>
        </div>
      </ResponsiveLayout>
    );
  }

  const handleEdit = (id: string) => {
    navigate(`/admin/categorias/${id}`);
  };

  const handleDelete = (categoria: Categoria) => {
    setCategoriaToDelete(categoria);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoriaToDelete) {
      deletarCategoria(
        { id: categoriaToDelete.id },
        {
          onSuccess: () => {
            toast({
              title: "Sucesso",
              description: `Categoria "${categoriaToDelete.nome}" excluída com sucesso`,
            });
            setDeleteDialogOpen(false);
            setCategoriaToDelete(null);
          },
          onError: (error) => {
            toast({
              title: "Erro",
              description: error.message,
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
    atualizarCategoria(
      { id, input: { status: statusBackend } },
      {
        onSuccess: () => {
          toast({
            title: "Status atualizado",
            description: `Status da categoria alterado para ${newStatus}.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Erro",
            description: error.message,
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
          onClick={() => navigate("/admin/dashboard")}
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
              page="Categorias de Alimentos"
              className="text-2xl md:text-3xl"
            />
            <p className="text-sm md:text-base text-muted-foreground">
              Gerenciar categorias dos alimentos comercializados
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
              resultCount={filteredCategorias.length}
              hasActiveFilters={hasActiveFilters()}
              filtersOpen={isOpen}
            />
          </div>
          <Button
            onClick={() => navigate("/admin/categorias/novo")}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Categoria
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Lista de Categorias
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredCategorias.length === 0 ? (
              <div className="p-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  {hasActiveFilters()
                    ? "Sem resultados para os filtros selecionados."
                    : "Nenhuma categoria cadastrada."}
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
                      <TableHead>Nome da Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategorias.map((categoria) => (
                      <TableRow key={categoria.id}>
                        <TableCell className="font-medium">
                          {categoria.nome}
                        </TableCell>
                        <TableCell>
                          <StatusToggle
                            currentStatus={
                              categoria.status === "ativo" ? "Ativo" : "Inativo"
                            }
                            onStatusChange={(newStatus) =>
                              handleStatusChange(categoria.id, newStatus)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(categoria.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden md:inline">Editar</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(categoria)}
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
      </FiltersPanel>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "
              {categoriaToDelete?.nome}"? Esta ação não pode ser desfeita.
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

export default AdminCategorias;
