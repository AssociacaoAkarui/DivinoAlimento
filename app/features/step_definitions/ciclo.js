const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('chai');

const { sequelize, Cesta, PontoEntrega } = require('../../models');
const Factories = require('./support/factories')
const { CicloService } = require('../../src/services/services');

let novasCestas = [];
let createdCestas = [];
let novosPontosEntrega = [];
let createdPontosEntrega = [];
let cicloService;
let ciclo;


Given('que eu quero criar uma nova Cesta', function() {
});

When('eu crio {int} Cesta', async function(numeroDeCestas) {
  novasCestas = [];

  for (let i = 0; i < numeroDeCestas; i++) {
      novasCestas.push(Factories.CestaFactory.create());
  }

  createdCestas = await Promise.all(novasCestas.map(async (novaCesta) => {
      return await Cesta.create(novaCesta);
  }));
});

Then('a Cesta deve ser criada corretamente', function() {
  expect(createdCestas[0]).to.be.an('object');
  expect(createdCestas[0].nome).to.equal(novasCestas[0].nome);
  expect(createdCestas[0].valormaximo).to.equal(novasCestas[0].valormaximo);
  expect(createdCestas[0].status).to.equal(novasCestas[0].status);
});

Given('que eu quero criar um novo Ponto de Entrega', function() {
});

When('eu crio {int} Ponto de Entrega', async function(numeroDePontoEntrega) {
  novosPontosEntrega = [];

  for (let i = 0; i < numeroDePontoEntrega; i++) {
      novosPontosEntrega.push(Factories.PontoEntregaFactory.create());
  }

  createdPontosEntrega = await Promise.all(novosPontosEntrega.map(async (novoPontoEntrega) => {
      return await PontoEntrega.create(novoPontoEntrega);
  }));
});

Then('o Ponto de Entrega deve ser criado corretamente', function() {
  expect(createdPontosEntrega[0]).to.be.an('object');
  expect(createdPontosEntrega[0].nome).to.equal(novosPontosEntrega[0].nome);
  expect(createdPontosEntrega[0].endereco).to.equal(novosPontosEntrega[0].endereco);
  expect(createdPontosEntrega[0].status).to.equal(novosPontosEntrega[0].status);
});

Given('que eu quero criar um novo Ciclo', async function () {
});

When('o usuário cria um novo ciclo', async function () {
  cicloService = new CicloService();
  ciclo = await cicloService.criarCiclo();
});

Then('o ciclo deve ser criado com os pontos de entrega e cestas ativas', function () {
  expect(ciclo.pontosEntrega).to.have.lengthOf(createdPontosEntrega.length);
  expect(ciclo.tiposCesta).to.have.lengthOf(createdCestas.length);
});
