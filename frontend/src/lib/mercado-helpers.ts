export function filterMercadosBySearch(mercados: any[], searchTerm: string) {
  if (!searchTerm || searchTerm.trim() === "") {
    return mercados;
  }

  const term = searchTerm.toLowerCase();
  return mercados.filter(
    (mercado) =>
      mercado.nome.toLowerCase().includes(term) ||
      mercado.pontosEntrega?.some((ponto: any) =>
        ponto.nome.toLowerCase().includes(term),
      ),
  );
}

export function filterMercadosByStatus(mercados: any[], status: string[]) {
  if (!status || status.length === 0) {
    return mercados;
  }
  return mercados.filter((mercado) => status.includes(mercado.status));
}

export function filterMercadosByTipo(mercados: any[], tipos: string[]) {
  if (!tipos || tipos.length === 0) {
    return mercados;
  }
  return mercados.filter((mercado) => tipos.includes(mercado.tipo));
}

export function filterMercadosByResponsavel(
  mercados: any[],
  responsavelId: number,
) {
  if (!responsavelId) {
    return mercados;
  }
  return mercados.filter((mercado) => mercado.responsavelId === responsavelId);
}

export function sortMercadosByNome(mercados: any[]) {
  return [...mercados].sort((a, b) => a.nome.localeCompare(b.nome));
}

export function countMercadosAtivos(mercados: any[]) {
  return mercados.filter((mercado) => mercado.status === "ativo").length;
}

export function countMercadosByTipo(mercados: any[], tipo: string) {
  return mercados.filter((mercado) => mercado.tipo === tipo).length;
}

export function getMercadosAtivos(mercados: any[]) {
  return mercados.filter((mercado) => mercado.status === "ativo");
}

export function getMercadosInativos(mercados: any[]) {
  return mercados.filter((mercado) => mercado.status === "inativo");
}

export function findMercadoById(mercados: any[], id: number | string) {
  return mercados.find((mercado) => mercado.id === id);
}

export function validateMercadoNome(nome: string) {
  return !!(nome && nome.trim().length > 0);
}

export function validateMercadoTipo(tipo: string) {
  return ["cesta", "lote", "venda_direta"].includes(tipo);
}

export function validateMercadoResponsavel(responsavelId: number) {
  return !!(responsavelId && responsavelId > 0);
}

export function validateValorMaximoCesta(valor: number, tipo: string) {
  if (tipo === "cesta") {
    return !!(valor && valor > 0);
  }
  return true;
}

export function validateTaxaAdministrativa(taxa: number | null) {
  if (taxa === null || taxa === undefined) {
    return true;
  }
  return taxa >= 0 && taxa <= 100;
}

export function validatePontosEntrega(pontosEntrega: any[]) {
  return !!(pontosEntrega && pontosEntrega.length > 0);
}

export function hasPontosEntrega(mercado: any) {
  return !!(mercado.pontosEntrega && mercado.pontosEntrega.length > 0);
}

export function getTotalPontosEntrega(mercados: any[]) {
  return mercados.reduce(
    (total, mercado) => total + (mercado.pontosEntrega?.length || 0),
    0,
  );
}

export function isMercadoTipoCesta(mercado: any) {
  return mercado.tipo === "cesta";
}

export function isMercadoTipoLote(mercado: any) {
  return mercado.tipo === "lote";
}

export function isMercadoTipoVendaDireta(mercado: any) {
  return mercado.tipo === "venda_direta";
}

export function prepareMercadoForBackend(formData: any) {
  const payload: any = {
    nome: formData.nome,
    tipo: formData.tipo,
    responsavelId: formData.responsavelId || formData.administratorId,
    status: formData.status || "ativo",
  };

  if (
    formData.taxaAdministrativa !== null &&
    formData.taxaAdministrativa !== undefined
  ) {
    payload.taxaAdministrativa = parseFloat(formData.taxaAdministrativa);
  }

  if (formData.tipo === "cesta" && formData.valorMaximoCesta) {
    payload.valorMaximoCesta = parseFloat(formData.valorMaximoCesta);
  }

  if (formData.pontosEntrega && formData.pontosEntrega.length > 0) {
    payload.pontosEntrega = formData.pontosEntrega
      .filter(
        (ponto: any) =>
          ponto &&
          (typeof ponto === "string" ? ponto.trim() : ponto.nome?.trim()),
      )
      .map((ponto: any) => {
        if (typeof ponto === "string") {
          return { nome: ponto.trim(), status: "ativo" };
        }
        return {
          nome: ponto.nome || ponto,
          endereco: ponto.endereco || null,
          bairro: ponto.bairro || null,
          cidade: ponto.cidade || null,
          estado: ponto.estado || null,
          cep: ponto.cep || null,
          status: ponto.status || "ativo",
        };
      });
  }

  return payload;
}

export function isFormValid(formData: any) {
  if (!validateMercadoNome(formData.nome)) {
    return false;
  }

  if (!validateMercadoTipo(formData.tipo)) {
    return false;
  }

  if (
    !validateMercadoResponsavel(
      formData.responsavelId || formData.administratorId,
    )
  ) {
    return false;
  }

  if (!validateValorMaximoCesta(formData.valorMaximoCesta, formData.tipo)) {
    return false;
  }

  if (!validateTaxaAdministrativa(formData.taxaAdministrativa)) {
    return false;
  }

  const pontosValidos = formData.deliveryPoints || formData.pontosEntrega || [];
  if (!validatePontosEntrega(pontosValidos)) {
    return false;
  }

  return true;
}
