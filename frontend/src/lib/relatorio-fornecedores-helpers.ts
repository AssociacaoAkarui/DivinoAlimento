export interface OfertaAPI {
  id: string;
  cicloId: number;
  usuarioId: number;
  usuario?: { id: string; nome: string };
  ciclo?: { id: string; nome: string };
  status: string;
  ofertaProdutos?: OfertaProdutoAPI[];
}

export interface OfertaProdutoAPI {
  id: string;
  produtoId: number;
  produto?: { id: string; nome: string; medida?: string };
  quantidade: number;
  valorReferencia?: number;
  valorOferta?: number;
}

export interface EntregaFornecedor {
  id: string;
  fornecedor: string;
  produto: string;
  unidade_medida: string;
  valor_unitario: number;
  quantidade_entregue: number;
  valor_total: number;
  ciclo: string;
  agricultura_familiar: boolean;
  certificacao: 'organico' | 'transicao' | 'convencional';
}

export function transformarOfertasParaRelatorio(
  ofertasAPI: OfertaAPI[]
): EntregaFornecedor[] {
  const resultado: EntregaFornecedor[] = [];

  ofertasAPI.forEach((oferta) => {
    oferta.ofertaProdutos?.forEach((op) => {
      if (op.produto) {
        const valorUnitario = op.valorOferta || op.valorReferencia || 0;
        resultado.push({
          id: op.id,
          fornecedor: oferta.usuario?.nome || 'Fornecedor',
          produto: op.produto.nome,
          unidade_medida: op.produto.medida || 'un',
          valor_unitario: valorUnitario,
          quantidade_entregue: op.quantidade,
          valor_total: valorUnitario * op.quantidade,
          ciclo: oferta.ciclo?.nome || `Ciclo ${oferta.cicloId}`,
          agricultura_familiar: true,
          certificacao: 'convencional',
        });
      }
    });
  });

  return resultado;
}

export function consolidarOfertasPorFornecedor(
  ofertasAPI: OfertaAPI[]
): Map<string, { total: number; quantidadeRegistros: number }> {
  const consolidado = new Map<string, { total: number; quantidadeRegistros: number }>();

  ofertasAPI.forEach((oferta) => {
    const fornecedor = oferta.usuario?.nome || 'Fornecedor';

    oferta.ofertaProdutos?.forEach((op) => {
      const valorUnitario = op.valorOferta || op.valorReferencia || 0;
      const valorTotal = valorUnitario * op.quantidade;

      if (!consolidado.has(fornecedor)) {
        consolidado.set(fornecedor, { total: 0, quantidadeRegistros: 0 });
      }

      const current = consolidado.get(fornecedor)!;
      current.total += valorTotal;
      current.quantidadeRegistros += 1;
    });
  });

  return consolidado;
}

export function calcularResumoConsolidado(entregas: EntregaFornecedor[]): {
  totalQuantidade: number;
  valorTotal: number;
  quantidadeRegistros: number;
} {
  const totalQuantidade = entregas.reduce((acc, e) => acc + e.quantidade_entregue, 0);
  const valorTotal = entregas.reduce((acc, e) => acc + e.valor_total, 0);

  return {
    totalQuantidade,
    valorTotal,
    quantidadeRegistros: entregas.length,
  };
}

export function filtrarEntregas(
  entregas: EntregaFornecedor[],
  filtros: {
    searchTerm?: string;
    agriculturaFamiliar?: string;
    certificacao?: string;
  }
): EntregaFornecedor[] {
  return entregas.filter((entrega) => {
    const matchSearch = !filtros.searchTerm ||
      entrega.fornecedor.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      entrega.produto.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      entrega.ciclo.toLowerCase().includes(filtros.searchTerm.toLowerCase());

    const matchAgriculturaFamiliar = !filtros.agriculturaFamiliar ||
      filtros.agriculturaFamiliar === 'todos' ||
      (filtros.agriculturaFamiliar === 'sim' && entrega.agricultura_familiar) ||
      (filtros.agriculturaFamiliar === 'nao' && !entrega.agricultura_familiar);

    const matchCertificacao = !filtros.certificacao ||
      filtros.certificacao === 'todos' ||
      entrega.certificacao === filtros.certificacao;

    return matchSearch && matchAgriculturaFamiliar && matchCertificacao;
  });
}

export function ordenarEntregas(
  entregas: EntregaFornecedor[],
  sortBy: 'fornecedor' | null,
  sortOrder: 'asc' | 'desc'
): EntregaFornecedor[] {
  if (sortBy === 'fornecedor') {
    return [...entregas].sort((a, b) => {
      const compareResult = a.fornecedor.localeCompare(b.fornecedor);
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  }
  return entregas;
}
