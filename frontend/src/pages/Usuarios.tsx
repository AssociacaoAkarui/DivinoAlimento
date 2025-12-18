import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { Search, Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useListarUsuarios } from "@/hooks/graphql";
import { RoleTitle } from "@/components/layout/RoleTitle";
import {
  filterUsuariosBySearch,
  sortUsuariosByName,
  type Usuario,
} from "@/lib/usuarios-helpers";
import {
  formatStatus,
  getStatusBadgeColor,
  formatListError,
  getEmptyListMessage,
  getLoadingMessage,
  getUsersCountMessage,
} from "@/lib/usuarios-formatters";
import { useToast } from "@/hooks/use-toast";

const Usuarios = () => {
  const navigate = useNavigate();
  const { activeRole: _activeRole } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usuarios = [], isLoading, error } = useListarUsuarios();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  if (error) {
    toast({
      title: "Erro ao carregar",
      description: formatListError(error),
      variant: "destructive",
    });
  }

  const sortedUsuarios = sortUsuariosByName(usuarios);
  const filteredUsers = filterUsuariosBySearch(sortedUsuarios, searchTerm);

  const handleEdit = (id: string) => {
    console.warn("Editar usuário:", id);
    // TODO: Implementar edição
  };

  const handleDelete = (id: string) => {
    console.warn("Excluir usuário:", id);
    // TODO: Implementar exclusão
  };

  const handleAddUser = () => {
    console.warn("Adicionar usuário");
    // TODO: Implementar adição
  };

  return (
    <ResponsiveLayout
      headerContent={
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <LogOut className="w-4 h-4 mr-1" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      }
    >
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <RoleTitle page="Usuários" className="text-2xl md:text-3xl" />
            <p className="text-sm md:text-base text-muted-foreground">
              Gerenciar perfis e acessos do sistema
            </p>
          </div>
        </div>

        {/* Search and Actions */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar usuário por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleAddUser} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {isLoading
                ? getLoadingMessage()
                : `Lista de Usuários (${getUsersCountMessage(filteredUsers.length)})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground">
                {getLoadingMessage()}
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    {getEmptyListMessage(searchTerm)}
                  </div>
                ) : (
                  filteredUsers.map((usuario) => (
                    <div key={usuario.id} className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-sm md:text-base">
                              {usuario.nome}
                            </h3>
                            <Badge
                              className={getStatusBadgeColor(usuario.status)}
                            >
                              {formatStatus(usuario.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {usuario.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(usuario.id)}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden md:inline">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(usuario.id)}
                            className="flex items-center gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden md:inline">Excluir</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default Usuarios;
