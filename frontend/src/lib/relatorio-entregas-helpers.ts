export interface EntregaFornecedor {
  id: string;
  fornecedor?: string;
  produto: string;
  unidade_medida: string;
  valor_unitario: number;
  quantidade_entregue: number;
  valor_total: number;
  agricultura_familiar?: boolean;
  certificacao?: "organico" | "transicao" | "convencional";
  data_hora_entrega?: string;
  local_nome?: string;
  local_endereco?: string;
}

export interface FiltrosEntregas {
  busca?: string;
  agriculturaFamiliar?: string;
  certificacao?: string;
}

export interface TotaisEntregas {
  totalQuantidade: number;
  valorTotal: number;
  totalItens: number;
}

export function filtrarEntregas(
  entregas: EntregaFornecedor[],
  filtros: FiltrosEntregas,
): EntregaFornecedor[] {
  return entregas.filter((entrega) => {
    const matchBusca =
      !filtros.busca ||
      entrega.produto.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      (entrega.fornecedor &&
        entrega.fornecedor.toLowerCase().includes(filtros.busca.toLowerCase())) ||
      (entrega.local_nome &&
        entrega.local_nome.toLowerCase().includes(filtros.busca.toLowerCase()));

    const matchAgriculturaFamiliar =
      !filtros.agriculturaFamiliar ||
      filtros.agriculturaFamiliar === "todos" ||
      (filtros.agriculturaFamiliar === "sim" && entrega.agricultura_familiar) ||
      (filtros.agriculturaFamiliar === "nao" && !entrega.agricultura_familiar);

    const matchCertificacao =
      !filtros.certificacao ||
      filtros.certificacao === "todos" ||
      entrega.certificacao === filtros.certificacao;

    return matchBusca && matchAgriculturaFamiliar && matchCertificacao;
  });
}

export function ordenarEntregas(
  entregas: EntregaFornecedor[],
  ordenacao: "asc" | "desc",
): EntregaFornecedor[] {
  return [...entregas].sort((a, b) => {
    const fornecedorA = a.fornecedor || "";
    const fornecedorB = b.fornecedor || "";
    const compareResult = fornecedorA.localeCompare(fornecedorB);
    return ordenacao === "asc" ? compareResult : -compareResult;
  });
}

export function ordenarEntregasPorData(
  entregas: EntregaFornecedor[],
  ordenacao: "urgente" | "antiga",
): EntregaFornecedor[] {
  return [...entregas].sort((a, b) => {
    if (!a.data_hora_entrega || !b.data_hora_entrega) return 0;

    const parseDateTime = (dateTime: string): Date => {
      const [datePart, timePart] = dateTime.split(" ");
      const [day, month, year] = datePart.split("/");
      return new Date(`${year}-${month}-${day}T${timePart || "00:00"}`);
    };

    const dateA = parseDateTime(a.data_hora_entrega);
    const dateB = parseDateTime(b.data_hora_entrega);

    if (ordenacao === "urgente") {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
}

export function calcularTotaisEntregas(
  entregas: EntregaFornecedor[],
): TotaisEntregas {
  return entregas.reduce(
    (totais, entrega) => ({
      totalQuantidade: totais.totalQuantidade + entrega.quantidade_entregue,
      valorTotal: totais.valorTotal + entrega.valor_total,
      totalItens: totais.totalItens + 1,
    }),
    { totalQuantidade: 0, valorTotal: 0, totalItens: 0 },
  );
}

export interface CicloSimples {
  id: string;
  nome: string;
  inicio_ofertas: string;
  fim_ofertas: string;
  status: string;
}

export function filtrarCiclosActivos(ciclos: CicloSimples[]): CicloSimples[] {
  return ciclos
    .filter((ciclo) => ciclo.status === "ativo")
    .sort(
      (a, b) =>
        new Date(b.inicio_ofertas).getTime() -
        new Date(a.inicio_ofertas).getTime(),
    );
}

export function formatarCertificacao(
  certificacao: "organico" | "transicao" | "convencional",
): string {
  const map = {
    organico: "Orgânico",
    transicao: "Transição",
    convencional: "Convencional",
  };
  return map[certificacao];
}

export function formatarAgriculturaFamiliar(
  agriculturaFamiliar: boolean,
): string {
  return agriculturaFamiliar ? "Agricultura Familiar" : "Não Familiar";
}
