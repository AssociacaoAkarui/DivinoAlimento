import type { PontoEntrega } from "@/hooks/graphql";

export function formatarEndereco(pontoEntrega: PontoEntrega): string {
  const parts: string[] = [];
  if (pontoEntrega.endereco) parts.push(pontoEntrega.endereco);
  if (pontoEntrega.bairro) parts.push(pontoEntrega.bairro);
  return parts.join(", ");
}

export function formatarCidadeEstado(pontoEntrega: PontoEntrega): string {
  const parts: string[] = [];
  if (pontoEntrega.cidade) parts.push(pontoEntrega.cidade);
  if (pontoEntrega.estado) parts.push(pontoEntrega.estado.toUpperCase());
  return parts.join(" - ");
}

export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
  };
  return statusMap[status] || status;
}

export function getStatusBadgeColor(status: string): string {
  const colorMap: Record<string, string> = {
    ativo: "bg-green-100 text-green-800",
    inativo: "bg-gray-100 text-gray-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
}

export function formatCep(cep: string | undefined): string {
  if (!cep) return "";
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length === 8) {
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }
  return cep;
}

export function formatEstado(estado: string | undefined): string {
  if (!estado) return "";
  return estado.toUpperCase();
}

export function formatPontoEntregaDisplay(pontoEntrega: PontoEntrega): string {
  if (pontoEntrega.bairro) {
    return `${pontoEntrega.nome} - ${pontoEntrega.bairro}`;
  }
  return pontoEntrega.nome;
}

export function formatListError(error: Error): string {
  if (error.message.includes("Unauthorized")) {
    return "Sessão expirada. Faça login novamente.";
  }
  if (error.message.includes("Admin required")) {
    return "Você não tem permissão para visualizar pontos de entrega.";
  }
  if (error.message.includes("Network")) {
    return "Erro de conexão. Verifique sua internet.";
  }
  return "Erro ao carregar pontos de entrega.";
}

export function formatCreateError(error: Error): string {
  if (error.message.includes("Unauthorized")) {
    return "Sessão expirada. Faça login novamente.";
  }
  if (error.message.includes("Admin required")) {
    return "Você não tem permissão para criar pontos de entrega.";
  }
  return "Erro ao criar ponto de entrega.";
}

export function formatUpdateError(error: Error): string {
  if (error.message.includes("Unauthorized")) {
    return "Sessão expirada. Faça login novamente.";
  }
  if (error.message.includes("não encontrado")) {
    return "Ponto de entrega não encontrado.";
  }
  return "Erro ao atualizar ponto de entrega.";
}

export function formatDeleteError(error: Error): string {
  if (error.message.includes("Unauthorized")) {
    return "Sessão expirada. Faça login novamente.";
  }
  if (error.message.includes("não encontrado")) {
    return "Ponto de entrega não encontrado.";
  }
  return "Erro ao excluir ponto de entrega.";
}

export function getSuccessMessage(action: string): string {
  const messages: Record<string, string> = {
    criar: "Ponto de entrega criado com sucesso!",
    atualizar: "Ponto de entrega atualizado com sucesso!",
    deletar: "Ponto de entrega excluído com sucesso!",
  };
  return messages[action] || "Operação realizada com sucesso!";
}

export function getLoadingMessage(): string {
  return "Carregando pontos de entrega...";
}

export function getEmptyMessage(): string {
  return "Nenhum ponto de entrega cadastrado.";
}

export function getCountMessage(count: number): string {
  if (count === 0) return "Nenhum ponto de entrega";
  if (count === 1) return "1 ponto de entrega";
  return `${count} pontos de entrega`;
}
