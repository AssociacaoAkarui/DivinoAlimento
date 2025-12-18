export function formatUpdateError(error: Error): string {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("not found") || errorMessage.includes("não encontrado")) {
    return "Usuário não encontrado. Por favor, tente novamente.";
  }

  if (errorMessage.includes("unauthorized") || errorMessage.includes("não autorizado")) {
    return "Você não tem permissão para atualizar estes dados.";
  }

  if (errorMessage.includes("admin required")) {
    return "Apenas administradores podem realizar esta ação.";
  }

  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }

  if (errorMessage.includes("email")) {
    return "Este e-mail já está em uso por outro usuário.";
  }

  if (errorMessage.includes("celular")) {
    return "Celular inválido. Verifique o formato e tente novamente.";
  }

  return "Erro ao atualizar dados. Por favor, tente novamente.";
}

export function getUpdateSuccessMessage(nome: string): string {
  return `Dados de ${nome} atualizados com sucesso!`;
}

export function formatBanco(banco: string): string {
  const bancos: Record<string, string> = {
    itau: "Itaú",
    bradesco: "Bradesco",
    santander: "Santander",
    caixa: "Caixa Econômica Federal",
    "banco do brasil": "Banco do Brasil",
    nubank: "Nubank",
    inter: "Inter",
    sicredi: "Sicredi",
    sicoob: "Sicoob",
  };

  const normalized = banco.toLowerCase().trim();
  return bancos[normalized] || banco;
}

export function formatSituacao(situacao: string): string {
  const map: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
    pendente: "Pendente",
  };
  return map[situacao.toLowerCase()] || situacao;
}

export function formatPerfil(perfil: string): string {
  const map: Record<string, string> = {
    admin: "Administrador",
    adminmercado: "Administrador de Mercado",
    fornecedor: "Fornecedor",
    consumidor: "Consumidor",
  };
  return map[perfil] || perfil;
}

export function formatPerfis(perfis: string[]): string {
  if (perfis.length === 0) return "Nenhum perfil";
  if (perfis.length === 1) return formatPerfil(perfis[0]);

  const formatted = perfis.map(formatPerfil);
  const last = formatted.pop();
  return `${formatted.join(", ")} e ${last}`;
}

export function getPerfilBadgeColor(perfil: string): string {
  const colors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    adminmercado: "bg-orange-100 text-orange-800",
    fornecedor: "bg-green-100 text-green-800",
    consumidor: "bg-blue-100 text-blue-800",
  };
  return colors[perfil] || "bg-gray-100 text-gray-800";
}

export function formatCelular(celular: string): string {
  const cleaned = celular.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return celular;
}

export function formatChavePix(chavePix: string): string {
  const cleaned = chavePix.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }

  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }

  return chavePix;
}

export function formatConta(conta: string): string {
  const cleaned = conta.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    const numero = cleaned.slice(0, -1);
    const digito = cleaned.slice(-1);
    return `${numero}-${digito}`;
  }
  return conta;
}

export function getValidationErrorMessage(field: string): string {
  const messages: Record<string, string> = {
    nomeCompleto: "Nome completo é obrigatório",
    celular: "Celular inválido. Use o formato (11) 95555-9999",
    banco: "Banco é obrigatório",
    agencia: "Agência deve ter 4 ou 5 dígitos",
    conta: "Conta deve estar no formato 123456-7",
    chavePix: "Chave PIX inválida",
    aceitePolitica: "É obrigatório aceitar a Política de Privacidade",
  };
  return messages[field] || "Campo inválido";
}

export function formatValidationErrors(errors: Record<string, string>): string {
  const errorMessages = Object.values(errors);
  if (errorMessages.length === 0) return "";
  if (errorMessages.length === 1) return errorMessages[0];
  return `${errorMessages.length} erros encontrados. Por favor, corrija-os.`;
}

export function getSaveButtonText(isLoading: boolean): string {
  return isLoading ? "Salvando..." : "Salvar";
}

export function getCancelButtonText(): string {
  return "Cancelar";
}
