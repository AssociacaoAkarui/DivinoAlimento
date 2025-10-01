const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const Factories = require("./support/factories");
const { sequelize, Cesta } = require("../../models");
let novaCesta = {};

Given("que eu quero criar uma nova Cesta", function () {
    novaCesta = {};
});

When("eu preencho o nome da cesta com {string}", async function (nomeCesta) {
  novaCesta.nome = nomeCesta;
});

When("o valor máximo da cesta como {int}", async function (valorMaximo) {
  novaCesta.valorMaximo = valorMaximo;
});

When("o status da cesta como {string}", async function (status) {
  novaCesta.status = status;
});

When("eu salvo a nova cesta", async function () {
    cestaCriada = await Cesta.create(novaCesta);
  
});

Then("a cesta deve ser criada com sucesso", function () {
  expect(cestaCriada).to.be.an("object");
  expect(cestaCriada.nome).to.equal(novaCesta.nome);
  expect(cestaCriada.valormaximo).to.equal(novaCesta.valormaximo);
  expect(cestaCriada.status).to.equal(novaCesta.status);
});