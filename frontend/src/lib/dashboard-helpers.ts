import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  badge?: string;
  enabled?: boolean;
}

export interface MenuSection {
  titulo: string;
  items: MenuItem[];
}

export function agruparMenuPorSecoes(
  sections: Record<string, MenuItem[]>,
): MenuSection[] {
  return Object.entries(sections).map(([titulo, items]) => ({
    titulo,
    items,
  }));
}

export function filtrarMenuItemsHabilitados(items: MenuItem[]): MenuItem[] {
  return items.filter((item) => item.enabled !== false);
}

export function obterMenuItemPorRota(
  items: MenuItem[],
  rota: string,
): MenuItem | undefined {
  return items.find((item) => item.route === rota);
}

export function validarAcessoMenu(
  item: MenuItem,
  userRole: string,
): boolean {
  const rotasPorRole: Record<string, string[]> = {
    admin: ["/admin/", "/usuario/"],
    adminmercado: ["/adminmercado/", "/usuario/"],
    fornecedor: ["/fornecedor/", "/usuario/"],
    consumidor: ["/pedidoConsumidores/", "/usuario/", "/dashboard"],
  };

  const rotasPermitidas = rotasPorRole[userRole] || [];

  return rotasPermitidas.some((rotaPermitida) =>
    item.route.startsWith(rotaPermitida),
  );
}

// Helpers específicos para Dashboard do Consumidor

export interface Produto {
  id: string;
  produtoId: number;
  quantidade: number;
  valorOferta?: number;
  valorCompra?: number;
  produto?: {
    nome: string;
    medida?: string;
  };
}

export interface PedidoConsumidor {
  id: string;
  cicloId: number;
  pedidoConsumidoresProdutos?: Produto[];
}

export interface Ciclo {
  id: string;
  nome: string;
  status: string;
  ofertaInicio: string;
  ofertaFim: string;
}

export function filtrarCiclosAtivos(ciclos: Ciclo[]): Ciclo[] {
  return ciclos.filter((c) => c.status === "oferta");
}

export function encontrarPedidoDoCiclo(
  pedidos: PedidoConsumidor[],
  cicloId: string,
): PedidoConsumidor | undefined {
  return pedidos.find((p) => p.cicloId === parseInt(cicloId));
}

export function calcularValorTotalProdutos(produtos: Produto[]): number {
  return produtos.reduce((acc, p) => {
    const valor = p.valorCompra || p.valorOferta || 0;
    return acc + valor * p.quantidade;
  }, 0);
}

export function separarProdutosCestaVarejo(
  produtosPedido: Produto[],
  produtosCesta: Produto[],
): {
  cesta: Produto[];
  varejo: Produto[];
  totalCesta: number;
  totalVarejo: number;
} {
  // Por ahora todo es varejo, cesta viene de composiciones separadamente
  const varejo = produtosPedido;
  const cesta = produtosCesta;

  return {
    cesta,
    varejo,
    totalCesta: calcularValorTotalProdutos(cesta),
    totalVarejo: calcularValorTotalProdutos(varejo),
  };
}

export function obterCicloMaisRecente(ciclos: Ciclo[]): Ciclo | null {
  if (ciclos.length === 0) return null;

  return ciclos.reduce((maisRecente, ciclo) => {
    const dataAtual = new Date(ciclo.ofertaInicio);
    const dataMaisRecente = new Date(maisRecente.ofertaInicio);
    return dataAtual > dataMaisRecente ? ciclo : maisRecente;
  });
}

export function contarProdutosUnicos(produtos: Produto[]): number {
  const produtosUnicos = new Set(produtos.map((p) => p.produtoId));
  return produtosUnicos.size;
}

export function temPedidoAtivo(
  pedidos: PedidoConsumidor[],
  cicloId: string,
): boolean {
  const pedido = encontrarPedidoDoCiclo(pedidos, cicloId);
  return pedido !== undefined && (pedido.pedidoConsumidoresProdutos?.length ?? 0) > 0;
}
