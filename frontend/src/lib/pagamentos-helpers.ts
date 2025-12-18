export interface Ciclo {
  id: string;
  nome: string;
  periodo: string;
  status: string;
  totalFornecedores: number;
  totalConsumidores: number;
}

export interface Pagamento {
  id: string;
  tipo: "Fornecedor" | "Consumidor";
  nome: string;
  ciclo: string;
  mercado: string;
  valorTotal: number;
  status: "A receber" | "A pagar" | "Pago" | "Cancelado";
  dataPagamento?: string;
  observacao?: string;
}

export function filtrarCiclosFinalizados(ciclos: Ciclo[]): Ciclo[] {
  return ciclos.filter((ciclo) => ciclo.status === "Finalizado");
}

export function calcularTotaisCiclos(ciclos: Ciclo[]): {
  totalFornecedores: number;
  totalConsumidores: number;
} {
  return ciclos.reduce(
    (acc, ciclo) => ({
      totalFornecedores: acc.totalFornecedores + ciclo.totalFornecedores,
      totalConsumidores: acc.totalConsumidores + ciclo.totalConsumidores,
    }),
    { totalFornecedores: 0, totalConsumidores: 0 },
  );
}

export function todosOsCiclosFinalizados(ciclos: Ciclo[]): boolean {
  if (ciclos.length === 0) return false;
  return ciclos.every((ciclo) => ciclo.status === "Finalizado");
}

export function formatarValorMonetario(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseValorMonetario(valorFormatado: string): number {
  const numeroLimpo = valorFormatado.replace(/[^\d,]/g, "");
  return parseFloat(numeroLimpo.replace(",", "."));
}

export function validarValorPagamento(valor: number): {
  valido: boolean;
  erro?: string;
} {
  if (isNaN(valor)) {
    return { valido: false, erro: "Valor inválido" };
  }

  if (valor < 0) {
    return { valido: false, erro: "Valor não pode ser negativo" };
  }

  if (valor === 0) {
    return { valido: false, erro: "Valor deve ser maior que zero" };
  }

  return { valido: true };
}

export function filtrarPagamentosPorTipo(
  pagamentos: Pagamento[],
  tipo: "Fornecedor" | "Consumidor",
): Pagamento[] {
  return pagamentos.filter((p) => p.tipo === tipo);
}

export function filtrarPagamentosPorStatus(
  pagamentos: Pagamento[],
  status: Pagamento["status"],
): Pagamento[] {
  return pagamentos.filter((p) => p.status === status);
}

export function calcularTotalPagamentos(pagamentos: Pagamento[]): number {
  return pagamentos.reduce((sum, p) => sum + p.valorTotal, 0);
}

export function contarPagamentosPorStatus(pagamentos: Pagamento[]): {
  aReceber: number;
  aPagar: number;
  pago: number;
  cancelado: number;
} {
  return pagamentos.reduce(
    (acc, p) => {
      if (p.status === "A receber") acc.aReceber++;
      else if (p.status === "A pagar") acc.aPagar++;
      else if (p.status === "Pago") acc.pago++;
      else if (p.status === "Cancelado") acc.cancelado++;
      return acc;
    },
    { aReceber: 0, aPagar: 0, pago: 0, cancelado: 0 },
  );
}

export function validarDataPagamento(data: string): {
  valido: boolean;
  erro?: string;
} {
  if (!data) {
    return { valido: true }; // Data é opcional
  }

  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) {
    return { valido: false, erro: "Data inválida" };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (dataObj > hoje) {
    return { valido: false, erro: "Data não pode ser futura" };
  }

  return { valido: true };
}

export function agruparPagamentosPorCiclo(
  pagamentos: Pagamento[],
): Record<string, Pagamento[]> {
  return pagamentos.reduce(
    (acc, pagamento) => {
      if (!acc[pagamento.ciclo]) {
        acc[pagamento.ciclo] = [];
      }
      acc[pagamento.ciclo].push(pagamento);
      return acc;
    },
    {} as Record<string, Pagamento[]>,
  );
}

export function obterPagamentosPendentes(
  pagamentos: Pagamento[],
): Pagamento[] {
  return pagamentos.filter(
    (p) => p.status === "A receber" || p.status === "A pagar",
  );
}
