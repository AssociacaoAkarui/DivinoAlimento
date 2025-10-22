const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const Factories = require("./support/factories");
const { sequelize, Cesta } = require("../../models");

let novaCesta = {};
let cestaCriada;
let cestaEncontrada;
let cestaParaEditar;

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

Given("que existe uma cesta {string} cadastrada", async function (nomeCesta) {
  const cestaData = Factories.CestaFactory.create();
  cestaData.nome = nomeCesta;
  cestaCriada = await Cesta.create(cestaData);
});

When("eu solicito os detalhes da cesta {string}", async function (nomeCesta) {
  cestaEncontrada = await Cesta.findByPk(cestaCriada.id);
});

Then("eu devo ver os detalhes da cesta {string}", function (nomeCesta) {
  expect(cestaEncontrada).to.be.an("object");
  expect(cestaEncontrada.nome).to.equal(nomeCesta);
});

When("eu edito o nome da cesta para {string}", async function (novoNome) {
  cestaParaEditar = await Cesta.findByPk(cestaCriada.id);
  cestaParaEditar.nome = novoNome;
});

When("salvo as alterações da cesta", async function () {
  await cestaParaEditar.save();
});

Then("o nome da cesta deve ser {string}", async function (nomeEsperado) {
  const cestaAtualizada = await Cesta.findByPk(cestaParaEditar.id);
  expect(cestaAtualizada.nome).to.equal(nomeEsperado);
});

Given(
  "que existe uma cesta com valor máximo {int}",
  async function (valorMaximo) {
    const cestaData = Factories.CestaFactory.create({
      valormaximo: valorMaximo,
    });
    cestaCriada = await Cesta.create(cestaData);
  },
);

When("eu edito o valor máximo da cesta para {int}", async function (novoValor) {
  cestaParaEditar = await Cesta.findByPk(cestaCriada.id);
  cestaParaEditar.valormaximo = novoValor;
});

Then("o valor máximo da cesta deve ser {int}", async function (valorEsperado) {
  const cestaAtualizada = await Cesta.findByPk(cestaParaEditar.id);
  expect(cestaAtualizada.valormaximo).to.equal(valorEsperado);
});

Given("que existe uma cesta com status {string}", async function (status) {
  const cestaData = Factories.CestaFactory.create({ status: status });
  cestaCriada = await Cesta.create(cestaData);
});

When("eu edito o status da cesta para {string}", async function (novoStatus) {
  cestaParaEditar = await Cesta.findByPk(cestaCriada.id);
  cestaParaEditar.status = novoStatus;
});

Then("o status da cesta deve ser {string}", async function (statusEsperado) {
  const cestaAtualizada = await Cesta.findByPk(cestaParaEditar.id);
  expect(cestaAtualizada.status).to.equal(statusEsperado);
});

Given(
  "que não exista nenhum ciclo que seja composto pela cesta {string}",
  async function (nomeCesta) {
    // Nenhuma ação necessária, o banco de dados é limpo antes de cada cenário.
  },
);

When("eu deleto a cesta {string}", async function (nomeCesta) {
  await cestaCriada.destroy();
});

Then(
  "a cesta {string} não deve mais existir no sistema",
  async function (nomeCesta) {
    const cestaDeletada = await Cesta.findByPk(cestaCriada.id);
    expect(cestaDeletada).to.be.null;
  },
);

Given(
  "que existem cestas {string}, {string} e {string} cadastradas",
  async function (cesta1, cesta2, cesta3) {
    let cestaData;

    cestaData = Factories.CestaFactory.create();
    cestaData.nome = cesta1;
    await Cesta.create(cestaData);

    cestaData = Factories.CestaFactory.create();
    cestaData.nome = cesta2;
    await Cesta.create(cestaData);

    cestaData = Factories.CestaFactory.create();
    cestaData.nome = cesta3;
    await Cesta.create(cestaData);
  },
);

Given("todas as cestas estão com status {string}", async function (status) {
  await Cesta.update({ status: status }, { where: {} });
});

When("eu solicito a lista de cestas ativas", async function () {
  cestasAtivas = await Cesta.findAll({ where: { status: "ativo" } });
});

Then(
  "eu devo ver as cestas {string}, {string} e {string}",
  function (cesta1, cesta2, cesta3) {
    const nomesCestas = cestasAtivas.map((cesta) => cesta.nome);
    expect(nomesCestas).to.include.members([cesta1, cesta2, cesta3]);
  },
);
