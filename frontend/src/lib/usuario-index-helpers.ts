interface Usuario {
  id: string;
  nomeCompleto?: string;
  nome: string;
  email: string;
  status: "Ativo" | "Inativo";
  perfis: string[];
}

interface Filters {
  search: string;
  status: string[];
  perfis: string[];
}

export const filterUsuariosBySearch = (usuarios: Usuario[], searchTerm: string): Usuario[] => {
  if (!searchTerm || searchTerm.trim() === "") return usuarios;

  const term = searchTerm.toLowerCase();
  return usuarios.filter(
    (usuario) =>
      (usuario.nomeCompleto || usuario.nome).toLowerCase().includes(term) ||
      usuario.email.toLowerCase().includes(term)
  );
};

export const filterUsuariosByStatus = (usuarios: Usuario[], statusList: string[]): Usuario[] => {
  if (statusList.length === 0) return usuarios;

  return usuarios.filter((usuario) => statusList.includes(usuario.status));
};

export const filterUsuariosByPerfis = (usuarios: Usuario[], perfisList: string[]): Usuario[] => {
  if (perfisList.length === 0) return usuarios;

  return usuarios.filter((usuario) =>
    usuario.perfis.some((perfil) => perfisList.includes(perfil))
  );
};

export const applyAllFilters = (
  usuarios: Usuario[],
  filters: Filters,
  debouncedSearch: string
): Usuario[] => {
  let result = [...usuarios];

  result = filterUsuariosBySearch(result, debouncedSearch);
  result = filterUsuariosByStatus(result, filters.status);
  result = filterUsuariosByPerfis(result, filters.perfis);

  return result;
};

export const normalizeUsuario = (usuario: any): Usuario => {
  return {
    id: usuario.id,
    nome: usuario.nome,
    nomeCompleto: usuario.nome,
    email: usuario.email,
    status: usuario.status === "ativo" ? "Ativo" : "Inativo",
    perfis: usuario.perfis.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)),
  };
};

export const normalizeUsuarios = (usuarios: any[]): Usuario[] => {
  return usuarios.map(normalizeUsuario);
};
