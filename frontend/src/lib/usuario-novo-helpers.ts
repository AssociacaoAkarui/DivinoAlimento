import type { UserRole } from "@/contexts/AuthContext";

export interface UsuarioNovoFormData {
  nomeCompleto: string;
  nomeFantasia: string;
  celular: string;
  banco: string;
  agencia: string;
  conta: string;
  chavePix: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  aceitePolitica: boolean;
  perfilFornecedor: boolean;
  perfilConsumidor: boolean;
  perfilAdministradorMercado: boolean;
}

export function mapRoleToPerfil(role: UserRole): string {
  switch (role) {
    case "admin":
      return "admin";
    case "adminmercado":
      return "adminmercado";
    case "fornecedor":
      return "fornecedor";
    case "consumidor":
      return "consumidor";
  }
}

export function getSelectedPerfis(formData: UsuarioNovoFormData): string[] {
  const perfis: string[] = [];
  if (formData.perfilFornecedor) perfis.push("fornecedor");
  if (formData.perfilConsumidor) perfis.push("consumidor");
  if (formData.perfilAdministradorMercado) perfis.push("adminmercado");
  return perfis;
}

export function hasAnyProfile(formData: UsuarioNovoFormData): boolean {
  return (
    formData.perfilFornecedor ||
    formData.perfilConsumidor ||
    formData.perfilAdministradorMercado
  );
}

export function createDescritivo(formData: UsuarioNovoFormData): string {
  return `banco: ${formData.banco}, agencia: ${formData.agencia}, conta: ${formData.conta}, pix: ${formData.chavePix}`;
}

export function formatPhoneForBackend(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidCelular(celular: string): boolean {
  const cleaned = celular.replace(/\D/g, "");
  return cleaned.length === 11 || cleaned.length === 10;
}

export function isValidAgencia(agencia: string): boolean {
  return /^\d{4,5}$/.test(agencia);
}

export function isValidConta(conta: string): boolean {
  return /^\d{1,12}-\d{1}$/.test(conta);
}

export function isValidChavePix(chavePix: string): {
  valido: boolean;
  mensagem?: string;
} {
  if (!chavePix || chavePix.trim() === "") {
    return { valido: false, mensagem: "Chave PIX é obrigatória" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(chavePix)) {
    return { valido: true };
  }

  const phoneRegex = /^\d{10,11}$/;
  const cleanedPhone = chavePix.replace(/\D/g, "");
  if (phoneRegex.test(cleanedPhone)) {
    return { valido: true };
  }

  const cpfRegex = /^\d{11}$/;
  if (cpfRegex.test(cleanedPhone)) {
    return { valido: true };
  }

  const cnpjRegex = /^\d{14}$/;
  if (cnpjRegex.test(cleanedPhone)) {
    return { valido: true };
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(chavePix)) {
    return { valido: true };
  }

  return {
    valido: false,
    mensagem:
      "Chave PIX deve ser um e-mail, telefone, CPF, CNPJ ou chave aleatória válida",
  };
}

export function validateUsuarioNovoForm(
  formData: UsuarioNovoFormData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.nomeCompleto.trim()) {
    errors.nomeCompleto = "Nome completo é obrigatório";
  }

  if (!formData.celular.trim()) {
    errors.celular = "Celular é obrigatório";
  } else if (!isValidCelular(formData.celular)) {
    errors.celular = "Informe um celular válido no formato (11) 95555-9999.";
  }

  if (!formData.email.trim()) {
    errors.email = "E-mail é obrigatório";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "E-mail inválido";
  }

  if (!formData.senha) {
    errors.senha = "Senha é obrigatória";
  } else if (formData.senha.length < 6) {
    errors.senha = "Senha deve ter no mínimo 6 caracteres";
  }

  if (!formData.confirmarSenha) {
    errors.confirmarSenha = "Confirme a senha";
  } else if (formData.senha !== formData.confirmarSenha) {
    errors.confirmarSenha = "As senhas não coincidem";
  }

  if (!formData.banco) {
    errors.banco = "Banco é obrigatório";
  }

  if (!formData.agencia.trim()) {
    errors.agencia = "Agência é obrigatória";
  } else if (!isValidAgencia(formData.agencia)) {
    errors.agencia = "Agência deve ter 4 ou 5 dígitos.";
  }

  if (!formData.conta.trim()) {
    errors.conta = "Conta é obrigatória";
  } else if (!isValidConta(formData.conta)) {
    errors.conta = "Conta deve estar no formato 123456-7.";
  }

  if (!formData.chavePix.trim()) {
    errors.chavePix = "Chave PIX é obrigatória";
  } else {
    const validacao = isValidChavePix(formData.chavePix);
    if (!validacao.valido) {
      errors.chavePix = validacao.mensagem || "Chave PIX inválida";
    }
  }

  if (!formData.aceitePolitica) {
    errors.aceitePolitica =
      "É obrigatório aceitar a Política de Privacidade e Termos de Uso";
  }

  if (!hasAnyProfile(formData)) {
    errors.perfil = "Selecione pelo menos um perfil de acesso";
  }

  return errors;
}
