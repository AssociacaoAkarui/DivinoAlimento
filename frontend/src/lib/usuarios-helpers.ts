export interface Usuario {
  id: string;
  nome: string;
  email: string;
  status: string;
  perfis: string[];
}

export function filterUsuariosBySearch(
  usuarios: Usuario[],
  searchTerm: string
): Usuario[] {
  if (!searchTerm.trim()) return usuarios;

  const lowerSearch = searchTerm.toLowerCase().trim();
  return usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(lowerSearch) ||
      usuario.email.toLowerCase().includes(lowerSearch)
  );
}

export function sortUsuariosByName(usuarios: Usuario[]): Usuario[] {
  return [...usuarios].sort((a, b) => a.nome.localeCompare(b.nome));
}

export function getActiveUsersCount(usuarios: Usuario[]): number {
  return usuarios.filter((u) => u.status === "ativo").length;
}

export function getInactiveUsersCount(usuarios: Usuario[]): number {
  return usuarios.filter((u) => u.status === "inativo").length;
}

export function getUsersByStatus(
  usuarios: Usuario[],
  status: string
): Usuario[] {
  return usuarios.filter((u) => u.status === status);
}

export function getUsersByPerfil(
  usuarios: Usuario[],
  perfil: string
): Usuario[] {
  return usuarios.filter((u) => u.perfis.includes(perfil));
}

export function hasSearchResults(
  usuarios: Usuario[],
  searchTerm: string
): boolean {
  return filterUsuariosBySearch(usuarios, searchTerm).length > 0;
}
