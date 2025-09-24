const {
  Ciclo,
  PontoEntrega,
  Cesta,
  CicloEntregas,
  CicloCestas,
} = require("../../models");

class CicloService {
  async criarCiclo(dados) {
    // Create the main cycle first
    const novoCiclo = await Ciclo.create({
      nome: dados.nome,
      pontoEntregaId: dados.pontoEntregaId,
      ofertaInicio: dados.ofertaInicio,
      ofertaFim: dados.ofertaFim,
      itensAdicionaisInicio: dados.itensAdicionaisInicio,
      itensAdicionaisFim: dados.itensAdicionaisFim,
      retiradaConsumidorInicio: dados.retiradaConsumidorInicio,
      retiradaConsumidorFim: dados.retiradaConsumidorFim,
      observacao: dados.observacao,
      status: "ativo",
    });

    // Create cycle delivery dates if provided
    if (dados.entregaFornecedorInicio1 && dados.entregaFornecedorFim1) {
      let countEntregas = 1;
      let entregaFornecedorInicio = dados.entregaFornecedorInicio1;
      let entregaFornecedorFim = dados.entregaFornecedorFim1;

      while (entregaFornecedorInicio && entregaFornecedorFim) {
        await CicloEntregas.create({
          cicloId: novoCiclo.id,
          entregaFornecedorInicio: entregaFornecedorInicio,
          entregaFornecedorFim: entregaFornecedorFim,
        });

        countEntregas += 1;
        const newEntregaFornecedorInicio =
          "entregaFornecedorInicio" + countEntregas.toString();
        const newEntregaFornecedorFim =
          "entregaFornecedorFim" + countEntregas.toString();

        entregaFornecedorInicio = dados[newEntregaFornecedorInicio];
        entregaFornecedorFim = dados[newEntregaFornecedorFim];
      }
    }

    // Create cycle baskets if provided
    if (dados.cestaId1 && dados.quantidadeCestas1) {
      let countCestas = 1;
      let cestaId = dados.cestaId1;
      let quantidadeCestas = dados.quantidadeCestas1;

      while (cestaId && quantidadeCestas > 0) {
        await CicloCestas.create({
          cicloId: novoCiclo.id,
          cestaId: cestaId,
          quantidadeCestas: quantidadeCestas,
        });

        countCestas += 1;
        const newCestaId = "cestaId" + countCestas.toString();
        const newQuantidadeCestas = "quantidadeCestas" + countCestas.toString();

        cestaId = dados[newCestaId];
        quantidadeCestas = dados[newQuantidadeCestas];
      }
    }

    // Get active delivery points and baskets to return
    const pontosEntrega = await PontoEntrega.findAll({
      where: { status: "ativo" },
    });

    const tiposCesta = await Cesta.findAll({
      where: { status: "ativo" },
    });

    // Return an object that matches the expected structure in tests
    return {
      id: novoCiclo.id,
      nome: novoCiclo.nome,
      pontosEntrega: pontosEntrega,
      tiposCesta: tiposCesta,
      ...novoCiclo.toJSON(),
    };
  }
}

module.exports = { CicloService };
