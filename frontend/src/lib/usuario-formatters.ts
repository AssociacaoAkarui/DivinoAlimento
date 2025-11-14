interface Usuario {
  nome: string;
  email: string;
  status: "ativo" | "inativo";
  perfis: string[];
}

export const formatUsuarioStatus = (status: "ativo" | "inativo"): string => {
  return status === "ativo" ? "Ativo" : "Inativo";
};

export const formatPerfil = (perfil: string): string => {
  const map: Record<string, string> = {
    admin: "Administrador",
    adminmercado: "Administrador de Mercado",
    fornecedor: "Fornecedor",
    consumidor: "Consumidor",
  };
  return map[perfil] || perfil;
};

export const formatPerfis = (perfis: string[]): string[] => {
  return perfis.map(formatPerfil);
};

export const getUserInitials = (nome: string): string => {
  if (!nome || nome.trim() === "") return "";

  const parts = nome
    .trim()
    .split(" ")
    .filter((n) => n.length > 0);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatUsuarioDisplay = (usuario: Usuario): string => {
  const status = formatUsuarioStatus(usuario.status);
  const perfis = formatPerfis(usuario.perfis).join(", ");
  return `${usuario.nome} (${status}) - ${perfis}`;
};

export const getPerfilBadgeColor = (perfil: string): string => {
  const colors: Record<string, string> = {
    admin: "red",
    adminmercado: "orange",
    fornecedor: "blue",
    consumidor: "green",
  };
  return colors[perfil] || "gray";
};
