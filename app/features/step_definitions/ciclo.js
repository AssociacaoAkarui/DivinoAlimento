const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");

const { sequelize, Cesta, PontoEntrega } = require("../../models");
const Factories = require("./support/factories");
const { CicloService } = require("../../src/services/services");

let novasCestas = [];
let createdCestas = [];
let novosPontosEntrega = [];
let createdPontosEntrega = [];
let cicloService;
let ciclo;
let cicloData = {};
let cicloUpdateData = {};

Given("que eu quero criar uma nova Cesta", function () {});

When("eu crio {int} Cesta", async function (numeroDeCestas) {
  novasCestas = [];

  for (let i = 0; i < numeroDeCestas; i++) {
    novasCestas.push(Factories.CestaFactory.create());
  }

  createdCestas = await Promise.all(
    novasCestas.map(async (novaCesta) => {
      return await Cesta.create(novaCesta);
    }),
  );
});

Then("a Cesta deve ser criada corretamente", function () {
  expect(createdCestas[0]).to.be.an("object");
  expect(createdCestas[0].nome).to.equal(novasCestas[0].nome);
  expect(createdCestas[0].valormaximo).to.equal(novasCestas[0].valormaximo);
  expect(createdCestas[0].status).to.equal(novasCestas[0].status);
});

Given("que eu quero criar um novo Ponto de Entrega", function () {});

When("eu crio {int} Ponto de Entrega", async function (numeroDePontoEntrega) {
  novosPontosEntrega = [];

  for (let i = 0; i < numeroDePontoEntrega; i++) {
    novosPontosEntrega.push(Factories.PontoEntregaFactory.create());
  }

  createdPontosEntrega = await Promise.all(
    novosPontosEntrega.map(async (novoPontoEntrega) => {
      return await PontoEntrega.create(novoPontoEntrega);
    }),
  );
});

Then("o Ponto de Entrega deve ser criado corretamente", function () {
  expect(createdPontosEntrega[0]).to.be.an("object");
  expect(createdPontosEntrega[0].nome).to.equal(novosPontosEntrega[0].nome);
  expect(createdPontosEntrega[0].endereco).to.equal(
    novosPontosEntrega[0].endereco,
  );
  expect(createdPontosEntrega[0].status).to.equal(novosPontosEntrega[0].status);
});

Given("que eu quero criar um novo Ciclo", async function () {
  cicloData = {};
});

When("eu nome {string}", function (nome) {
  cicloData.nome = nome;
});

When("eu oferta inicio {string}", function (dataInicio) {
  cicloData.ofertaInicio = dataInicio;
});

When("eu oferta fim {string}", function (dataFim) {
  cicloData.ofertaFim = dataFim;
});

When("eu itens adicionais inicio {string}", function (dataInicio) {
  cicloData.itensAdicionaisInicio = dataInicio;
});

When("eu itens adicionais fim {string}", function (dataFim) {
  cicloData.itensAdicionaisFim = dataFim;
});

When("eu retirada consumidor inicio {string}", function (dataInicio) {
  cicloData.retiradaConsumidorInicio = dataInicio;
});

When("eu retirada consumidor fim {string}", function (dataFim) {
  cicloData.retiradaConsumidorFim = dataFim;
});

When("observacao {string}", function (observacao) {
  cicloData.observacao = observacao;
});

When("entrega fornecedor inicio {string}", function (dataInicio) {
  cicloData.entregaFornecedorInicio1 = dataInicio;
});

When("entrega fornecedor fim {string}", function (dataFim) {
  cicloData.entregaFornecedorFim1 = dataFim;
});

When("quantidade cestas {string}", function (quantidade) {
  if (createdCestas.length > 0) {
    cicloData.cestaId1 = createdCestas[0].id;
    cicloData.quantidadeCestas1 = parseInt(quantidade);
  }
});

When("o usuário cria um novo ciclo", async function () {
  cicloService = new CicloService();
  if (createdPontosEntrega.length > 0) {
    cicloData.pontoEntregaId = createdPontosEntrega[0].id;
  }

  ciclo = await cicloService.criarCiclo(cicloData);
});

Then(
  "o ciclo deve ser criado com os pontos de entrega e cestas ativas",
  function () {
    expect(ciclo.pontosEntrega).to.have.lengthOf(createdPontosEntrega.length);
    expect(ciclo.tiposCesta).to.have.lengthOf(createdCestas.length);
  },
);

Given("que eu quero criar e atualizar um ciclo", async function () {
  cicloService = new CicloService();
  novoCiclo = Factories.CicloFactory.create();
  ciclo2 = await cicloService.criarCiclo(novoCiclo);
  cicloUpdateData = {};
});

When("eu altero o campo nome com o nome {string}", function (nome) {
  cicloUpdateData.nome = nome;
});

When("eu altero a observacao para {string}", function (observacao) {
  cicloUpdateData.observacao = observacao;
});

When("eu altero a oferta inicio para {string}", function (dataInicio) {
  cicloUpdateData.ofertaInicio = dataInicio;
});

When("eu altero a oferta fim para {string}", function (dataFim) {
  cicloUpdateData.ofertaFim = dataFim;
});

When("o usuário atualiza o ciclo", async function () {
  cicloUpdate = await cicloService.atualizarCiclo(ciclo2.id, cicloUpdateData);
});

Then("o ciclo deve estar atualizado com os novos dados", async function () {
  const cicloAtualizado = await cicloService.buscarCicloPorId(ciclo2.id);

  expect(cicloAtualizado.nome).to.equal(cicloUpdateData.nome);
  expect(cicloAtualizado.observacao).to.equal(cicloUpdateData.observacao);

  if (cicloUpdateData.ofertaInicio) {
    const dataEsperada = new Date(cicloUpdateData.ofertaInicio)
      .toISOString()
      .split("T")[0];
    const dataAtual = new Date(cicloAtualizado.ofertaInicio)
      .toISOString()
      .split("T")[0];
    expect(dataAtual).to.equal(dataEsperada);
  }

  if (cicloUpdateData.ofertaFim) {
    const dataEsperada = new Date(cicloUpdateData.ofertaFim)
      .toISOString()
      .split("T")[0];
    const dataAtual = new Date(cicloAtualizado.ofertaFim)
      .toISOString()
      .split("T")[0];
    expect(dataAtual).to.equal(dataEsperada);
  }
});

let pontosEntregaUpdate = [];
let cestasUpdate = [];
let cicloComAssociacoes;

Given(
  "que eu quero criar e atualizar um ciclo com associações",
  async function () {
    cicloService = new CicloService();
    novoCiclo = Factories.CicloFactory.create();
    cicloComAssociacoes = await cicloService.criarCiclo(novoCiclo);
    cicloUpdateData = {};
  },
);

When(
  "eu crio {int} Ponto de Entrega para atualização",
  async function (numero) {
    pontosEntregaUpdate = [];
    for (let i = 0; i < numero; i++) {
      const novoPonto = Factories.PontoEntregaFactory.create();
      const pontoCreated = await PontoEntrega.create(novoPonto);
      pontosEntregaUpdate.push(pontoCreated);
    }
  },
);

When("eu crio {int} Cesta para atualização", async function (numero) {
  cestasUpdate = [];
  for (let i = 0; i < numero; i++) {
    const novaCesta = Factories.CestaFactory.create();
    const cestaCreated = await Cesta.create(novaCesta);
    cestasUpdate.push(cestaCreated);
  }
});

When("eu altero o ponto de entrega", function () {
  if (pontosEntregaUpdate.length > 0) {
    cicloUpdateData.pontoEntregaId = pontosEntregaUpdate[0].id;
  }
});

When(
  "eu adiciono nova entrega fornecedor inicio {string} e fim {string}",
  function (inicio, fim) {
    cicloUpdateData.entregaFornecedorInicio1 = inicio;
    cicloUpdateData.entregaFornecedorFim1 = fim;
  },
);

When(
  "eu adiciono segunda entrega fornecedor inicio {string} e fim {string}",
  function (inicio, fim) {
    cicloUpdateData.entregaFornecedorInicio2 = inicio;
    cicloUpdateData.entregaFornecedorFim2 = fim;
  },
);

When("eu altero primeira cesta com quantidade {string}", function (quantidade) {
  if (cestasUpdate.length > 0) {
    cicloUpdateData.cestaId1 = cestasUpdate[0].id;
    cicloUpdateData.quantidadeCestas1 = parseInt(quantidade);
  }
});

When(
  "eu adiciono segunda cesta com quantidade {string}",
  function (quantidade) {
    if (cestasUpdate.length > 1) {
      cicloUpdateData.cestaId2 = cestasUpdate[1].id;
      cicloUpdateData.quantidadeCestas2 = parseInt(quantidade);
    }
  },
);

When("o usuário atualiza o ciclo com associações", async function () {
  cicloUpdate = await cicloService.atualizarCiclo(
    cicloComAssociacoes.id,
    cicloUpdateData,
  );
});

Then(
  "o ciclo deve estar atualizado com as novas entregas e cestas",
  async function () {
    const cicloAtualizado = await cicloService.buscarCicloPorId(
      cicloComAssociacoes.id,
    );

    if (cicloUpdateData.pontoEntregaId) {
      expect(cicloAtualizado.pontoEntregaId).to.equal(
        cicloUpdateData.pontoEntregaId,
      );
    }

    if (cicloUpdateData.entregaFornecedorInicio1) {
      expect(cicloAtualizado.cicloEntregas).to.have.length.at.least(1);
      const primeiraEntrega = cicloAtualizado.cicloEntregas[0];

      const dataInicioEsperada = new Date(
        cicloUpdateData.entregaFornecedorInicio1,
      )
        .toISOString()
        .split("T")[0];
      const dataInicioAtual = new Date(primeiraEntrega.entregaFornecedorInicio)
        .toISOString()
        .split("T")[0];
      expect(dataInicioAtual).to.equal(dataInicioEsperada);

      const dataFimEsperada = new Date(cicloUpdateData.entregaFornecedorFim1)
        .toISOString()
        .split("T")[0];
      const dataFimAtual = new Date(primeiraEntrega.entregaFornecedorFim)
        .toISOString()
        .split("T")[0];
      expect(dataFimAtual).to.equal(dataFimEsperada);
    }

    if (cicloUpdateData.entregaFornecedorInicio2) {
      expect(cicloAtualizado.cicloEntregas).to.have.length.at.least(2);
      const segundaEntrega = cicloAtualizado.cicloEntregas[1];

      const dataInicioEsperada = new Date(
        cicloUpdateData.entregaFornecedorInicio2,
      )
        .toISOString()
        .split("T")[0];
      const dataInicioAtual = new Date(segundaEntrega.entregaFornecedorInicio)
        .toISOString()
        .split("T")[0];
      expect(dataInicioAtual).to.equal(dataInicioEsperada);

      const dataFimEsperada = new Date(cicloUpdateData.entregaFornecedorFim2)
        .toISOString()
        .split("T")[0];
      const dataFimAtual = new Date(segundaEntrega.entregaFornecedorFim)
        .toISOString()
        .split("T")[0];
      expect(dataFimAtual).to.equal(dataFimEsperada);
    }

    if (cicloUpdateData.cestaId1) {
      expect(cicloAtualizado.CicloCestas).to.have.length.at.least(1);
      const primeiraCesta = cicloAtualizado.CicloCestas.find(
        (cc) => cc.cestaId === cicloUpdateData.cestaId1,
      );
      expect(primeiraCesta).to.exist;
      expect(primeiraCesta.quantidadeCestas).to.equal(
        cicloUpdateData.quantidadeCestas1,
      );
    }

    if (cicloUpdateData.cestaId2) {
      expect(cicloAtualizado.CicloCestas).to.have.length.at.least(2);
      const segundaCesta = cicloAtualizado.CicloCestas.find(
        (cc) => cc.cestaId === cicloUpdateData.cestaId2,
      );
      expect(segundaCesta).to.exist;
      expect(segundaCesta.quantidadeCestas).to.equal(
        cicloUpdateData.quantidadeCestas2,
      );
    }
  },
);

Given("que eu quero criar e deletar um ciclo", async function () {
  cicloService = new CicloService();
  const novoCiclo = Factories.CicloFactory.create();
  ciclo = await cicloService.criarCiclo(novoCiclo);
});

When("o usuário deleta o ciclo", async function () {
  await cicloService.deletarCiclo(ciclo.id);
});

Then("o ciclo não deve mais existir no sistema", async function () {
  const cicloDeletado = await cicloService.buscarCicloPorId(ciclo.id);
  expect(cicloDeletado).to.be.null;
});
