import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  useListarProdutos,
  useAtualizarProduto,
  useDeletarProduto,
} from "@/hooks/graphql";
import { Produto } from "@/types/graphql";

const AdminProdutos = () => {
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
  } = useFilters("/admin/alimentos");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState<Produto | null>(null);

  const { data: produtos = [], isLoading, error } = useListarProdutos();
  const { mutate: atualizarProduto } = useAtualizarProduto();
  const { mutate: deletarProduto } = useDeletarProduto();

  const categorias = useMemo(() => {
    return Array.from(
      new Set(
        produtos
          .map((p) => p.categoria?.nome)
          .filter((nome): nome is string => !!nome),
      ),
    );
  }, [produtos]);

  const filteredProdutos = useMemo(() => {
    let result = [...produtos];

    if (debouncedSearch) {
      result = result.filter((produto) =>
        produto.nome.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    if (filters.status.length > 0) {
      result = result.filter((produto) => {
        const statusDisplay = produto.status === "ativo" ? "Ativo" : "Inativo";
        return filters.status.includes(statusDisplay);
      });
    }

    if (filters.categoria.length > 0) {
      result = result.filter((produto) =>
        filters.categoria.includes(produto.categoria?.nome || ""),
      );
    }

    result.sort((a, b) => {
      const statusA = a.status === "ativo" ? 0 : 1;
      const statusB = b.status === "ativo" ? 0 : 1;
      if (statusA !== statusB) {
        return statusA - statusB;
      }
      return a.nome.localeCompare(b.nome);
    });

    return result;
  }, [produtos, filters, debouncedSearch]);

  const handleEdit = (id: string) => {
    navigate(`/admin/alimento/${id}`);
  };

  const handleDelete = (produto: Produto) => {
    setProdutoToDelete(produto);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!produtoToDelete) return;

    deletarProduto(
      { id: produtoToDelete.id },
      {
        onSuccess: () => {
          toast({
            title: "Alimento excluído",
            description: "O alimento foi removido com sucesso.",
          });
          setDeleteDialogOpen(false);
          setProdutoToDelete(null);
        },
        onError: (error: Error) => {
          toast({
            title: "Erro ao excluir",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleAddProduto = () => {
    navigate("/admin/alimento");
  };

  const handleStatusChange = (id: string, newStatus: "Ativo" | "Inativo") => {
    const statusBackend = newStatus === "Ativo" ? "ativo" : "inativo";

    atualizarProduto(
      {
        id,
        input: { status: statusBackend },
      },
      {
        onSuccess: () => {
          toast({
            title: "Status atualizado",
            description: `Status do alimento alterado para ${newStatus}.`,
          });
        },
        onError: (error: Error) => {
          toast({
            title: "Erro ao atualizar",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

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
          <p className="text-muted-foreground">Carregando alimentos...</p>
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
          <p className="text-destructive">Erro ao carregar alimentos.</p>
        </div>
      </ResponsiveLayout>
    );
  }

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
            <RoleTitle page="Alimentos" className="text-2xl md:text-3xl" />
            <p className="text-sm md:text-base text-muted-foreground">
              Gerencie alimentos base cadastrados no sistema
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
              resultCount={filteredProdutos.length}
              hasActiveFilters={hasActiveFilters()}
              filtersOpen={isOpen}
            />
          </div>
          <Button onClick={handleAddProduto} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Alimento
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Lista de Alimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredProdutos.length === 0 ? (
              <div className="p-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  {hasActiveFilters()
                    ? "Sem resultados para os filtros selecionados."
                    : "Nenhum alimento cadastrado."}
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
                      <TableHead>Nome do Alimento</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProdutos.map((produto) => {
                      const statusDisplay =
                        produto.status === "ativo" ? "Ativo" : "Inativo";
                      return (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">
                            {produto.nome}
                          </TableCell>
                          <TableCell>
                            {produto.categoria?.nome || "-"}
                          </TableCell>
                          <TableCell>
                            <StatusToggle
                              currentStatus={statusDisplay}
                              onStatusChange={(newStatus) =>
                                handleStatusChange(produto.id, newStatus)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(produto.id)}
                                className="flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span className="hidden md:inline">Editar</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(produto)}
                                className="flex items-center gap-2 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden md:inline">
                                  Excluir
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

        <div className="space-y-4">
          <Label>Categoria</Label>
          <div className="space-y-2">
            {categorias.map((categoria) => (
              <div key={categoria} className="flex items-center space-x-2">
                <Checkbox
                  id={`categoria-${categoria}`}
                  checked={filters.categoria.includes(categoria)}
                  onCheckedChange={() =>
                    toggleArrayValue("categoria", categoria)
                  }
                />
                <label
                  htmlFor={`categoria-${categoria}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {categoria}
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
              Deseja realmente excluir o alimento "{produtoToDelete?.nome}"?
              Esta ação não pode ser desfeita.
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

export default AdminProdutos;
