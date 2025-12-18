import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import {
  useBuscarPontoEntrega,
  useAtualizarPontoEntrega,
  useDeletarPontoEntrega,
} from "@/hooks/graphql";

const AdminMercadoPontoEntregaEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    pontoReferencia: "",
    status: "ativo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading, error } = useBuscarPontoEntrega(id || "");
  const pontoEntrega = data?.buscarPontoEntrega;
  const { mutate: atualizarPontoEntrega, isPending: isUpdating } =
    useAtualizarPontoEntrega();
  const { mutate: deletarPontoEntrega, isPending: isDeleting } =
    useDeletarPontoEntrega();

  useEffect(() => {
    if (pontoEntrega) {
      setFormData({
        nome: pontoEntrega.nome,
        endereco: pontoEntrega.endereco || "",
        bairro: pontoEntrega.bairro || "",
        cidade: pontoEntrega.cidade || "",
        estado: pontoEntrega.estado || "",
        cep: pontoEntrega.cep || "",
        pontoReferencia: pontoEntrega.pontoReferencia || "",
        status: pontoEntrega.status,
      });
    }
  }, [pontoEntrega]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome do ponto de entrega é obrigatório";
    }
    if (!formData.endereco.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    }
    if (!formData.bairro.trim()) {
      newErrors.bairro = "Bairro é obrigatório";
    }
    if (!formData.cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }
    if (!formData.estado.trim()) {
      newErrors.estado = "Estado é obrigatório";
    }
    if (!formData.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm() && id) {
      atualizarPontoEntrega(
        {
          id,
          input: {
            nome: formData.nome,
            endereco: formData.endereco,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado,
            cep: formData.cep,
            pontoReferencia: formData.pontoReferencia,
            status: formData.status,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Sucesso",
              description: "Ponto de entrega atualizado com sucesso",
            });
            navigate("/adminmercado/pontos-entrega");
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
    } else {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (id) {
      deletarPontoEntrega(
        { id },
        {
          onSuccess: () => {
            toast({
              title: "Sucesso",
              description: "Ponto de entrega excluído com sucesso",
            });
            navigate("/adminmercado/pontos-entrega");
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

  const handleCancel = () => {
    navigate("/adminmercado/pontos-entrega");
  };

  if (isLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/adminmercado/pontos-entrega")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Carregando ponto de entrega...
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
            onClick={() => navigate("/adminmercado/pontos-entrega")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Erro ao carregar ponto de entrega: {error.message}
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
          size="icon-sm"
          onClick={() => navigate("/adminmercado/pontos-entrega")}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div>
          <RoleTitle
            page="Editar Ponto de Entrega"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Atualize as informações do ponto de entrega
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Informações do Ponto de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome do Ponto de Entrega{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Ex: Centro Comunitário, Praça Central..."
                className={errors.nome ? "border-destructive" : ""}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endereco">
                  Endereço <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) =>
                    handleInputChange("endereco", e.target.value)
                  }
                  placeholder="Ex: Rua das Flores, 123"
                  className={errors.endereco ? "border-destructive" : ""}
                />
                {errors.endereco && (
                  <p className="text-sm text-destructive">{errors.endereco}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">
                  Bairro <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange("bairro", e.target.value)}
                  placeholder="Ex: Centro"
                  className={errors.bairro ? "border-destructive" : ""}
                />
                {errors.bairro && (
                  <p className="text-sm text-destructive">{errors.bairro}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">
                  Cidade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange("cidade", e.target.value)}
                  placeholder="Ex: São Paulo"
                  className={errors.cidade ? "border-destructive" : ""}
                />
                {errors.cidade && (
                  <p className="text-sm text-destructive">{errors.cidade}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">
                  Estado <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange("estado", e.target.value)}
                  placeholder="Ex: SP"
                  maxLength={2}
                  className={errors.estado ? "border-destructive" : ""}
                />
                {errors.estado && (
                  <p className="text-sm text-destructive">{errors.estado}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">
                  CEP <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  placeholder="Ex: 01234-567"
                  className={errors.cep ? "border-destructive" : ""}
                />
                {errors.cep && (
                  <p className="text-sm text-destructive">{errors.cep}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pontoReferencia">Ponto de Referência</Label>
              <Input
                id="pontoReferencia"
                value={formData.pontoReferencia}
                onChange={(e) =>
                  handleInputChange("pontoReferencia", e.target.value)
                }
                placeholder="Ex: Próximo ao mercado municipal, ao lado da praça..."
              />
            </div>

            <div className="space-y-2">
              <Label>
                Situação <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ativo" id="ativo" />
                  <Label htmlFor="ativo" className="cursor-pointer">
                    Ativo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inativo" id="inativo" />
                  <Label htmlFor="inativo" className="cursor-pointer">
                    Inativo
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o ponto de entrega "
                  {formData.nome}"? Esta ação não pode ser desfeita.
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

          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
              disabled={
                !formData.nome?.trim() ||
                !formData.endereco?.trim() ||
                !formData.bairro?.trim() ||
                !formData.cidade?.trim() ||
                !formData.estado?.trim() ||
                !formData.cep?.trim() ||
                isUpdating
              }
            >
              {isUpdating ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminMercadoPontoEntregaEditar;
