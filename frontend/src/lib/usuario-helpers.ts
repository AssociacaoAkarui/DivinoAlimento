interface Usuario {
  id: string;
  nome: string;
  email: string;
  status: "ativo" | "inativo";
  perfis: string[];
}

export const filterUsuarios = (
  usuarios: Usuario[],
  searchTerm: string,
): Usuario[] => {
  if (!searchTerm) return usuarios;

  const lowerSearch = searchTerm.toLowerCase();

  return usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(lowerSearch) ||
      usuario.email.toLowerCase().includes(lowerSearch),
  );
};

export const countActiveUsers = (usuarios: Usuario[]): number => {
  return usuarios.filter((u) => u.status === "ativo").length;
};

export const getUsersByPerfil = (
  usuarios: Usuario[],
  perfil: string,
): Usuario[] => {
  return usuarios.filter((u) => u.perfis.includes(perfil));
};
