export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
    pendente: "Pendente",
  };
  return map[status.toLowerCase()] || status;
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

export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    ativo: "bg-green-100 text-green-800",
    inativo: "bg-red-100 text-red-800",
    pendente: "bg-yellow-100 text-yellow-800",
  };
  return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
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

export function formatListError(error: Error): string {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("unauthorized") || errorMessage.includes("não autorizado")) {
    return "Você não tem permissão para visualizar a lista de usuários.";
  }

  if (errorMessage.includes("admin required")) {
    return "Apenas administradores podem visualizar a lista de usuários.";
  }

  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }

  return "Erro ao carregar lista de usuários. Por favor, tente novamente.";
}

export function getEmptyListMessage(searchTerm: string): string {
  if (searchTerm.trim()) {
    return `Nenhum usuário encontrado para "${searchTerm}"`;
  }
  return "Nenhum usuário cadastrado";
}

export function getLoadingMessage(): string {
  return "Carregando usuários...";
}

export function getUsersCountMessage(count: number): string {
  if (count === 0) return "Nenhum usuário";
  if (count === 1) return "1 usuário";
  return `${count} usuários`;
}
