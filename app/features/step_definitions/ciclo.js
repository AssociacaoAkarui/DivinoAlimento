const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

const { sequelize, Cesta, PontoEntrega } = require('../../models');
const Factories = require('./support/factories')
const CicloService = require('../../src/services/cicloService');

Given('que eu quero criar uma nova Cesta', function() {
  this.novaCesta = Factories.CestaFactory.create();
});

When('eu crio a Cesta', async function() {
  this.createdCesta = await Cesta.create(this.novaCesta);
});

Then('a Cesta deve ser criada corretamente', function() {
  expect(this.createdCesta).to.be.an('object');
  expect(this.createdCesta.nome).to.equal(this.novaCesta.nome);
  expect(this.createdCesta.valormaximo).to.equal(this.novaCesta.valormaximo);
  expect(this.createdCesta.status).to.equal(this.novaCesta.status);
});

Given('que eu quero criar um novo Ponto de Entrega', function() {
  this.novoPontoEntrega = Factories.PontoEntregaFactory.create();
});

When('eu crio o Ponto de Entrega', async function() {
  this.createdPontoEntrega = await PontoEntrega.create(this.novoPontoEntrega);
});

Then('o Ponto de Entrega deve ser criado corretamente', function() {
  expect(this.createdPontoEntrega).to.be.an('object');
  expect(this.createdPontoEntrega.nome).to.equal(this.novoPontoEntrega.nome);
  expect(this.createdPontoEntrega.endereco).to.equal(this.novoPontoEntrega.endereco);
  expect(this.createdPontoEntrega.status).to.equal(this.novoPontoEntrega.status);
});

Given('que o sistema possui pontos de entrega e cestas ativas', async function () {
  this.novaCesta1 = Factories.CestaFactory.create();
  this.createdCesta1 = await Cesta.create(this.novaCesta1);
  this.novaCesta2 = Factories.CestaFactory.create();
  this.createdCesta2 = await Cesta.create(this.novaCesta2);    
  this.novoPontoEntrega = Factories.PontoEntregaFactory.create();
  this.createdPontoEntrega = await PontoEntrega.create(this.novoPontoEntrega);
});

When('o usuário cria um novo ciclo', async function () {
  cicloService = new CicloService();
  ciclo = await cicloService.criarCiclo();
});

Then('o ciclo deve ser criado com os pontos de entrega e cestas ativas', function () {
  expect(ciclo.pontosEntrega).to.have.lengthOf(1);
  expect(ciclo.tiposCesta).to.have.lengthOf(2);
});
