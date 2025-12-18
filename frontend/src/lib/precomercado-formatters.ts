export function formatPreco(preco: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

export function formatPrecoSimple(preco: number): string {
  return preco.toFixed(2).replace(".", ",");
}

export function parsePrecoFromBRL(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export function formatStatusPreco(status: string): string {
  const statusMap: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
  };
  return statusMap[status] || status;
}

export function getStatusPrecoColor(status: string): string {
  const colorMap: Record<string, string> = {
    ativo: "success",
    inativo: "secondary",
  };
  return colorMap[status] || "default";
}

export function formatPriceDifference(difference: number): string {
  const formatted = formatPreco(Math.abs(difference));
  return difference >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function formatPricePercentage(percentage: number): string {
  return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
}

export function formatCreateSuccessMessage(produtoNome: string, mercadoNome: string): string {
  return `Preço de ${produtoNome} criado com sucesso para ${mercadoNome}`;
}

export function formatUpdateSuccessMessage(produtoNome: string): string {
  return `Preço de ${produtoNome} atualizado com sucesso`;
}

export function formatDeleteSuccessMessage(produtoNome: string): string {
  return `Preço de ${produtoNome} removido com sucesso`;
}

export function formatCreateError(error: any): string {
  if (error?.message) {
    if (error.message.includes("Já existe")) {
      return "Já existe um preço cadastrado para este produto neste mercado";
    }
    return error.message;
  }
  return "Erro ao criar preço";
}

export function formatUpdateError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return "Erro ao atualizar preço";
}

export function formatDeleteError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return "Erro ao excluir preço";
}

export function formatPrecoWithMedida(preco: number, medida: string): string {
  return `${formatPreco(preco)} / ${medida}`;
}

export function formatPriceComparison(
  precoMercado: number,
  precoReferencia: number
): string {
  const diff = precoMercado - precoReferencia;
  const percentage = precoReferencia !== 0 ? (diff / precoReferencia) * 100 : 0;

  if (diff === 0) {
    return "Igual ao preço de referência";
  }

  const arrow = diff > 0 ? "↑" : "↓";
  return `${arrow} ${formatPricePercentage(percentage)} (${formatPriceDifference(diff)})`;
}
