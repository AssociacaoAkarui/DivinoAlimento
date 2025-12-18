import type { PontoEntrega } from "@/hooks/graphql";

export function filterPontosEntregaBySearch(
  pontosEntrega: PontoEntrega[],
  searchTerm: string,
): PontoEntrega[] {
  if (!searchTerm.trim()) return pontosEntrega;
  const term = searchTerm.toLowerCase();
  return pontosEntrega.filter(
    (ponto) =>
      ponto.nome.toLowerCase().includes(term) ||
      ponto.endereco?.toLowerCase().includes(term) ||
      ponto.bairro?.toLowerCase().includes(term) ||
      ponto.cidade?.toLowerCase().includes(term),
  );
}

export function filterPontosEntregaByStatus(
  pontosEntrega: PontoEntrega[],
  status: string,
): PontoEntrega[] {
  if (!status || status === "todos") return pontosEntrega;
  return pontosEntrega.filter((ponto) => ponto.status === status);
}

export function sortPontosEntregaByNome(
  pontosEntrega: PontoEntrega[],
  ascending: boolean = true,
): PontoEntrega[] {
  return [...pontosEntrega].sort((a, b) => {
    const comparison = a.nome.localeCompare(b.nome);
    return ascending ? comparison : -comparison;
  });
}

export function findPontoEntregaById(
  pontosEntrega: PontoEntrega[],
  id: string,
): PontoEntrega | undefined {
  return pontosEntrega.find((ponto) => ponto.id === id);
}

export function isPontoEntregaAtivo(pontoEntrega: PontoEntrega): boolean {
  return pontoEntrega.status === "ativo";
}

export function isPontoEntregaInativo(pontoEntrega: PontoEntrega): boolean {
  return pontoEntrega.status === "inativo";
}

export function countPontosEntregaAtivos(
  pontosEntrega: PontoEntrega[],
): number {
  return pontosEntrega.filter((ponto) => ponto.status === "ativo").length;
}

export function countPontosEntregaInativos(
  pontosEntrega: PontoEntrega[],
): number {
  return pontosEntrega.filter((ponto) => ponto.status === "inativo").length;
}

export function validatePontoEntregaNome(nome: string): boolean {
  return nome.trim().length >= 3;
}

export function formatEnderecoCompleto(pontoEntrega: PontoEntrega): string {
  const parts: string[] = [];
  if (pontoEntrega.endereco) parts.push(pontoEntrega.endereco);
  if (pontoEntrega.bairro) parts.push(pontoEntrega.bairro);
  if (pontoEntrega.cidade) {
    if (pontoEntrega.estado) {
      parts.push(`${pontoEntrega.cidade} - ${pontoEntrega.estado}`);
    } else {
      parts.push(pontoEntrega.cidade);
    }
  }
  if (pontoEntrega.cep) parts.push(`CEP: ${pontoEntrega.cep}`);
  return parts.join(", ");
}

export function hasEnderecoCompleto(pontoEntrega: PontoEntrega): boolean {
  return !!(
    pontoEntrega.endereco &&
    pontoEntrega.bairro &&
    pontoEntrega.cidade &&
    pontoEntrega.estado &&
    pontoEntrega.cep
  );
}

export function getPontosEntregaPorCidade(
  pontosEntrega: PontoEntrega[],
  cidade: string,
): PontoEntrega[] {
  return pontosEntrega.filter(
    (ponto) => ponto.cidade?.toLowerCase() === cidade.toLowerCase(),
  );
}

export function getCidadesUnicas(pontosEntrega: PontoEntrega[]): string[] {
  const cidades: string[] = [];
  for (const ponto of pontosEntrega) {
    if (ponto.cidade && !cidades.includes(ponto.cidade)) {
      cidades.push(ponto.cidade);
    }
  }
  return cidades.sort();
}

export function getBairrosUnicos(pontosEntrega: PontoEntrega[]): string[] {
  const bairros: string[] = [];
  for (const ponto of pontosEntrega) {
    if (ponto.bairro && !bairros.includes(ponto.bairro)) {
      bairros.push(ponto.bairro);
    }
  }
  return bairros.sort();
}
