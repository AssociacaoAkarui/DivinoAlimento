import { CategoriaProdutos } from "@/types/graphql";

export const isStatusAtivo = (status: string): boolean => {
  return status === "ativo";
};

export const isStatusInativo = (status: string): boolean => {
  return status === "inativo";
};

export const formatStatusDisplay = (status: string): string => {
  return status === "ativo" ? "Ativo" : "Inativo";
};

export const parseStatusFromDisplay = (displayStatus: string): string => {
  return displayStatus === "Ativo" ? "ativo" : "inativo";
};

export const filterCategoriasByStatus = (
  categorias: CategoriaProdutos[],
  status: string,
): CategoriaProdutos[] => {
  return categorias.filter((cat) => cat.status === status);
};

export const filterCategoriasAtivas = (
  categorias: CategoriaProdutos[],
): CategoriaProdutos[] => {
  return filterCategoriasByStatus(categorias, "ativo");
};

export const filterCategoriasInativas = (
  categorias: CategoriaProdutos[],
): CategoriaProdutos[] => {
  return filterCategoriasByStatus(categorias, "inativo");
};

export const searchCategoriasByNome = (
  categorias: CategoriaProdutos[],
  searchTerm: string,
): CategoriaProdutos[] => {
  if (!searchTerm.trim()) return categorias;
  const term = searchTerm.toLowerCase();
  return categorias.filter((cat) => cat.nome.toLowerCase().includes(term));
};

export const sortCategoriasByNome = (
  categorias: CategoriaProdutos[],
): CategoriaProdutos[] => {
  return [...categorias].sort((a, b) => a.nome.localeCompare(b.nome));
};

export const countCategoriasAtivas = (
  categorias: CategoriaProdutos[],
): number => {
  return filterCategoriasAtivas(categorias).length;
};

export const countCategoriasInativas = (
  categorias: CategoriaProdutos[],
): number => {
  return filterCategoriasInativas(categorias).length;
};

export const isCategoriaNomeValid = (nome: string): boolean => {
  return nome.trim().length > 0;
};

export const formatCategoriaNome = (nome: string): string => {
  return nome.trim();
};

export const hasObservacao = (categoria: CategoriaProdutos): boolean => {
  return !!categoria.observacao && categoria.observacao.trim().length > 0;
};
