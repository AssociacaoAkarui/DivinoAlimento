const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

const { sequelize, Cesta, PontoEntrega } = require('../../models');
const Factories = require('./support/factories')
const { CicloService } = require('../../src/services/services');

Given('que eu quero criar uma nova Cesta', function() {
  novaCesta = Factories.CestaFactory.create();
});

When('eu crio a Cesta', async function() {
  createdCesta = await Cesta.create(novaCesta);
});

Then('a Cesta deve ser criada corretamente', function() {
  expect(createdCesta).to.be.an('object');
  expect(createdCesta.nome).to.equal(novaCesta.nome);
  expect(createdCesta.valormaximo).to.equal(novaCesta.valormaximo);
  expect(createdCesta.status).to.equal(novaCesta.status);
});

Given('que eu quero criar um novo Ponto de Entrega', function() {
  novoPontoEntrega = Factories.PontoEntregaFactory.create();
});

When('eu crio o Ponto de Entrega', async function() {
  createdPontoEntrega = await PontoEntrega.create(novoPontoEntrega);
});

Then('o Ponto de Entrega deve ser criado corretamente', function() {
  expect(createdPontoEntrega).to.be.an('object');
  expect(createdPontoEntrega.nome).to.equal(novoPontoEntrega.nome);
  expect(createdPontoEntrega.endereco).to.equal(novoPontoEntrega.endereco);
  expect(createdPontoEntrega.status).to.equal(novoPontoEntrega.status);
});

Given('que o sistema possui pontos de entrega e cestas ativas', async function () {
  novaCesta1 = Factories.CestaFactory.create();
  createdCesta1 = await Cesta.create(novaCesta1);
  novaCesta2 = Factories.CestaFactory.create();
  createdCesta2 = await Cesta.create(novaCesta2);
  novoPontoEntrega = Factories.PontoEntregaFactory.create();
  createdPontoEntrega = await PontoEntrega.create(novoPontoEntrega);
});

When('o usuário cria um novo ciclo', async function () {
  cicloService = new CicloService();
  ciclo = await cicloService.criarCiclo();
});

Then('o ciclo deve ser criado com os pontos de entrega e cestas ativas', function () {
  expect(ciclo.pontosEntrega).to.have.lengthOf(1);
  expect(ciclo.tiposCesta).to.have.lengthOf(2);
});
