export interface PrecoMercado {
  id: string;
  produtoId: number;
  produto?: {
    id: string;
    nome: string;
    medida: string;
  };
  mercadoId: number;
  mercado?: {
    id: string;
    nome: string;
    tipo: string;
  };
  preco: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrecoMercadoInput {
  produtoId: number;
  mercadoId: number;
  preco: number;
  status?: string;
}

export function preparePrecoMercadoForBackend(data: PrecoMercadoInput) {
  return {
    produtoId: data.produtoId,
    mercadoId: data.mercadoId,
    preco: data.preco,
    status: data.status || "ativo",
  };
}

export function filterPrecosByStatus(
  precos: PrecoMercado[],
  status: string[]
): PrecoMercado[] {
  if (status.length === 0) return precos;
  return precos.filter((p) => status.includes(p.status));
}

export function filterPrecosBySearch(
  precos: PrecoMercado[],
  searchTerm: string
): PrecoMercado[] {
  if (!searchTerm) return precos;
  const lower = searchTerm.toLowerCase();
  return precos.filter(
    (p) =>
      p.produto?.nome.toLowerCase().includes(lower) ||
      p.mercado?.nome.toLowerCase().includes(lower)
  );
}

export function sortPrecosByProdutoNome(precos: PrecoMercado[]): PrecoMercado[] {
  return [...precos].sort((a, b) => {
    const nomeA = a.produto?.nome || "";
    const nomeB = b.produto?.nome || "";
    return nomeA.localeCompare(nomeB);
  });
}

export function sortPrecosByPreco(
  precos: PrecoMercado[],
  ascending = true
): PrecoMercado[] {
  return [...precos].sort((a, b) => {
    return ascending ? a.preco - b.preco : b.preco - a.preco;
  });
}

export function calculatePriceDifference(
  precoMercado: number,
  precoReferencia: number
): {
  difference: number;
  percentage: number;
  isHigher: boolean;
} {
  const difference = precoMercado - precoReferencia;
  const percentage =
    precoReferencia !== 0 ? (difference / precoReferencia) * 100 : 0;
  return {
    difference,
    percentage,
    isHigher: difference > 0,
  };
}

export function getPrecosPorMercado(
  precos: PrecoMercado[]
): Map<number, PrecoMercado[]> {
  const precosPorMercado = new Map<number, PrecoMercado[]>();
  precos.forEach((preco) => {
    const mercadoPrecos = precosPorMercado.get(preco.mercadoId) || [];
    mercadoPrecos.push(preco);
    precosPorMercado.set(preco.mercadoId, mercadoPrecos);
  });
  return precosPorMercado;
}

export function getPrecosPorProduto(
  precos: PrecoMercado[]
): Map<number, PrecoMercado[]> {
  const precosPorProduto = new Map<number, PrecoMercado[]>();
  precos.forEach((preco) => {
    const produtoPrecos = precosPorProduto.get(preco.produtoId) || [];
    produtoPrecos.push(preco);
    precosPorProduto.set(preco.produtoId, produtoPrecos);
  });
  return precosPorProduto;
}

export function validatePreco(preco: number): boolean {
  return preco > 0 && !isNaN(preco) && isFinite(preco);
}

export function isPrecoChanged(
  original: PrecoMercado,
  updated: Partial<PrecoMercado>
): boolean {
  return (
    (updated.preco !== undefined && updated.preco !== original.preco) ||
    (updated.status !== undefined && updated.status !== original.status)
  );
}
