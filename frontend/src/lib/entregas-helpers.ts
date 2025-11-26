import { EntregaFornecedor } from "../hooks/graphql";

// Format functions
export function formatCurrency(valor: number | null | undefined): string {
  if (!valor && valor !== 0) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatQuantidade(
  quantidade: number | null | undefined,
): string {
  if (!quantidade && quantidade !== 0) return "-";
  return quantidade.toFixed(2);
}

export function formatUnidadeMedida(unidade: string): string {
  const unidades: Record<string, string> = {
    kg: "kg",
    un: "unidade",
    cx: "caixa",
    pc: "peça",
    lt: "litro",
  };
  return unidades[unidade] || unidade;
}

// Calculation functions
export function calcularValorTotal(entrega: EntregaFornecedor): number {
  return entrega.quantidadeEntregue * entrega.valorUnitario;
}

export function calcularPercentualEntregue(entrega: EntregaFornecedor): number {
  if (entrega.quantidadeOfertada === 0) return 0;
  return (entrega.quantidadeEntregue / entrega.quantidadeOfertada) * 100;
}

export function calcularTotalEntregasPorFornecedor(
  entregas: EntregaFornecedor[],
  fornecedorId: number,
): number {
  return entregas
    .filter((e) => e.fornecedorId === fornecedorId)
    .reduce((sum, e) => sum + e.valorTotal, 0);
}

export function calcularTotalGeralEntregas(
  entregas: EntregaFornecedor[],
): number {
  return entregas.reduce((sum, e) => sum + e.valorTotal, 0);
}

export function calcularQuantidadeTotalPorProduto(
  entregas: EntregaFornecedor[],
  produtoId: number,
): { ofertada: number; entregue: number } {
  const produtoEntregas = entregas.filter((e) => e.produtoId === produtoId);

  return {
    ofertada: produtoEntregas.reduce(
      (sum, e) => sum + e.quantidadeOfertada,
      0,
    ),
    entregue: produtoEntregas.reduce(
      (sum, e) => sum + e.quantidadeEntregue,
      0,
    ),
  };
}

// Filter functions
export function filterEntregasByFornecedor(
  entregas: EntregaFornecedor[],
  fornecedorId: number,
): EntregaFornecedor[] {
  return entregas.filter((e) => e.fornecedorId === fornecedorId);
}

export function filterEntregasByProduto(
  entregas: EntregaFornecedor[],
  produtoId: number,
): EntregaFornecedor[] {
  return entregas.filter((e) => e.produtoId === produtoId);
}

export function filterEntregasAgriculturaFamiliar(
  entregas: EntregaFornecedor[],
): EntregaFornecedor[] {
  return entregas.filter((e) => e.agriculturaFamiliar);
}

export function filterEntregasComCertificacao(
  entregas: EntregaFornecedor[],
): EntregaFornecedor[] {
  return entregas.filter((e) => e.certificacao !== null);
}

// Grouping functions
export function groupEntregasByFornecedor(
  entregas: EntregaFornecedor[],
): Record<number, EntregaFornecedor[]> {
  return entregas.reduce(
    (acc, entrega) => {
      if (!acc[entrega.fornecedorId]) {
        acc[entrega.fornecedorId] = [];
      }
      acc[entrega.fornecedorId].push(entrega);
      return acc;
    },
    {} as Record<number, EntregaFornecedor[]>,
  );
}

export function groupEntregasByProduto(
  entregas: EntregaFornecedor[],
): Record<number, EntregaFornecedor[]> {
  return entregas.reduce(
    (acc, entrega) => {
      if (!acc[entrega.produtoId]) {
        acc[entrega.produtoId] = [];
      }
      acc[entrega.produtoId].push(entrega);
      return acc;
    },
    {} as Record<number, EntregaFornecedor[]>,
  );
}

// Sorting functions
export function sortEntregasByFornecedor(
  entregas: EntregaFornecedor[],
): EntregaFornecedor[] {
  return [...entregas].sort((a, b) =>
    a.fornecedor.localeCompare(b.fornecedor),
  );
}

export function sortEntregasByProduto(
  entregas: EntregaFornecedor[],
): EntregaFornecedor[] {
  return [...entregas].sort((a, b) => a.produto.localeCompare(b.produto));
}

export function sortEntregasByValorTotal(
  entregas: EntregaFornecedor[],
  order: "asc" | "desc" = "desc",
): EntregaFornecedor[] {
  return [...entregas].sort((a, b) =>
    order === "desc" ? b.valorTotal - a.valorTotal : a.valorTotal - b.valorTotal,
  );
}

// Validation functions
export function isEntregaCompleta(entrega: EntregaFornecedor): boolean {
  return entrega.quantidadeEntregue >= entrega.quantidadeOfertada;
}

export function isEntregaParcial(entrega: EntregaFornecedor): boolean {
  return (
    entrega.quantidadeEntregue > 0 &&
    entrega.quantidadeEntregue < entrega.quantidadeOfertada
  );
}

export function isEntregaPendente(entrega: EntregaFornecedor): boolean {
  return entrega.quantidadeEntregue === 0;
}

// Statistics functions
export function getEntregasStatistics(entregas: EntregaFornecedor[]): {
  total: number;
  completas: number;
  parciais: number;
  pendentes: number;
  valorTotal: number;
  quantidadeFornecedores: number;
  quantidadeProdutos: number;
} {
  const fornecedores = new Set(entregas.map((e) => e.fornecedorId));
  const produtos = new Set(entregas.map((e) => e.produtoId));

  return {
    total: entregas.length,
    completas: entregas.filter(isEntregaCompleta).length,
    parciais: entregas.filter(isEntregaParcial).length,
    pendentes: entregas.filter(isEntregaPendente).length,
    valorTotal: calcularTotalGeralEntregas(entregas),
    quantidadeFornecedores: fornecedores.size,
    quantidadeProdutos: produtos.size,
  };
}

// Export/Report functions
export function formatEntregaForExport(entrega: EntregaFornecedor): {
  fornecedor: string;
  produto: string;
  unidadeMedida: string;
  valorUnitario: string;
  quantidadeOfertada: string;
  quantidadeEntregue: string;
  valorTotal: string;
  agriculturaFamiliar: string;
  certificacao: string;
} {
  return {
    fornecedor: entrega.fornecedor,
    produto: entrega.produto,
    unidadeMedida: entrega.unidadeMedida,
    valorUnitario: formatCurrency(entrega.valorUnitario),
    quantidadeOfertada: formatQuantidade(entrega.quantidadeOfertada),
    quantidadeEntregue: formatQuantidade(entrega.quantidadeEntregue),
    valorTotal: formatCurrency(entrega.valorTotal),
    agriculturaFamiliar: entrega.agriculturaFamiliar ? "Sim" : "Não",
    certificacao: entrega.certificacao || "Não",
  };
}

export function generateEntregasCSV(entregas: EntregaFornecedor[]): string {
  const headers = [
    "Fornecedor",
    "Produto",
    "Unidade de Medida",
    "Valor Unitário",
    "Quantidade Ofertada",
    "Quantidade Entregue",
    "Valor Total",
    "Agricultura Familiar",
    "Certificação",
  ];

  const rows = entregas.map((entrega) => {
    const formatted = formatEntregaForExport(entrega);
    return [
      formatted.fornecedor,
      formatted.produto,
      formatted.unidadeMedida,
      formatted.valorUnitario,
      formatted.quantidadeOfertada,
      formatted.quantidadeEntregue,
      formatted.valorTotal,
      formatted.agriculturaFamiliar,
      formatted.certificacao,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
