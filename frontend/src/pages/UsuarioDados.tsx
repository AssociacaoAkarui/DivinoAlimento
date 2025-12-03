import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAtualizarUsuario, useBuscarUsuario } from "@/hooks/graphql";
import InputMask from "react-input-mask";
import {
  validarCelular,
  validarChavePix,
  validarAgencia,
  validarConta,
} from "@/utils/validation";
import {
  validateUsuarioDadosForm,
  prepareUsuarioDadosForBackend,
  getRedirectRoute,
  isFormValid,
  type UsuarioDadosFormData,
} from "@/lib/usuario-dados-helpers";
import {
  formatUpdateError,
  getUpdateSuccessMessage,
} from "@/lib/usuario-dados-formatters";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { RoleTitle } from "@/components/layout/RoleTitle";

const UsuarioDados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeRole, user } = useAuth();
  const { mutate: atualizarUsuario, isPending } = useAtualizarUsuario();

  const usuarioId = id || user?.id || "";
  const { data: usuario, isLoading, error } = useBuscarUsuario(usuarioId);

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nomeFantasia: "",
    celular: "",
    banco: "",
    agencia: "",
    conta: "",
    chavePix: "",
    email: "",
    aceitePolitica: false,
    perfilFornecedor: false,
    perfilConsumidor: false,
    perfilAdministrador: false,
    perfilAdministradorMercado: false,
    situacao: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (usuario) {
      const perfis = usuario.perfis || [];

      setFormData({
        nomeCompleto: usuario.nome || "",
        nomeFantasia: usuario.nomeoficial || "",
        celular: usuario.celular || "",
        banco: usuario.banco || "",
        agencia: usuario.agencia || "",
        conta: usuario.conta || "",
        chavePix: usuario.chavePix || "",
        email: usuario.email || "",
        aceitePolitica:
          usuario.cientepolitica === "sim" || usuario.cientepolitica === "true",
        perfilFornecedor: perfis.includes("fornecedor"),
        perfilConsumidor: perfis.includes("consumidor"),
        perfilAdministrador: perfis.includes("admin"),
        perfilAdministradorMercado: perfis.includes("adminmercado"),
        situacao: usuario.status || "Ativo",
      });
    }
  }, [usuario]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = validateUsuarioDadosForm(
      formData as UsuarioDadosFormData,
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Erro",
        description: "Corrija os dados antes de prosseguir",
        variant: "destructive",
      });
      return;
    }

    if (!usuarioId) {
      toast({
        title: "Erro",
        description: "ID do usuário não encontrado",
        variant: "destructive",
      });
      return;
    }

    const preparedData = prepareUsuarioDadosForBackend(
      usuarioId,
      formData as UsuarioDadosFormData,
    );

    atualizarUsuario(preparedData, {
      onSuccess: (data) => {
        toast({
          title: "Sucesso",
          description: getUpdateSuccessMessage(data.atualizarUsuario.nome),
        });
        // Admin editando outro usuário → volta para lista de usuários
        // Qualquer usuário editando seus próprios dados → volta para dashboard do perfil
        if (id && id !== user?.id && activeRole === "admin") {
          navigate("/usuario-index");
        } else {
          navigate(getRedirectRoute(activeRole));
        }
      },
      onError: (error) => {
        toast({
          title: "Erro ao atualizar",
          description: formatUpdateError(error),
          variant: "destructive",
        });
      },
    });
  };

  const handleCancel = () => {
    // Admin editando outro usuário → volta para lista de usuários
    // Qualquer usuário editando seus próprios dados → volta para dashboard do perfil
    if (id && id !== user?.id && activeRole === "admin") {
      navigate("/usuario-index");
    } else {
      navigate(getRedirectRoute(activeRole));
    }
  };

  if (isLoading) {
    return (
      <ResponsiveLayout
        headerContent={<UserMenuLarge />}
        leftHeaderContent={
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Carregando dados do usuário...
          </p>
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout
        headerContent={<UserMenuLarge />}
        leftHeaderContent={
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">
            Erro ao carregar usuário: {error.message}
          </p>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout
      headerContent={<UserMenuLarge />}
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
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        <div>
          <RoleTitle page="Dados Pessoais" />
          <p className="text-sm md:text-base text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) =>
                  handleInputChange("nomeCompleto", e.target.value)
                }
                className={errors.nomeCompleto ? "border-destructive" : ""}
              />
              {errors.nomeCompleto && (
                <p className="text-sm text-destructive">
                  {errors.nomeCompleto}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input
                id="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={(e) =>
                  handleInputChange("nomeFantasia", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">
                Celular <span className="text-destructive">*</span>
              </Label>
              <InputMask
                mask="(99) 99999-9999"
                value={formData.celular}
                onChange={(e) =>
                  handleInputChange(
                    "celular",
                    e.target.value.replace(/\D/g, ""),
                  )
                }
              >
                {/* @ts-expect-error - InputMask children function type mismatch */}
                {(inputProps: Record<string, unknown>) => (
                  <Input
                    {...inputProps}
                    id="celular"
                    type="tel"
                    placeholder="(11) 95555-9999"
                    className={errors.celular ? "border-destructive" : ""}
                    inputMode="numeric"
                  />
                )}
              </InputMask>
              {errors.celular && (
                <p className="text-sm text-destructive">{errors.celular}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="email">E-mail</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Seu e-mail não pode ser alterado</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações para Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banco">
                  Banco <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.banco}
                  onValueChange={(value) => handleInputChange("banco", value)}
                >
                  <SelectTrigger
                    id="banco"
                    className={errors.banco ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Itaú">Itaú</SelectItem>
                    <SelectItem value="Bradesco">Bradesco</SelectItem>
                    <SelectItem value="Santander">Santander</SelectItem>
                    <SelectItem value="Caixa">
                      Caixa Econômica Federal
                    </SelectItem>
                    <SelectItem value="Banco do Brasil">
                      Banco do Brasil
                    </SelectItem>
                    <SelectItem value="Nubank">Nubank</SelectItem>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Sicredi">Sicredi</SelectItem>
                    <SelectItem value="Sicoob">Sicoob</SelectItem>
                    <SelectItem value="Outras">Outras</SelectItem>
                  </SelectContent>
                </Select>
                {errors.banco && (
                  <p className="text-sm text-destructive">{errors.banco}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="agencia">
                  Agência <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="agencia"
                  type="text"
                  inputMode="numeric"
                  value={formData.agencia}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                    handleInputChange("agencia", value);
                  }}
                  placeholder="1234"
                  className={errors.agencia ? "border-destructive" : ""}
                  maxLength={5}
                />
                {errors.agencia && (
                  <p className="text-sm text-destructive">{errors.agencia}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="conta">
                  Conta <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="conta"
                  type="text"
                  inputMode="numeric"
                  value={formData.conta}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d-]/g, "");
                    // Limitar a 12 dígitos + hífen + 1 dígito
                    const match = value.match(/^(\d{0,12})-?(\d?)$/);
                    if (match) {
                      value = match[1] + (match[2] ? "-" + match[2] : "");
                    }
                    handleInputChange("conta", value);
                  }}
                  placeholder="56789-0"
                  className={errors.conta ? "border-destructive" : ""}
                  maxLength={14}
                />
                {errors.conta && (
                  <p className="text-sm text-destructive">{errors.conta}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="chavePix">
                  Chave PIX <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="chavePix"
                  type="text"
                  value={formData.chavePix}
                  onChange={(e) =>
                    handleInputChange("chavePix", e.target.value)
                  }
                  placeholder="joao@email.com"
                  className={errors.chavePix ? "border-destructive" : ""}
                />
                {errors.chavePix && (
                  <p className="text-sm text-destructive">{errors.chavePix}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status e Termos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Input
                id="situacao"
                value={formData.situacao}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="aceitePolitica"
                checked={formData.aceitePolitica}
                onCheckedChange={(checked) =>
                  handleInputChange("aceitePolitica", checked as boolean)
                }
                className={errors.aceitePolitica ? "border-destructive" : ""}
              />
              <Label
                htmlFor="aceitePolitica"
                className="cursor-pointer text-sm"
              >
                Aceito a Política de Privacidade e os{" "}
                <a
                  href="https://docs.google.com/document/d/1u69VUNkih50pM5IBT0ecp69JLR2SBIEc/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Termos de Uso
                </a>{" "}
                <span className="text-destructive">*</span>
              </Label>
            </div>
            {errors.aceitePolitica && (
              <p className="text-sm text-destructive">
                {errors.aceitePolitica}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil de Acesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilFornecedor"
                checked={formData.perfilFornecedor}
                disabled={activeRole !== "admin"}
                onCheckedChange={(checked) =>
                  handleInputChange("perfilFornecedor", checked as boolean)
                }
              />
              <Label
                htmlFor="perfilFornecedor"
                className={
                  activeRole !== "admin"
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }
              >
                Fornecedor(a){activeRole !== "admin" ? " (não editável)" : ""}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilConsumidor"
                checked={formData.perfilConsumidor}
                disabled={activeRole !== "admin"}
                onCheckedChange={(checked) =>
                  handleInputChange("perfilConsumidor", checked as boolean)
                }
              />
              <Label
                htmlFor="perfilConsumidor"
                className={
                  activeRole !== "admin"
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }
              >
                Consumidor(a){activeRole !== "admin" ? " (não editável)" : ""}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilAdministradorMercado"
                checked={formData.perfilAdministradorMercado || false}
                disabled={activeRole !== "admin"}
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "perfilAdministradorMercado",
                    checked as boolean,
                  )
                }
              />
              <Label
                htmlFor="perfilAdministradorMercado"
                className={
                  activeRole !== "admin"
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }
              >
                Administrador(a) de Mercado
                {activeRole !== "admin" ? " (não editável)" : ""}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilAdministrador"
                checked={formData.perfilAdministrador}
                disabled
                onCheckedChange={(checked) =>
                  handleInputChange("perfilAdministrador", checked as boolean)
                }
              />
              <Label
                htmlFor="perfilAdministrador"
                className="cursor-not-allowed opacity-50"
              >
                Administrador(a) (não editável)
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pb-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading || isPending || !isFormValid(formData)}
          >
            {isLoading ? "Carregando..." : isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default UsuarioDados;
