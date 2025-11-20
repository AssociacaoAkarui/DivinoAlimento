// Helper functions for SubmissaoProduto

export interface SubmissaoProduto {
  id: string;
  fornecedorId: number;
  fornecedor?: {
    id: string;
    nome: string;
  };
  nomeProduto: string;
  descricao?: string;
  imagemUrl?: string;
  precoUnidade: number;
  medida: string;
  status: string;
  motivoReprovacao?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Format price to BRL currency
export function formatPreco(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

// Format date to Brazilian format
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

// Format date with time
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("pt-BR");
}

// Get status display text
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pendente: "Pendente",
    aprovado: "Aprovado",
    reprovado: "Reprovado",
  };
  return statusMap[status.toLowerCase()] || status;
}

// Get status badge variant
export function getStatusVariant(
  status: string,
): "warning" | "success" | "destructive" | "secondary" {
  const variantMap: Record<
    string,
    "warning" | "success" | "destructive" | "secondary"
  > = {
    pendente: "warning",
    aprovado: "success",
    reprovado: "destructive",
  };
  return variantMap[status.toLowerCase()] || "secondary";
}

// Filter submissions by status
export function filterByStatus(
  submissoes: SubmissaoProduto[],
  status: string,
): SubmissaoProduto[] {
  if (!status || status === "todos") {
    return submissoes;
  }
  return submissoes.filter(
    (s) => s.status.toLowerCase() === status.toLowerCase(),
  );
}

// Filter submissions by supplier name
export function filterByFornecedor(
  submissoes: SubmissaoProduto[],
  searchTerm: string,
): SubmissaoProduto[] {
  if (!searchTerm) {
    return submissoes;
  }
  const term = searchTerm.toLowerCase();
  return submissoes.filter(
    (s) =>
      s.fornecedor?.nome.toLowerCase().includes(term) ||
      s.nomeProduto.toLowerCase().includes(term),
  );
}

// Filter submissions by product name
export function filterByNomeProduto(
  submissoes: SubmissaoProduto[],
  searchTerm: string,
): SubmissaoProduto[] {
  if (!searchTerm) {
    return submissoes;
  }
  const term = searchTerm.toLowerCase();
  return submissoes.filter((s) => s.nomeProduto.toLowerCase().includes(term));
}

// Sort submissions by date (newest first)
export function sortByDateDesc(
  submissoes: SubmissaoProduto[],
): SubmissaoProduto[] {
  return [...submissoes].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

// Sort submissions by date (oldest first)
export function sortByDateAsc(
  submissoes: SubmissaoProduto[],
): SubmissaoProduto[] {
  return [...submissoes].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateA - dateB;
  });
}

// Sort submissions by product name
export function sortByNomeProduto(
  submissoes: SubmissaoProduto[],
): SubmissaoProduto[] {
  return [...submissoes].sort((a, b) =>
    a.nomeProduto.localeCompare(b.nomeProduto),
  );
}

// Sort submissions by price
export function sortByPreco(
  submissoes: SubmissaoProduto[],
  ascending: boolean = true,
): SubmissaoProduto[] {
  return [...submissoes].sort((a, b) =>
    ascending
      ? a.precoUnidade - b.precoUnidade
      : b.precoUnidade - a.precoUnidade,
  );
}

// Count submissions by status
export function countByStatus(
  submissoes: SubmissaoProduto[],
): Record<string, number> {
  return submissoes.reduce(
    (acc, s) => {
      const status = s.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

// Get pending count
export function getPendingCount(submissoes: SubmissaoProduto[]): number {
  return submissoes.filter((s) => s.status.toLowerCase() === "pendente").length;
}

// Get approved count
export function getApprovedCount(submissoes: SubmissaoProduto[]): number {
  return submissoes.filter((s) => s.status.toLowerCase() === "aprovado").length;
}

// Get rejected count
export function getRejectedCount(submissoes: SubmissaoProduto[]): number {
  return submissoes.filter((s) => s.status.toLowerCase() === "reprovado")
    .length;
}

// Validate submission data
export function validateSubmissao(data: {
  nomeProduto?: string;
  precoUnidade?: number;
  medida?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.nomeProduto || data.nomeProduto.trim() === "") {
    errors.push("Nome do produto é obrigatório");
  }

  if (data.precoUnidade === undefined || data.precoUnidade <= 0) {
    errors.push("Preço por unidade deve ser maior que zero");
  }

  if (!data.medida || data.medida.trim() === "") {
    errors.push("Medida é obrigatória");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Check if submission can be approved/rejected
export function canBeReviewed(submissao: SubmissaoProduto): boolean {
  return submissao.status.toLowerCase() === "pendente";
}

// Parse BRL price input to number
export function parseBRLToNumber(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

// Format input as BRL
export function formatBRLInput(value: string): string {
  const number = parseBRLToNumber(value);
  if (isNaN(number)) return "";
  return number.toFixed(2).replace(".", ",");
}

// Get unique medidas from submissions
export function getUniqueMedidas(submissoes: SubmissaoProduto[]): string[] {
  const medidas = submissoes.map((s) => s.medida);
  return Array.from(new Set(medidas)).sort();
}

// Get unique suppliers from submissions
export function getUniqueFornecedores(
  submissoes: SubmissaoProduto[],
): { id: string; nome: string }[] {
  const fornecedoresMap = new Map<string, { id: string; nome: string }>();

  submissoes.forEach((s) => {
    if (s.fornecedor && !fornecedoresMap.has(s.fornecedor.id)) {
      fornecedoresMap.set(s.fornecedor.id, s.fornecedor);
    }
  });

  return Array.from(fornecedoresMap.values()).sort((a, b) =>
    a.nome.localeCompare(b.nome),
  );
}
