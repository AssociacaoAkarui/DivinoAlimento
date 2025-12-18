import { Produto } from "../types/graphql";

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

export const filterProdutosByStatus = (
  produtos: Produto[],
  status: string,
): Produto[] => {
  return produtos.filter((prod) => prod.status === status);
};

export const filterProdutosAtivos = (produtos: Produto[]): Produto[] => {
  return filterProdutosByStatus(produtos, "ativo");
};

export const filterProdutosInativos = (produtos: Produto[]): Produto[] => {
  return filterProdutosByStatus(produtos, "inativo");
};

export const filterProdutosByCategoria = (
  produtos: Produto[],
  categoriaId: string,
): Produto[] => {
  return produtos.filter((prod) => prod.categoriaId === categoriaId);
};

export const searchProdutosByNome = (
  produtos: Produto[],
  searchTerm: string,
): Produto[] => {
  if (!searchTerm.trim()) return produtos;
  const term = searchTerm.toLowerCase();
  return produtos.filter((prod) => prod.nome.toLowerCase().includes(term));
};

export const sortProdutosByNome = (produtos: Produto[]): Produto[] => {
  return [...produtos].sort((a, b) => a.nome.localeCompare(b.nome));
};

export const sortProdutosByValorReferencia = (
  produtos: Produto[],
): Produto[] => {
  return [...produtos].sort((a, b) => {
    const valorA = a.valorReferencia || 0;
    const valorB = b.valorReferencia || 0;
    return valorA - valorB;
  });
};

export const countProdutosAtivos = (produtos: Produto[]): number => {
  return filterProdutosAtivos(produtos).length;
};

export const countProdutosInativos = (produtos: Produto[]): number => {
  return filterProdutosInativos(produtos).length;
};

export const isProdutoNomeValid = (nome: string): boolean => {
  return nome.trim().length > 0;
};

export const formatProdutoNome = (nome: string): string => {
  return nome.trim();
};

export const hasDescritivo = (produto: Produto): boolean => {
  return !!produto.descritivo && produto.descritivo.trim().length > 0;
};

export const formatValorReferencia = (valor: number | null): string => {
  if (valor === null || valor === undefined) return "R$ 0,00";
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
};

export const parseValorReferencia = (valorString: string): number => {
  const cleanValue = valorString.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleanValue) || 0;
};

export const formatMedida = (medida: string | null): string => {
  if (!medida) return "-";
  return medida.toUpperCase();
};

export const formatPesoGrama = (peso: number | null): string => {
  if (peso === null || peso === undefined) return "0g";
  return `${peso}g`;
};
