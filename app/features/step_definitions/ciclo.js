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
  // Initialize cicloData object to store all cycle configuration
  cicloData = {};
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
  // Store basket quantities - assumes first basket created
  if (createdCestas.length > 0) {
    cicloData.cestaId1 = createdCestas[0].id;
    cicloData.quantidadeCestas1 = parseInt(quantidade);
  }
});

When("o usuário cria um novo ciclo", async function () {
  cicloService = new CicloService();

  // Add point of delivery ID if available
  if (createdPontosEntrega.length > 0) {
    cicloData.pontoEntregaId = createdPontosEntrega[0].id;
  }

  // Add cycle name
  cicloData.nome = "Ciclo de Teste";

  ciclo = await cicloService.criarCiclo(cicloData);
});

Then(
  "o ciclo deve ser criado com os pontos de entrega e cestas ativas",
  function () {
    expect(ciclo.pontosEntrega).to.have.lengthOf(createdPontosEntrega.length);
    expect(ciclo.tiposCesta).to.have.lengthOf(createdCestas.length);
  },
);
