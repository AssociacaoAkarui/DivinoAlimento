const {
  Ciclo,
  PontoEntrega,
  Cesta,
  CicloEntregas,
  CicloCestas,
} = require("../../models");

const CicloModel = require("../model/Ciclo");

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

  async atualizarCiclo(cicloIdSelecionado, cicloUpdateData) {
    const cicloId = cicloIdSelecionado;

    const dadosCiclo = await CicloModel.getCicloIdMin(cicloId);
    const ciclo = dadosCiclo.ciclo[0];

    console.log(
      "---------------------------------------------------------------------------------------------------------------entrou no Controller update",
    );

    //const data = await Ciclo.get()
    //const ciclos = data.ciclos
    //const ciclo = ciclos.find(ciclo => Number(ciclo.id) === Number(cicloId))

    if (!ciclo) {
      return res.send("Ciclo não existe!");
    }

    //inicio - cria vetor de atualização das datas de entrega
    var countEntregas = 1;

    entregaFornecedorInicio = req.body.entregaFornecedorInicio1;
    entregaFornecedorFim = req.body.entregaFornecedorFim1;

    var cicloEntregas = [];

    while (entregaFornecedorInicio) {
      cicloEntregas.push({
        entregaFornecedorInicio: entregaFornecedorInicio,
        entregaFornecedorFim: entregaFornecedorFim,
      });

      countEntregas += 1;

      newEntregaFornecedorInicio =
        "entregaFornecedorInicio" + countEntregas.toString();
      newEntregaFornecedorFim =
        "entregaFornecedorFim" + countEntregas.toString();

      entregaFornecedorInicio = req.body[newEntregaFornecedorInicio];
      entregaFornecedorFim = req.body[newEntregaFornecedorFim];
    }
    //fim - cria vetor de atualização das datas de entrega

    //inicio - cria vetor de atualização das cestas e quantidades
    var countCestas = 1;

    cestaId = req.body.cestaId1;
    quantidadeCestas = req.body.quantidadeCestas1;

    var cicloCestas = [];

    while (quantidadeCestas) {
      if (quantidadeCestas >= 0) {
        cicloCestas.push({
          cestaId: cestaId,
          quantidadeCestas: quantidadeCestas,
        });
      }

      countCestas += 1;

      newCestaId = "cestaId" + countCestas.toString();
      newQuantidadeCestas = "quantidadeCestas" + countCestas.toString();

      cestaId = req.body[newCestaId];
      quantidadeCestas = req.body[newQuantidadeCestas];
    }
    //fim - cria vetor de atualização das cestas e quantidade

    const updatedCiclo = {
      id: cicloId,
      nome: req.body.nome,
      pontoEntregaId: req.body.pontoEntregaId,
      ofertaInicio: req.body.ofertaInicio,
      ofertaFim: req.body.ofertaFim,
      itensAdicionaisInicio: req.body.itensAdicionaisInicio,
      itensAdicionaisFim: req.body.itensAdicionaisFim,
      retiradaConsumidorInicio: req.body.retiradaConsumidorInicio,
      retiradaConsumidorFim: req.body.retiradaConsumidorFim,
      observacao: req.body.observacao,
      cicloEntregas: cicloEntregas,
      cicloCestas: cicloCestas,
      //cicloProdutos: cicloProdutos
    };

    await Ciclo.update(updatedCiclo);

    res.redirect("/ciclo/" + cicloId);
  }

}

module.exports = { CicloService };
