import type { LucideIcon } from "lucide-react";

export interface AcaoLoja {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  enabled: boolean;
}

export interface SecaoAcoes {
  titulo: string;
  acoes: AcaoLoja[];
}

export function filtrarAcoesHabilitadas(acoes: AcaoLoja[]): AcaoLoja[] {
  return acoes.filter((acao) => acao.enabled);
}

export function obterAcoesPorSecao(
  acoesLoja: AcaoLoja[],
  acoesAdministracao: AcaoLoja[],
): SecaoAcoes[] {
  return [
    {
      titulo: "Loja",
      acoes: filtrarAcoesHabilitadas(acoesLoja),
    },
    {
      titulo: "Administração",
      acoes: filtrarAcoesHabilitadas(acoesAdministracao),
    },
  ];
}

export function validarAcessoAcao(
  acao: AcaoLoja,
  userRole: string,
): { permitido: boolean; motivo?: string } {
  if (!acao.enabled) {
    return { permitido: false, motivo: "Ação desabilitada" };
  }

  if (!userRole) {
    return { permitido: false, motivo: "Usuário sem perfil definido" };
  }

  const rotasRestritasPorRole: Record<string, string[]> = {
    fornecedor: [
      "/fornecedor/selecionar-ciclo",
      "/fornecedor/selecionar-ciclo-entregas",
    ],
    admin: ["/admin/"],
    consumidor: ["/pedidoConsumidores/"],
  };

  const rotasPermitidas = rotasRestritasPorRole[userRole] || [];

  const temAcesso = rotasPermitidas.some((rotaPermitida) =>
    acao.route.startsWith(rotaPermitida),
  );

  if (!temAcesso && !acao.route.startsWith("/usuario/")) {
    return {
      permitido: false,
      motivo: `Rota não permitida para ${userRole}`,
    };
  }

  return { permitido: true };
}

export function contarAcoesDisponiveis(acoes: AcaoLoja[]): number {
  return filtrarAcoesHabilitadas(acoes).length;
}

export function todasAsAcoesDesabilitadas(acoes: AcaoLoja[]): boolean {
  return acoes.every((acao) => !acao.enabled);
}

export function obterPrimeiraAcaoHabilitada(
  acoes: AcaoLoja[],
): AcaoLoja | undefined {
  return acoes.find((acao) => acao.enabled);
}
