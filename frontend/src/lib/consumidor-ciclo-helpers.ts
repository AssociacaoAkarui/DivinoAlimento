export interface CicloConsumidor {
  id: string;
  nome: string;
  ofertaInicio: string;
  ofertaFim: string;
  status: string;
  pontoEntrega?: {
    nome: string;
  };
}

export function formatarDataBR(dataStr: string): string {
  if (!dataStr) return "";
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function filtrarCiclosAtivos(
  ciclos: CicloConsumidor[],
): CicloConsumidor[] {
  return ciclos.filter((ciclo) => ciclo.status === "oferta");
}

export function ordenarCiclosPorData(
  ciclos: CicloConsumidor[],
  ordem: "asc" | "desc" = "desc",
): CicloConsumidor[] {
  return [...ciclos].sort((a, b) => {
    const dateA = new Date(a.ofertaInicio).getTime();
    const dateB = new Date(b.ofertaInicio).getTime();
    return ordem === "desc" ? dateB - dateA : dateA - dateB;
  });
}

export function obterCiclosDisponiveisParaConsumidor(
  ciclos: CicloConsumidor[],
): CicloConsumidor[] {
  const ativos = filtrarCiclosAtivos(ciclos);
  return ordenarCiclosPorData(ativos, "desc");
}

export function formatarPeriodoOfertas(
  inicio: string,
  fim: string,
): string {
  return `${formatarDataBR(inicio)} – ${formatarDataBR(fim)}`;
}

export function validarCicloDisponivel(ciclo: CicloConsumidor): {
  disponivel: boolean;
  motivo?: string;
} {
  if (!ciclo.status) {
    return { disponivel: false, motivo: "Ciclo sem status definido" };
  }

  if (ciclo.status !== "oferta") {
    return { disponivel: false, motivo: "Ciclo não está em período de ofertas" };
  }

  const hoje = new Date();
  const inicio = new Date(ciclo.ofertaInicio);
  const fim = new Date(ciclo.ofertaFim);

  if (hoje < inicio) {
    return {
      disponivel: false,
      motivo: "Período de ofertas ainda não iniciou",
    };
  }

  if (hoje > fim) {
    return { disponivel: false, motivo: "Período de ofertas já encerrou" };
  }

  return { disponivel: true };
}
