/**
 * relatorios-helpers.ts
 * Funções auxiliares para AdminRelatorios.tsx
 */

export interface RelatorioVenda {
  id: number;
  ciclo: string;
  itens: number;
  valor: number;
  status: string;
  data: string;
}

export interface RelatorioQuantidade {
  produto: string;
  totalKg: number;
  fornecedores: string[];
  ciclos: number;
}

export interface RelatorioMercado {
  mercado: string;
  totalVendido: number;
  ticketMedio: number;
  pedidos: number;
}

export interface PeriodoFiltro {
  inicio: string;
  fim: string;
}

// ============================================================================
// VALIDAÇÕES
// ============================================================================

export function validarPeriodo(periodo: PeriodoFiltro): {
  valido: boolean;
  erro?: string;
} {
  if (!periodo.inicio || !periodo.fim) {
    return { valido: false, erro: "Período incompleto" };
  }

  const inicio = new Date(periodo.inicio);
  const fim = new Date(periodo.fim);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return { valido: false, erro: "Datas inválidas" };
  }

  if (inicio > fim) {
    return { valido: false, erro: "Data início deve ser anterior à data fim" };
  }

  return { valido: true };
}

// ============================================================================
// FILTROS
// ============================================================================

export function filtrarVendasPorPeriodo(
  vendas: RelatorioVenda[],
  periodo: PeriodoFiltro
): RelatorioVenda[] {
  const inicio = new Date(periodo.inicio);
  const fim = new Date(periodo.fim);

  return vendas.filter((venda) => {
    const data = new Date(venda.data);
    return data >= inicio && data <= fim;
  });
}

export function filtrarVendasPorStatus(
  vendas: RelatorioVenda[],
  status: string
): RelatorioVenda[] {
  return vendas.filter((venda) => venda.status === status);
}

// ============================================================================
// CÁLCULOS - VENDAS
// ============================================================================

export function calcularTotalVendas(vendas: RelatorioVenda[]): number {
  return vendas.reduce((sum, venda) => sum + venda.valor, 0);
}

export function calcularTicketMedio(vendas: RelatorioVenda[]): number {
  if (vendas.length === 0) return 0;
  const total = calcularTotalVendas(vendas);
  return total / vendas.length;
}

export function calcularTotalItens(vendas: RelatorioVenda[]): number {
  return vendas.reduce((sum, venda) => sum + venda.itens, 0);
}

export function agruparVendasPorCiclo(
  vendas: RelatorioVenda[]
): Record<string, RelatorioVenda[]> {
  return vendas.reduce((acc, venda) => {
    if (!acc[venda.ciclo]) {
      acc[venda.ciclo] = [];
    }
    acc[venda.ciclo].push(venda);
    return acc;
  }, {} as Record<string, RelatorioVenda[]>);
}

// ============================================================================
// CÁLCULOS - QUANTIDADES
// ============================================================================

export function calcularTotalKgProdutos(
  quantidades: RelatorioQuantidade[]
): number {
  return quantidades.reduce((sum, q) => sum + q.totalKg, 0);
}

export function ordenarProdutosPorQuantidade(
  quantidades: RelatorioQuantidade[],
  ordem: "asc" | "desc" = "desc"
): RelatorioQuantidade[] {
  return [...quantidades].sort((a, b) => {
    return ordem === "desc" ? b.totalKg - a.totalKg : a.totalKg - b.totalKg;
  });
}

export function filtrarProdutosPorFornecedor(
  quantidades: RelatorioQuantidade[],
  fornecedor: string
): RelatorioQuantidade[] {
  return quantidades.filter((q) => q.fornecedores.includes(fornecedor));
}

// ============================================================================
// CÁLCULOS - MERCADOS
// ============================================================================

export function calcularTotalVendidoMercados(
  mercados: RelatorioMercado[]
): number {
  return mercados.reduce((sum, m) => sum + m.totalVendido, 0);
}

export function calcularTicketMedioGeral(
  mercados: RelatorioMercado[]
): number {
  if (mercados.length === 0) return 0;
  const totalVendido = calcularTotalVendidoMercados(mercados);
  const totalPedidos = mercados.reduce((sum, m) => sum + m.pedidos, 0);

  return totalPedidos > 0 ? totalVendido / totalPedidos : 0;
}

export function ordenarMercadosPorVendas(
  mercados: RelatorioMercado[],
  ordem: "asc" | "desc" = "desc"
): RelatorioMercado[] {
  return [...mercados].sort((a, b) => {
    return ordem === "desc"
      ? b.totalVendido - a.totalVendido
      : a.totalVendido - b.totalVendido;
  });
}

// ============================================================================
// FORMATAÇÃO
// ============================================================================

export function formatarValorMonetario(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarDataBR(dataStr: string): string {
  if (!dataStr) return "";
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ============================================================================
// EXPORTAÇÃO
// ============================================================================

export function gerarCSVVendas(vendas: RelatorioVenda[]): string {
  const header = "Ciclo,Itens,Valor,Status,Data\n";
  const rows = vendas
    .map(
      (v) =>
        `"${v.ciclo}",${v.itens},${v.valor.toFixed(2)},"${v.status}","${v.data}"`
    )
    .join("\n");
  return header + rows;
}

export function gerarCSVQuantidades(
  quantidades: RelatorioQuantidade[]
): string {
  const header = "Produto,Total (kg),Fornecedores,Ciclos\n";
  const rows = quantidades
    .map(
      (q) =>
        `"${q.produto}",${q.totalKg},"${q.fornecedores.join("; ")}",${q.ciclos}`
    )
    .join("\n");
  return header + rows;
}

export function gerarCSVMercados(mercados: RelatorioMercado[]): string {
  const header = "Mercado,Total Vendido,Ticket Médio,Pedidos\n";
  const rows = mercados
    .map(
      (m) =>
        `"${m.mercado}",${m.totalVendido.toFixed(2)},${m.ticketMedio.toFixed(2)},${m.pedidos}`
    )
    .join("\n");
  return header + rows;
}
