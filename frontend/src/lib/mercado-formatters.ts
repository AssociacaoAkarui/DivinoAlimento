export function formatTipoMercado(tipo: string): string {
  const tipos: Record<string, string> = {
    cesta: "Cesta",
    lote: "Lote",
    venda_direta: "Venda Direta",
  };
  return tipos[tipo] || tipo;
}

export function formatStatusMercado(status: string): string {
  return status === "ativo" ? "Ativo" : "Inativo";
}

export function formatValorMaximoCesta(valor: number | null): string {
  if (valor === null || valor === undefined) {
    return "N/A";
  }
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

export function formatTaxaAdministrativa(taxa: number | null): string {
  if (taxa === null || taxa === undefined) {
    return "Não aplicável";
  }
  return `${taxa.toFixed(1).replace(".", ",")}%`;
}

export function formatPontosEntrega(pontosEntrega: any[]): string {
  if (!pontosEntrega || pontosEntrega.length === 0) {
    return "Nenhum ponto de entrega";
  }
  return pontosEntrega.map((ponto) => ponto.nome).join(", ");
}

export function formatPontosEntregaCount(count: number): string {
  if (count === 0) {
    return "Nenhum ponto";
  }
  if (count === 1) {
    return "1 ponto";
  }
  return `${count} pontos`;
}

export function getTipoMercadoBadgeColor(tipo: string): string {
  const colors: Record<string, string> = {
    cesta: "bg-blue-500 text-white",
    lote: "bg-green-500 text-white",
    venda_direta: "bg-purple-500 text-white",
  };
  return colors[tipo] || "bg-gray-500 text-white";
}

export function getStatusMercadoBadgeColor(status: string): string {
  return status === "ativo" ? "bg-success text-white" : "bg-secondary";
}

export function formatCreateSuccessMessage(nomeMercado: string): string {
  return `Mercado "${nomeMercado}" criado com sucesso`;
}

export function formatUpdateSuccessMessage(nomeMercado: string): string {
  return `Mercado "${nomeMercado}" atualizado com sucesso`;
}

export function formatDeleteSuccessMessage(nomeMercado: string): string {
  return `Mercado "${nomeMercado}" excluído com sucesso`;
}

export function formatCreateError(error: any): string {
  if (error.message) {
    if (error.message.includes("valorMaximoCesta")) {
      return "O valor máximo por cesta é obrigatório para mercados tipo Cesta";
    }
    if (error.message.includes("responsavelId")) {
      return "Selecione um responsável válido";
    }
    if (error.message.includes("ponto de entrega")) {
      return "Ao menos um ponto de entrega deve estar vinculado";
    }
    if (error.message.includes("taxa administrativa")) {
      return "A taxa administrativa deve estar entre 0 e 100%";
    }
  }
  return "Erro ao criar mercado. Verifique os dados e tente novamente.";
}

export function formatUpdateError(error: any): string {
  if (error.message) {
    if (error.message.includes("não encontrado")) {
      return "Mercado não encontrado";
    }
    if (error.message.includes("valorMaximoCesta")) {
      return "O valor máximo por cesta é obrigatório para mercados tipo Cesta";
    }
  }
  return "Erro ao atualizar mercado. Tente novamente.";
}

export function formatDeleteError(error: any): string {
  if (error.message) {
    if (error.message.includes("não encontrado")) {
      return "Mercado não encontrado";
    }
    if (error.message.includes("ciclo")) {
      return "Não é possível excluir este mercado pois existem ciclos vinculados";
    }
  }
  return "Erro ao excluir mercado. Tente novamente.";
}

export function formatListError(error: any): string {
  if (error.message) {
    if (error.message.includes("Unauthorized")) {
      return "Você não tem permissão para listar mercados";
    }
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Erro de conexão. Verifique sua internet.";
    }
  }
  return "Erro ao carregar mercados. Tente novamente.";
}

export function formatValidationError(field: string): string {
  const errors: Record<string, string> = {
    nome: "O nome do mercado é obrigatório",
    tipo: "Selecione o tipo de mercado",
    responsavelId: "Selecione o administrador responsável",
    valorMaximoCesta: "Informe o valor máximo por cesta",
    pontosEntrega: "Ao menos um ponto de entrega deve estar vinculado",
    taxaAdministrativa: "A taxa administrativa deve estar entre 0 e 100%",
  };
  return errors[field] || `Campo ${field} inválido`;
}

export function formatValorForInput(valor: number | null): string {
  if (valor === null || valor === undefined) {
    return "";
  }
  return String(valor).replace(".", ",");
}

export function parseValorFromInput(valor: string): number | null {
  if (!valor || valor.trim() === "") {
    return null;
  }
  const parsed = parseFloat(valor.replace(",", "."));
  return isNaN(parsed) ? null : parsed;
}

export function formatMercadoSummary(mercado: any): string {
  const tipo = formatTipoMercado(mercado.tipo);
  const status = formatStatusMercado(mercado.status);
  const pontos = mercado.pontosEntrega?.length || 0;

  return `${mercado.nome} - ${tipo} (${status}) - ${formatPontosEntregaCount(pontos)}`;
}

export function formatResponsavelDisplay(responsavel: any): string {
  if (!responsavel) {
    return "Não definido";
  }
  return responsavel.nome || responsavel.email || "Não definido";
}
