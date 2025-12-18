import { OfertaProduto as OfertaProdutoAPI } from "@/hooks/graphql";

export interface ProdutoComercializavelAPI {
  id: string;
  produtoId: number;
  produto?: {
    id: string;
    nome: string;
  };
  medida: string;
  pesoKg?: number;
  precoBase: number;
  status: string;
}

export interface ProdutoOfertado {
  id: string;
  produtoId: string;
  nome: string;
  unidade: string;
  peso?: number;
  volume?: number;
  precoBase: number;
  valor: number;
  quantidade: number;
}

export function criarDescricaoProdutoComercializavel(
  produto: ProdutoComercializavelAPI,
): string {
  const nome = produto.produto?.nome || "Produto";
  const medida = produto.medida || "";
  const peso = produto.pesoKg ? `${produto.pesoKg.toFixed(2)} kg` : "";
  const preco = `R$ ${produto.precoBase.toFixed(2).replace(".", ",")}`;

  return `${nome} (${medida}) - ${peso} - ${preco}`;
}

export function transformarOfertaProdutoParaUI(
  ofertaProduto: OfertaProdutoAPI,
): ProdutoOfertado {
  return {
    id: ofertaProduto.id,
    produtoId: ofertaProduto.produtoId.toString(),
    nome: ofertaProduto.produto?.nome || "",
    unidade: ofertaProduto.produto?.medida || "",
    peso: undefined,
    volume: undefined,
    precoBase: ofertaProduto.produto?.valorReferencia || 0,
    valor: ofertaProduto.valorOferta || ofertaProduto.valorReferencia || 0,
    quantidade: ofertaProduto.quantidade,
  };
}

export function calcularTotalOferta(produtos: ProdutoOfertado[]): number {
  return produtos.reduce((sum, p) => sum + p.valor * p.quantidade, 0);
}

export function calcularQuantidadeTotal(produtos: ProdutoOfertado[]): number {
  return produtos.reduce((sum, p) => sum + p.quantidade, 0);
}

export function validarProdutoOferta(
  produtoId: string,
  quantidade: string,
  valor: string,
): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  if (!produtoId) {
    erros.push("Produto");
  }

  if (!valor) {
    erros.push("Valor Unitário");
  }

  if (!quantidade) {
    erros.push("Quantidade");
  }

  const valorNumerico = valor
    ? parseFloat(valor.replace(",", ".").replace(/[^\d.]/g, ""))
    : 0;
  const quantidadeNumerica = quantidade ? parseInt(quantidade) : 0;

  if (valorNumerico < 0.01) {
    erros.push("Valor deve ser ≥ R$ 0,01");
  }

  if (quantidadeNumerica < 1) {
    erros.push("Quantidade deve ser ≥ 1");
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

export function filtrarProdutosPorBusca(
  produtos: ProdutoComercializavelAPI[],
  busca: string,
): ProdutoComercializavelAPI[] {
  if (!busca) {
    return produtos;
  }

  const buscaLower = busca.toLowerCase();
  return produtos.filter(
    (p) =>
      (p.produto?.nome || "").toLowerCase().includes(buscaLower) ||
      p.medida.toLowerCase().includes(buscaLower),
  );
}

export function extrairProdutosBase(
  produtosComercializaveis: ProdutoComercializavelAPI[],
): Array<{ id: string; nome: string }> {
  const baseMap = new Map<string, string>();

  produtosComercializaveis.forEach((p) => {
    if (p.produto) {
      baseMap.set(p.produto.id, p.produto.nome);
    }
  });

  return Array.from(baseMap.entries()).map(([id, nome]) => ({ id, nome }));
}

export function obterVariacoesProduto(
  produtosComercializaveis: ProdutoComercializavelAPI[],
  produtoBaseId: string,
): ProdutoComercializavelAPI[] {
  if (!produtoBaseId) {
    return [];
  }

  return produtosComercializaveis.filter(
    (p) => p.produto?.id === produtoBaseId,
  );
}

export function isPeriodoOfertaAberto(
  ofertaInicio?: string,
  ofertaFim?: string,
): boolean {
  if (!ofertaInicio || !ofertaFim) {
    return true;
  }

  const inicio = new Date(ofertaInicio);
  const fim = new Date(ofertaFim);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return true;
  }

  const agora = new Date();
  return agora >= inicio && agora <= fim;
}
