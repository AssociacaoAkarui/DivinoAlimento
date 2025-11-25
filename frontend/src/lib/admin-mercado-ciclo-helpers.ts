export interface CicloMercado {
  id: string;
  ciclo_id: string;
  mercado_id: string;
  nome_mercado: string;
  tipo_venda: "cesta" | "lote" | "venda_direta";
  ordem: number;
  status_composicao: "pendente" | "em_andamento" | "concluida";
}

export interface CicloAdmin {
  id: string;
  nome: string;
  inicio_ofertas: string;
  fim_ofertas: string;
  status: "ativo" | "inativo";
  admin_responsavel_id: string;
  admin_responsavel_nome: string;
  mercados: CicloMercado[];
}

export function filtrarCiclosPorAdmin(
  ciclos: CicloAdmin[],
  adminNome: string,
): CicloAdmin[] {
  return ciclos.filter(
    (ciclo) => ciclo.admin_responsavel_nome === adminNome,
  );
}

export function obterMercadoAtual(
  ciclo: CicloAdmin,
  mercadoSelecionadoId?: string,
): CicloMercado | undefined {
  if (mercadoSelecionadoId) {
    const mercadoSelecionado = ciclo.mercados.find(
      (m) => m.id === mercadoSelecionadoId,
    );
    if (mercadoSelecionado) return mercadoSelecionado;
  }

  const emAndamento = ciclo.mercados.find(
    (m) => m.status_composicao === "em_andamento",
  );
  if (emAndamento) return emAndamento;

  return ciclo.mercados.find((m) => m.status_composicao === "pendente");
}

export function isMercadoBloqueado(
  ciclo: CicloAdmin,
  mercado: CicloMercado,
): boolean {
  if (ciclo.status === "inativo") return true;

  if (mercado.ordem === 1) return false;

  const mercadoAnterior = ciclo.mercados.find(
    (m) => m.ordem === mercado.ordem - 1,
  );

  return mercadoAnterior
    ? mercadoAnterior.status_composicao !== "concluida"
    : true;
}

export interface ValidacaoLiberacaoVD {
  can: boolean;
  reason?: string;
}

export function validarLiberacaoVendaDireta(
  ciclo: CicloAdmin,
  mercado: CicloMercado,
): ValidacaoLiberacaoVD {
  if (mercado.tipo_venda !== "venda_direta") {
    return { can: false, reason: "Não é venda direta" };
  }

  if (ciclo.status !== "ativo") {
    return { can: false, reason: "Ciclo inativo" };
  }

  const hasItems = mercado.status_composicao !== "pendente";
  if (!hasItems) {
    return {
      can: false,
      reason: "Adicione pelo menos 1 item na composição para liberar",
    };
  }

  return { can: true };
}

export function ordenarCiclosPorData(
  ciclos: CicloAdmin[],
  ordem: "asc" | "desc" = "desc",
): CicloAdmin[] {
  return [...ciclos].sort((a, b) => {
    const dateA = new Date(a.inicio_ofertas).getTime();
    const dateB = new Date(b.inicio_ofertas).getTime();
    return ordem === "desc" ? dateB - dateA : dateA - dateB;
  });
}

export function obterProximoMercadoPendente(
  ciclo: CicloAdmin,
): CicloMercado | undefined {
  return ciclo.mercados
    .filter((m) => !isMercadoBloqueado(ciclo, m))
    .find(
      (m) =>
        m.status_composicao === "pendente" ||
        m.status_composicao === "em_andamento",
    );
}

export function contarMercadosPorStatus(ciclo: CicloAdmin): {
  pendente: number;
  em_andamento: number;
  concluida: number;
} {
  return ciclo.mercados.reduce(
    (acc, mercado) => {
      acc[mercado.status_composicao]++;
      return acc;
    },
    { pendente: 0, em_andamento: 0, concluida: 0 },
  );
}

export function todosOsMercadosConcluidos(ciclo: CicloAdmin): boolean {
  return ciclo.mercados.every((m) => m.status_composicao === "concluida");
}
