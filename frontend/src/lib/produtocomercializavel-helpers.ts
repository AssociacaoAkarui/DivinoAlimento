// ProdutoComercializavel helper functions

export interface ProdutoComercializavel {
  id: string;
  produtoId: number;
  produto?: {
    id: string;
    nome: string;
  };
  medida: string;
  pesoKg: number;
  precoBase: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Status helpers
export const isStatusAtivo = (status: string): boolean => status === "ativo";
export const isStatusInativo = (status: string): boolean =>
  status === "inativo";

export const formatStatusDisplay = (status: string): string =>
  status === "ativo" ? "Ativo" : "Inativo";

export const parseStatusFromDisplay = (displayStatus: string): string =>
  displayStatus === "Ativo" ? "ativo" : "inativo";

// Filtering
export const filterByStatus = (
  produtos: ProdutoComercializavel[],
  status: string,
): ProdutoComercializavel[] =>
  produtos.filter((prod) => prod.status === status);

export const filterAtivos = (
  produtos: ProdutoComercializavel[],
): ProdutoComercializavel[] => filterByStatus(produtos, "ativo");

export const filterInativos = (
  produtos: ProdutoComercializavel[],
): ProdutoComercializavel[] => filterByStatus(produtos, "inativo");

export const filterByProdutoId = (
  produtos: ProdutoComercializavel[],
  produtoId: number,
): ProdutoComercializavel[] =>
  produtos.filter((prod) => prod.produtoId === produtoId);

export const filterByMedida = (
  produtos: ProdutoComercializavel[],
  medida: string,
): ProdutoComercializavel[] =>
  produtos.filter((prod) => prod.medida.toLowerCase() === medida.toLowerCase());

// Search
export const searchByProdutoNome = (
  produtos: ProdutoComercializavel[],
  searchTerm: string,
): ProdutoComercializavel[] => {
  if (!searchTerm.trim()) return produtos;
  const term = searchTerm.toLowerCase();
  return produtos.filter((prod) =>
    prod.produto?.nome.toLowerCase().includes(term),
  );
};

export const searchByMedida = (
  produtos: ProdutoComercializavel[],
  searchTerm: string,
): ProdutoComercializavel[] => {
  if (!searchTerm.trim()) return produtos;
  const term = searchTerm.toLowerCase();
  return produtos.filter((prod) => prod.medida.toLowerCase().includes(term));
};

// Sorting
export const sortByProdutoNome = (
  produtos: ProdutoComercializavel[],
): ProdutoComercializavel[] =>
  [...produtos].sort((a, b) =>
    (a.produto?.nome || "").localeCompare(b.produto?.nome || ""),
  );

export const sortByMedida = (
  produtos: ProdutoComercializavel[],
): ProdutoComercializavel[] =>
  [...produtos].sort((a, b) => a.medida.localeCompare(b.medida));

export const sortByPrecoBase = (
  produtos: ProdutoComercializavel[],
  ascending: boolean = true,
): ProdutoComercializavel[] =>
  [...produtos].sort((a, b) =>
    ascending ? a.precoBase - b.precoBase : b.precoBase - a.precoBase,
  );

export const sortByPesoKg = (
  produtos: ProdutoComercializavel[],
  ascending: boolean = true,
): ProdutoComercializavel[] =>
  [...produtos].sort((a, b) =>
    ascending ? a.pesoKg - b.pesoKg : b.pesoKg - a.pesoKg,
  );

// Formatting
export const formatPrecoBase = (preco: number): string => {
  return `R$ ${preco.toFixed(2).replace(".", ",")}`;
};

export const formatPesoKg = (peso: number): string => {
  if (peso < 1) {
    return `${(peso * 1000).toFixed(0)}g`;
  }
  return `${peso.toFixed(2).replace(".", ",")} kg`;
};

export const formatMedida = (medida: string): string => {
  const medidas: Record<string, string> = {
    unidade: "Unidade",
    duzia: "Dúzia",
    dúzia: "Dúzia",
    kg: "Kg",
    litro: "Litro",
    caixa: "Caixa",
  };
  return medidas[medida.toLowerCase()] || medida;
};

// Parsing
export const parseBRLToNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
};

export const formatBRLInput = (value: string): string => {
  const cleaned = value.replace(/[^\d]/g, "");
  if (!cleaned) return "";
  const number = parseInt(cleaned) / 100;
  return number.toFixed(2).replace(".", ",");
};

// Validation
export const validateMedida = (medida: string): boolean => {
  return medida.trim().length > 0;
};

export const validatePesoKg = (peso: number): boolean => {
  return peso > 0;
};

export const validatePrecoBase = (preco: number): boolean => {
  return preco > 0;
};

export const validateProdutoId = (produtoId: number | undefined): boolean => {
  return produtoId !== undefined && produtoId > 0;
};

export const isFormValid = (formData: {
  produtoId?: number;
  medida: string;
  pesoKg: number | string;
  precoBase: number | string;
}): boolean => {
  const pesoKg =
    typeof formData.pesoKg === "string"
      ? parseFloat(formData.pesoKg)
      : formData.pesoKg;
  const precoBase =
    typeof formData.precoBase === "string"
      ? parseBRLToNumber(formData.precoBase)
      : formData.precoBase;

  return (
    validateProdutoId(formData.produtoId) &&
    validateMedida(formData.medida) &&
    validatePesoKg(pesoKg) &&
    validatePrecoBase(precoBase)
  );
};

// Counters
export const countAtivos = (produtos: ProdutoComercializavel[]): number =>
  produtos.filter((prod) => prod.status === "ativo").length;

export const countInativos = (produtos: ProdutoComercializavel[]): number =>
  produtos.filter((prod) => prod.status === "inativo").length;

export const countByProdutoId = (
  produtos: ProdutoComercializavel[],
  produtoId: number,
): number => produtos.filter((prod) => prod.produtoId === produtoId).length;

// Find
export const findById = (
  produtos: ProdutoComercializavel[],
  id: string,
): ProdutoComercializavel | undefined =>
  produtos.find((prod) => prod.id === id);

// Get unique values
export const getUniqueProdutos = (
  produtos: ProdutoComercializavel[],
): { id: number; nome: string }[] => {
  const unique = new Map<number, string>();
  produtos.forEach((prod) => {
    if (prod.produto && !unique.has(prod.produtoId)) {
      unique.set(prod.produtoId, prod.produto.nome);
    }
  });
  return Array.from(unique, ([id, nome]) => ({ id, nome }));
};

export const getUniqueMedidas = (
  produtos: ProdutoComercializavel[],
): string[] => {
  const medidas = produtos.map((prod) => prod.medida);
  return Array.from(new Set(medidas));
};

// Prepare data for backend
export const prepareForBackend = (formData: {
  produtoId: number;
  medida: string;
  pesoKg: string;
  precoBase: string;
  status?: string;
}): {
  produtoId: number;
  medida: string;
  pesoKg: number;
  precoBase: number;
  status?: string;
} => {
  return {
    produtoId: formData.produtoId,
    medida: formData.medida.trim(),
    pesoKg: parseFloat(formData.pesoKg),
    precoBase: parseBRLToNumber(formData.precoBase),
    status: formData.status,
  };
};
