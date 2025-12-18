import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useBuscarProduto,
  useAtualizarProduto,
  useDeletarProduto,
  useListarCategorias,
} from "@/hooks/graphql";

const AdminProdutoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const { data: produto, isLoading } = useBuscarProduto(id || "");
  const { mutate: atualizarProduto, isPending: isUpdating } =
    useAtualizarProduto();
  const { mutate: deletarProduto, isPending: isDeleting } = useDeletarProduto();
  const { data: categoriasData = [] } = useListarCategorias();

  const [formData, setFormData] = useState({
    nome: "",
    categoriaId: "",
    descricao: "",
    status: "ativo",
  });

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        categoriaId: produto.categoriaId?.toString() || "",
        descricao: produto.descritivo || "",
        status: produto.status,
      });
    }
  }, [produto]);
  const _unidades = ["kg", "unidade", "maço", "litro", "dúzia", "grama"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.categoriaId) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!id) return;

    atualizarProduto(
      {
        id,
        input: {
          nome: formData.nome,
          categoriaId: parseInt(formData.categoriaId),
          status: formData.status,
          descritivo: formData.descricao || undefined,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Alimento atualizado",
            description: "As alterações foram salvas com sucesso.",
          });
          navigate("/admin/alimentos");
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

  const handleDelete = () => {
    if (!id) return;

    deletarProduto(
      { id },
      {
        onSuccess: () => {
          toast({
            title: "Alimento excluído",
            description: "O alimento foi removido com sucesso.",
          });
          navigate("/admin/alimentos");
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

  const handleCancel = () => {
    navigate("/admin/alimentos");
  };

  if (isLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando produto...</p>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!produto) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Produto não encontrado.</p>
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
          onClick={() => navigate(-1)}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <RoleTitle
              page="Editar Alimento Base"
              className="text-2xl md:text-3xl"
            />
            <p className="text-sm md:text-base text-muted-foreground">
              Atualize as informações do alimento
            </p>
          </div>
          <Badge variant={formData.status === "ativo" ? "success" : "warning"}>
            {formData.status === "ativo" ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Alimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome do Produto */}
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome do Alimento <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: Tomate Orgânico"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria">
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoriaId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoriaId: value })
                  }
                  required
                >
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasData.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Alimento</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descreva o alimento..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-6 md:justify-between">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full md:w-auto"
              >
                Cancelar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full md:w-auto text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deseja realmente excluir este alimento? Esta ação não pode
                      ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isUpdating || isDeleting}
            >
              {isUpdating ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutoEditar;
