// Tipos de venda
export const tipoVendaLabels: Record<string, string> = {
  cesta: "Cesta",
  lote: "Lote",
  venda_direta: "Venda Direta",
};

export const tipoVendaColors: Record<string, string> = {
  cesta: "bg-blue-100 text-blue-800",
  lote: "bg-purple-100 text-purple-800",
  venda_direta: "bg-green-100 text-green-800",
};

// Format functions
export function formatTipoVenda(tipo: string): string {
  return tipoVendaLabels[tipo] || tipo;
}

export function getTipoVendaColor(tipo: string): string {
  return tipoVendaColors[tipo] || "bg-gray-100 text-gray-800";
}

export function formatValorCurrency(valor: number | null | undefined): string {
  if (!valor && valor !== 0) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatQuantidade(quantidade: number | null | undefined): string {
  if (!quantidade && quantidade !== 0) return "-";
  return quantidade.toString();
}

// Validation functions
export function isValidTipoVenda(tipo: string): boolean {
  return ["cesta", "lote", "venda_direta"].includes(tipo);
}

export function isValidQuantidadeCestas(quantidade: number | null | undefined): boolean {
  if (quantidade === null || quantidade === undefined) return false;
  return quantidade > 0;
}

export function isValidValorAlvo(valor: number | null | undefined): boolean {
  if (valor === null || valor === undefined) return false;
  return valor > 0;
}

export function validateCicloMercadoCesta(data: {
  quantidadeCestas?: number | null;
  valorAlvoCesta?: number | null;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidQuantidadeCestas(data.quantidadeCestas)) {
    errors.push("Quantidade de cestas é obrigatória e deve ser maior que zero");
  }

  if (!isValidValorAlvo(data.valorAlvoCesta)) {
    errors.push("Valor alvo da cesta é obrigatório e deve ser maior que zero");
  }

  return { valid: errors.length === 0, errors };
}

export function validateCicloMercadoLote(data: {
  valorAlvoLote?: number | null;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidValorAlvo(data.valorAlvoLote)) {
    errors.push("Valor alvo do lote é obrigatório e deve ser maior que zero");
  }

  return { valid: errors.length === 0, errors };
}

// Filter functions
export function filterMercadosByTipoVenda(
  mercados: any[],
  tipoVenda: string,
): any[] {
  return mercados.filter((m) => m.tipoVenda === tipoVenda);
}

export function filterMercadosByStatus(
  mercados: any[],
  status: string,
): any[] {
  return mercados.filter((m) => m.status === status);
}

export function sortMercadosByOrdem(mercados: any[]): any[] {
  return [...mercados].sort((a, b) => a.ordemAtendimento - b.ordemAtendimento);
}

// Utility functions
export function getMercadoDisplayName(mercado: {
  mercado?: { nome: string };
  tipoVenda: string;
}): string {
  const nomeBase = mercado.mercado?.nome || "Mercado";
  const tipo = formatTipoVenda(mercado.tipoVenda);
  return `${nomeBase} - ${tipo}`;
}

export function canRemoveMercado(mercado: { status: string }): boolean {
  return mercado.status === "ativo" || mercado.status === "inativo";
}

export function getNextOrdemAtendimento(mercados: any[]): number {
  if (mercados.length === 0) return 1;
  const maxOrdem = Math.max(...mercados.map((m) => m.ordemAtendimento || 0));
  return maxOrdem + 1;
}

export function hasRequiredFieldsForTipoVenda(
  tipoVenda: string,
  data: {
    quantidadeCestas?: number | null;
    valorAlvoCesta?: number | null;
    valorAlvoLote?: number | null;
  },
): boolean {
  if (tipoVenda === "cesta") {
    return isValidQuantidadeCestas(data.quantidadeCestas) &&
           isValidValorAlvo(data.valorAlvoCesta);
  }
  if (tipoVenda === "lote") {
    return isValidValorAlvo(data.valorAlvoLote);
  }
  // venda_direta no requiere campos especiales
  return true;
}

export function getMercadoSummary(mercado: {
  tipoVenda: string;
  quantidadeCestas?: number | null;
  valorAlvoCesta?: number | null;
  valorAlvoLote?: number | null;
}): string {
  if (mercado.tipoVenda === "cesta") {
    return `${mercado.quantidadeCestas || 0} cestas - ${formatValorCurrency(mercado.valorAlvoCesta)}`;
  }
  if (mercado.tipoVenda === "lote") {
    return `Valor alvo: ${formatValorCurrency(mercado.valorAlvoLote)}`;
  }
  return "Venda Direta";
}

export function countMercadosByTipo(mercados: any[]): {
  cesta: number;
  lote: number;
  venda_direta: number;
} {
  return mercados.reduce(
    (acc, mercado) => {
      if (mercado.tipoVenda in acc) {
        acc[mercado.tipoVenda as keyof typeof acc]++;
      }
      return acc;
    },
    { cesta: 0, lote: 0, venda_direta: 0 },
  );
}

export function getMercadosAtivos(mercados: any[]): any[] {
  return mercados.filter((m) => m.status === "ativo");
}

export function getMercadosInativos(mercados: any[]): any[] {
  return mercados.filter((m) => m.status === "inativo");
}
