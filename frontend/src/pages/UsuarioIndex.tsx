import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { FiltersPanel } from "@/components/admin/FiltersPanel";
import { useFilters } from "@/hooks/useFilters";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { StatusToggle } from "@/components/ui/status-toggle";

import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { RoleTitle } from "@/components/layout/RoleTitle";
import {
  useListarUsuarios,
  useAtualizarUsuario,
  useDeletarUsuario,
} from "@/hooks/graphql";
import {
  applyAllFilters,
  normalizeUsuarios,
} from "@/lib/usuario-index-helpers";

interface Usuario {
  id: string;
  nomeCompleto?: string;
  nome: string;
  email: string;
  status: "Ativo" | "Inativo" | "ativo" | "inativo";
  perfis: string[];
}

const UsuarioIndex = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: usuariosBackend = [], isLoading, error } = useListarUsuarios();
  const atualizarUsuario = useAtualizarUsuario();
  const deletarUsuario = useDeletarUsuario();
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
  } = useFilters("/usuario-index");

  const usuarios: Usuario[] = normalizeUsuarios(usuariosBackend);

  const perfisDisponiveis = [
    "Administrador(a)",
    "Administrador(a) de Mercado",
    "Fornecedor(a)",
    "Consumidor(a)",
  ];

  const filteredUsers = useMemo(() => {
    return applyAllFilters(usuarios, filters, debouncedSearch);
  }, [usuarios, filters, debouncedSearch]);

  const handleEdit = (id: string) => {
    navigate(`/usuario/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const resultado = await deletarUsuario.mutateAsync({ id });

      if (resultado.deletarUsuario.success) {
        toast({
          title: "Sucesso",
          description: resultado.deletarUsuario.message,
          className: "bg-green-600 text-white",
        });
      } else {
        toast({
          title: "Não foi possível deletar",
          description: resultado.deletarUsuario.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao deletar usuário",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleAddUser = () => {
    navigate("/usuario");
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Ativo" | "Inativo",
  ) => {
    try {
      await atualizarUsuario.mutateAsync({
        id,
        input: {
          status: newStatus.toLowerCase() as "ativo" | "inativo",
        },
      });
      toast({
        title: "Status atualizado",
        description: `Status do usuário alterado para ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
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
            <RoleTitle page="Usuários" className="text-2xl md:text-3xl" />
            <p className="text-sm md:text-base text-muted-foreground">
              Gerenciar perfis e acessos do sistema
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
              resultCount={filteredUsers.length}
              hasActiveFilters={hasActiveFilters()}
              filtersOpen={isOpen}
            />
          </div>
          <Button onClick={handleAddUser} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Lista de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground">
                Carregando usuários...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-destructive">
                Erro ao carregar usuários: {error.message}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  {hasActiveFilters()
                    ? "Sem resultados para os filtros selecionados."
                    : "Nenhum usuário cadastrado."}
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
                      <TableHead>Nome Completo</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Perfis</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">
                          {usuario.nomeCompleto}
                        </TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <StatusToggle
                            currentStatus={usuario.status}
                            onStatusChange={(newStatus) =>
                              handleStatusChange(usuario.id, newStatus)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {usuario.perfis.map((perfil, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {perfil}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(usuario.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden md:inline">Editar</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="hidden md:inline">
                                    Excluir
                                  </span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Deseja realmente excluir este usuário? Esta
                                    ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(usuario.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

        <div className="space-y-4">
          <Label>Perfis</Label>
          <div className="space-y-2">
            {perfisDisponiveis.map((perfil) => (
              <div key={perfil} className="flex items-center space-x-2">
                <Checkbox
                  id={`perfil-${perfil}`}
                  checked={filters.perfis.includes(perfil)}
                  onCheckedChange={() => toggleArrayValue("perfis", perfil)}
                />
                <label
                  htmlFor={`perfil-${perfil}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {perfil}
                </label>
              </div>
            ))}
          </div>
        </div>
      </FiltersPanel>
    </ResponsiveLayout>
  );
};

export default UsuarioIndex;
