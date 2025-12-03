import { Oferta } from "@/utils/product-grouping";

export interface OfertaAPI {
  id: string;
  cicloId: number;
  usuarioId: number;
  usuario?: { id: string; nome: string };
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

export function transformarOfertasParaUI(ofertasAPI: OfertaAPI[]): Oferta[] {
  const resultado: Oferta[] = [];
  ofertasAPI.forEach((oferta) => {
    oferta.ofertaProdutos?.forEach((op) => {
      if (op.produto) {
        resultado.push({
          id: op.id,
          produtoId: op.produtoId,
          produto_base: op.produto.nome,
          nome: `${op.produto.nome} (${op.produto.medida || "un"})`,
          unidade: op.produto.medida || "un",
          valor: op.valorOferta || op.valorReferencia || 0,
          fornecedor: oferta.usuario?.nome || "Fornecedor",
          quantidadeOfertada: op.quantidade,
          certificacao: "convencional",
          tipo_agricultura: "familiar",
        });
      }
    });
  });
  return resultado;
}

export function calcularValorTotalComposicao(
  selectedItems: Array<{ valor: number; quantidade: number }>,
): number {
  return selectedItems.reduce((acc, item) => {
    return acc + item.valor * item.quantidade;
  }, 0);
}

export function calcularTotalItens(
  selectedItems: Array<{ quantidade: number }>,
): number {
  return selectedItems.reduce((acc, item) => acc + item.quantidade, 0);
}
