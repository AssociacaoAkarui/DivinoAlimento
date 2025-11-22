import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCriarPontoEntrega } from "@/hooks/graphql";

const AdminMercadoPontoEntregaNovo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    status: "ativo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: criarPontoEntrega, isPending } = useCriarPontoEntrega();

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      criarPontoEntrega(
        {
          input: {
            nome: formData.nome,
            endereco: formData.endereco || undefined,
            bairro: formData.bairro || undefined,
            cidade: formData.cidade || undefined,
            estado: formData.estado || undefined,
            cep: formData.cep || undefined,
            status: formData.status,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Sucesso",
              description: "Ponto de entrega criado com sucesso",
            });
            navigate("/adminmercado/pontos-entrega");
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
    } else {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/adminmercado/pontos-entrega");
  };

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
            page="Novo Ponto de Entrega"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Cadastre um novo ponto de entrega para distribuição
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
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) =>
                    handleInputChange("endereco", e.target.value)
                  }
                  placeholder="Ex: Rua das Flores, 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange("bairro", e.target.value)}
                  placeholder="Ex: Centro"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange("cidade", e.target.value)}
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange("estado", e.target.value)}
                  placeholder="Ex: SP"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  placeholder="Ex: 01234-567"
                />
              </div>
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

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={!formData.nome.trim() || isPending}
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminMercadoPontoEntregaNovo;
