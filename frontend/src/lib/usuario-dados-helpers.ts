import {
  validarCelular,
  validarChavePix,
  validarAgencia,
  validarConta,
} from "@/utils/validation";

export interface UsuarioDadosFormData {
  nomeCompleto: string;
  nomeFantasia: string;
  celular: string;
  banco: string;
  agencia: string;
  conta: string;
  chavePix: string;
  email: string;
  aceitePolitica: boolean;
  perfilFornecedor: boolean;
  perfilConsumidor: boolean;
  perfilAdministrador: boolean;
  perfilAdministradorMercado: boolean;
  situacao: string;
}

export interface UsuarioDadosErrors {
  [key: string]: string;
}

export function mapPerfisToBackend(formData: UsuarioDadosFormData): string[] {
  const perfis: string[] = [];

  if (formData.perfilAdministrador) perfis.push("admin");
  if (formData.perfilAdministradorMercado) perfis.push("adminmercado");
  if (formData.perfilFornecedor) perfis.push("fornecedor");
  if (formData.perfilConsumidor) perfis.push("consumidor");

  return perfis;
}

export function mapPerfisToFrontend(perfis: string[]): {
  perfilAdministrador: boolean;
  perfilAdministradorMercado: boolean;
  perfilFornecedor: boolean;
  perfilConsumidor: boolean;
} {
  return {
    perfilAdministrador: perfis.includes("admin"),
    perfilAdministradorMercado: perfis.includes("adminmercado"),
    perfilFornecedor: perfis.includes("fornecedor"),
    perfilConsumidor: perfis.includes("consumidor"),
  };
}

export function mapSituacaoToStatus(situacao: string): string {
  const map: Record<string, string> = {
    Ativo: "ativo",
    Inativo: "inativo",
    Pendente: "pendente",
  };
  return map[situacao] || "ativo";
}

export function mapStatusToSituacao(status: string): string {
  const map: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
    pendente: "Pendente",
  };
  return map[status] || "Ativo";
}

export function validateUsuarioDadosForm(
  formData: UsuarioDadosFormData,
): UsuarioDadosErrors {
  const errors: UsuarioDadosErrors = {};

  if (!formData.nomeCompleto.trim()) {
    errors.nomeCompleto = "Nome completo é obrigatório";
  }

  if (!formData.celular.trim()) {
    errors.celular = "Celular é obrigatório";
  } else if (!validarCelular(formData.celular)) {
    errors.celular = "Informe um celular válido no formato (11) 95555-9999.";
  }

  if (!formData.banco) {
    errors.banco = "Banco é obrigatório";
  }

  if (!formData.agencia.trim()) {
    errors.agencia = "Agência é obrigatória";
  } else if (!validarAgencia(formData.agencia)) {
    errors.agencia = "Agência deve ter 4 ou 5 dígitos.";
  }

  if (!formData.conta.trim()) {
    errors.conta = "Conta é obrigatória";
  } else if (!validarConta(formData.conta)) {
    errors.conta = "Conta deve estar no formato 123456-7.";
  }

  if (!formData.chavePix.trim()) {
    errors.chavePix = "Chave PIX é obrigatória";
  } else {
    const validacao = validarChavePix(formData.chavePix);
    if (!validacao.valido) {
      errors.chavePix = validacao.mensagem || "Chave PIX inválida";
    }
  }

  if (!formData.aceitePolitica) {
    errors.aceitePolitica =
      "É obrigatório aceitar a Política de Privacidade e Termos de Uso";
  }

  return errors;
}

export function hasErrors(errors: UsuarioDadosErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function isFormValid(formData: UsuarioDadosFormData): boolean {
  const hasAtLeastOnePerfil =
    formData.perfilFornecedor ||
    formData.perfilConsumidor ||
    formData.perfilAdministrador ||
    formData.perfilAdministradorMercado;

  return (
    formData.nomeCompleto?.trim() !== "" &&
    validarCelular(formData.celular || "") &&
    formData.banco !== "" &&
    validarAgencia(formData.agencia || "") &&
    validarConta(formData.conta || "") &&
    validarChavePix(formData.chavePix || "").valido &&
    formData.aceitePolitica &&
    hasAtLeastOnePerfil
  );
}

export function prepareUsuarioDadosForBackend(
  usuarioId: string,
  formData: UsuarioDadosFormData,
): {
  id: string;
  input: {
    nome: string;
    nomeoficial: string;
    celular: string;
    banco: string;
    agencia: string;
    conta: string;
    chavePix: string;
    cientepolitica: string;
    perfis: string[];
    status: string;
  };
} {
  return {
    id: usuarioId,
    input: {
      nome: formData.nomeCompleto.trim(),
      nomeoficial: formData.nomeFantasia.trim(),
      celular: formData.celular.replace(/\D/g, ""),
      banco: formData.banco,
      agencia: formData.agencia,
      conta: formData.conta,
      chavePix: formData.chavePix,
      cientepolitica: formData.aceitePolitica ? "sim" : "nao",
      perfis: mapPerfisToBackend(formData),
      status: mapSituacaoToStatus(formData.situacao),
    },
  };
}

export function formatPhoneForBackend(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function canEditPerfis(activeRole: string): boolean {
  return activeRole === "admin";
}

export function getRedirectRoute(activeRole: string): string {
  const routes: Record<string, string> = {
    consumidor: "/dashboard",
    fornecedor: "/fornecedor/loja",
    admin_mercado: "/adminmercado/dashboard",
    adminmercado: "/adminmercado/dashboard",
    admin: "/admin/dashboard",
  };
  return routes[activeRole] || "/dashboard";
}
