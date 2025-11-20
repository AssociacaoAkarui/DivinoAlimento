import { Ciclo } from "../hooks/graphql";

// Status mapping
export const statusLabels: Record<string, string> = {
  oferta: "Oferta",
  composicao: "Composicao",
  atribuicao: "Atribuicao",
  finalizado: "Finalizado",
};

export const statusColors: Record<string, string> = {
  oferta: "bg-blue-100 text-blue-800",
  composicao: "bg-yellow-100 text-yellow-800",
  atribuicao: "bg-purple-100 text-purple-800",
  finalizado: "bg-green-100 text-green-800",
};

// Dias da semana
export const diasSemana: Record<number, string> = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terca-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sabado",
};

// Format functions
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(timeString: string | undefined | null): string {
  if (!timeString) return "-";
  return timeString.substring(0, 5);
}

export function formatDiaSemana(dia: number): string {
  return diasSemana[dia] || `Dia ${dia}`;
}

export function formatStatus(status: string): string {
  return statusLabels[status] || status;
}

export function getStatusColor(status: string): string {
  return statusColors[status] || "bg-gray-100 text-gray-800";
}

// Validation functions
export function isValidCicloNome(nome: string): boolean {
  return nome.trim().length >= 3;
}

export function isValidDateRange(inicio: string, fim: string): boolean {
  if (!inicio || !fim) return false;
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);
  return dataFim >= dataInicio;
}

export function isValidEntrega(entrega: {
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
}): boolean {
  if (entrega.diaSemana < 0 || entrega.diaSemana > 6) return false;
  if (!entrega.horaInicio || !entrega.horaFim) return false;
  return entrega.horaFim >= entrega.horaInicio;
}

// Filter functions
export function filterCiclosByStatus(ciclos: Ciclo[], status: string): Ciclo[] {
  if (!status || status === "todos") return ciclos;
  return ciclos.filter((ciclo) => ciclo.status === status);
}

export function filterCiclosByNome(
  ciclos: Ciclo[],
  searchTerm: string,
): Ciclo[] {
  if (!searchTerm) return ciclos;
  const term = searchTerm.toLowerCase();
  return ciclos.filter((ciclo) => ciclo.nome.toLowerCase().includes(term));
}

export function filterCiclosByPontoEntrega(
  ciclos: Ciclo[],
  pontoEntregaId: string,
): Ciclo[] {
  if (!pontoEntregaId) return ciclos;
  return ciclos.filter((ciclo) => ciclo.pontoEntregaId === pontoEntregaId);
}

// Sort functions
export function sortCiclosByDate(ciclos: Ciclo[], ascending = false): Ciclo[] {
  return [...ciclos].sort((a, b) => {
    const dateA = new Date(a.ofertaInicio).getTime();
    const dateB = new Date(b.ofertaInicio).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

export function sortCiclosByNome(ciclos: Ciclo[], ascending = true): Ciclo[] {
  return [...ciclos].sort((a, b) => {
    const comparison = a.nome.localeCompare(b.nome);
    return ascending ? comparison : -comparison;
  });
}

// Utility functions
export function getCicloStatusOptions(): { value: string; label: string }[] {
  return Object.entries(statusLabels).map(([value, label]) => ({
    value,
    label,
  }));
}

export function getDiasSemanaOptions(): { value: number; label: string }[] {
  return Object.entries(diasSemana).map(([value, label]) => ({
    value: parseInt(value),
    label,
  }));
}

export function isCicloAtivo(ciclo: Ciclo): boolean {
  return ciclo.status !== "finalizado";
}

export function isCicloEmOferta(ciclo: Ciclo): boolean {
  const agora = new Date();
  const inicio = new Date(ciclo.ofertaInicio);
  const fim = new Date(ciclo.ofertaFim);
  return agora >= inicio && agora <= fim && ciclo.status === "oferta";
}

export function getCicloPeriodoLabel(ciclo: Ciclo): string {
  const inicio = formatDate(ciclo.ofertaInicio);
  const fim = formatDate(ciclo.ofertaFim);
  return `${inicio} - ${fim}`;
}

export function formatEntregaResumo(
  entregas: { diaSemana: number; horaInicio: string; horaFim: string }[],
): string {
  if (!entregas || entregas.length === 0) return "Sem entregas";

  return entregas
    .map(
      (e) =>
        `${formatDiaSemana(e.diaSemana)} ${formatTime(e.horaInicio)}-${formatTime(e.horaFim)}`,
    )
    .join(", ");
}

// Date input helpers
export function toDateInputValue(
  dateString: string | undefined | null,
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

export function toDateTimeInputValue(
  dateString: string | undefined | null,
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

export function fromDateInputValue(dateInput: string): string {
  if (!dateInput) return "";
  return new Date(dateInput).toISOString();
}
