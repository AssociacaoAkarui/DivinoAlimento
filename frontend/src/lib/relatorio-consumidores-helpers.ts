export interface PedidoConsumidorAPI {
  id: string;
  cicloId: number;
  usuarioId: number;
  usuario?: { id: string; nome: string };
  ciclo?: { id: string; nome: string };
  status: string;
  pedidoConsumidoresProdutos?: PedidoConsumidorProdutoAPI[];
}

export interface PedidoConsumidorProdutoAPI {
  id: string;
  produtoId: number;
  produto?: { id: string; nome: string; medida?: string };
  quantidade: number;
  valorOferta?: number;
  valorCompra?: number;
}

export interface PedidoConsumidor {
  id: string;
  consumidor: string;
  produto: string;
  fornecedor: string;
  medida: string;
  valor_unitario: number;
  quantidade: number;
  total: number;
  ciclo: string;
  agricultura_familiar: boolean;
  certificacao: 'organico' | 'transicao' | 'convencional';
}

export function transformarPedidosParaRelatorio(
  pedidosAPI: PedidoConsumidorAPI[]
): PedidoConsumidor[] {
  const resultado: PedidoConsumidor[] = [];

  pedidosAPI.forEach((pedido) => {
    pedido.pedidoConsumidoresProdutos?.forEach((item) => {
      if (item.produto) {
        const valorUnitario = item.valorCompra || item.valorOferta || 0;
        resultado.push({
          id: `${pedido.id}-${item.id}`,
          consumidor: pedido.usuario?.nome || 'Consumidor',
          produto: item.produto.nome,
          fornecedor: 'Fornecedor',
          medida: item.produto.medida || 'un',
          valor_unitario: valorUnitario,
          quantidade: item.quantidade,
          total: valorUnitario * item.quantidade,
          ciclo: pedido.ciclo?.nome || `Ciclo ${pedido.cicloId}`,
          agricultura_familiar: true,
          certificacao: 'convencional',
        });
      }
    });
  });

  return resultado;
}

export function consolidarPedidosPorConsumidor(
  pedidosAPI: PedidoConsumidorAPI[]
): Map<string, { total: number; quantidadeItens: number }> {
  const consolidado = new Map<string, { total: number; quantidadeItens: number }>();

  pedidosAPI.forEach((pedido) => {
    const consumidor = pedido.usuario?.nome || 'Consumidor';

    pedido.pedidoConsumidoresProdutos?.forEach((item) => {
      const valorUnitario = item.valorCompra || item.valorOferta || 0;
      const total = valorUnitario * item.quantidade;

      if (!consolidado.has(consumidor)) {
        consolidado.set(consumidor, { total: 0, quantidadeItens: 0 });
      }

      const current = consolidado.get(consumidor)!;
      current.total += total;
      current.quantidadeItens += 1;
    });
  });

  return consolidado;
}

export function calcularResumoConsolidadoPedidos(pedidos: PedidoConsumidor[]): {
  totalConsumidores: number;
  totalKg: number;
  valorTotal: number;
  quantidadeRegistros: number;
} {
  const totalConsumidores = new Set(pedidos.map((p) => p.consumidor)).size;
  const totalKg = pedidos
    .filter((p) => p.medida === 'kg')
    .reduce((acc, p) => acc + p.quantidade, 0);
  const valorTotal = pedidos.reduce((acc, p) => acc + p.total, 0);

  return {
    totalConsumidores,
    totalKg,
    valorTotal,
    quantidadeRegistros: pedidos.length,
  };
}

export function filtrarPedidos(
  pedidos: PedidoConsumidor[],
  filtros: {
    searchTerm?: string;
    agriculturaFamiliar?: string;
    certificacao?: string;
  }
): PedidoConsumidor[] {
  return pedidos.filter((pedido) => {
    const matchSearch = !filtros.searchTerm ||
      pedido.consumidor.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      pedido.produto.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      pedido.fornecedor.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
      pedido.ciclo.toLowerCase().includes(filtros.searchTerm.toLowerCase());

    const matchAgriculturaFamiliar = !filtros.agriculturaFamiliar ||
      filtros.agriculturaFamiliar === 'todos' ||
      (filtros.agriculturaFamiliar === 'sim' && pedido.agricultura_familiar) ||
      (filtros.agriculturaFamiliar === 'nao' && !pedido.agricultura_familiar);

    const matchCertificacao = !filtros.certificacao ||
      filtros.certificacao === 'todos' ||
      pedido.certificacao === filtros.certificacao;

    return matchSearch && matchAgriculturaFamiliar && matchCertificacao;
  });
}

export function ordenarPedidos(
  pedidos: PedidoConsumidor[],
  sortBy: 'fornecedor' | null,
  sortOrder: 'asc' | 'desc'
): PedidoConsumidor[] {
  if (sortBy === 'fornecedor') {
    return [...pedidos].sort((a, b) => {
      const compareResult = a.fornecedor.localeCompare(b.fornecedor);
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  }
  return pedidos;
}
