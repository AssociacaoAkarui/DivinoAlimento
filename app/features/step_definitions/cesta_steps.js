const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { CestaFactory } = require("./support/factories");
const { CestaService } = require("../../src/services/services");
const ServiceError = require("../../src/utils/ServiceError");

const cestaService = new CestaService();
let novaCesta = {};
let cestaCriada;
let cestaEncontrada;
let cestaParaEditar;
let erroCapturado;
let cestasAtivas;

Given("que eu quero criar uma nova Cesta", function () {
  novaCesta = {};
  erroCapturado = null;
});

When("eu preencho o nome da cesta com {string}", function (nomeCesta) {
  novaCesta.nome = nomeCesta;
});

When("o valor máximo da cesta como {int}", function (valorMaximo) {
  novaCesta.valormaximo = valorMaximo;
});

When("o status da cesta como {string}", function (status) {
  novaCesta.status = status;
});

When("eu salvo a nova cesta", async function () {
  cestaCriada = await cestaService.criarCesta(novaCesta);
});

Then("a cesta deve ser criada com sucesso", function () {
  expect(cestaCriada).to.be.an("object");
  expect(cestaCriada.nome).to.equal(novaCesta.nome);
  expect(cestaCriada.valormaximo).to.equal(novaCesta.valormaximo);
  expect(cestaCriada.status).to.equal(novaCesta.status);
});

Given("que existe uma cesta {string} cadastrada", async function (nomeCesta) {
  const cestaData = CestaFactory.create({ nome: nomeCesta });
  cestaCriada = await cestaService.criarCesta(cestaData);
});

When("eu solicito os detalhes da cesta {string}", async function (nomeCesta) {
  cestaEncontrada = await cestaService.buscarCestaPorId(cestaCriada.id);
});

Then("eu devo ver os detalhes da cesta {string}", function (nomeCesta) {
  expect(cestaEncontrada).to.be.an("object");
  expect(cestaEncontrada.nome).to.equal(nomeCesta);
});

When("eu edito o nome da cesta para {string}", function (novoNome) {
  cestaParaEditar = { ...cestaCriada.toJSON() };
  cestaParaEditar.nome = novoNome;
});

When("salvo as alterações da cesta", async function () {
  await cestaService.atualizarCesta(cestaParaEditar.id, cestaParaEditar);
});

Then("o nome da cesta deve ser {string}", async function (nomeEsperado) {
  const cestaAtualizada = await cestaService.buscarCestaPorId(
    cestaParaEditar.id,
  );
  expect(cestaAtualizada.nome).to.equal(nomeEsperado);
});

Given(
  "que existe uma cesta com valor máximo {int}",
  async function (valorMaximo) {
    const cestaData = CestaFactory.create({
      valormaximo: valorMaximo,
    });
    cestaCriada = await cestaService.criarCesta(cestaData);
  },
);

When("eu edito o valor máximo da cesta para {int}", function (novoValor) {
  cestaParaEditar = { ...cestaCriada.toJSON() };
  cestaParaEditar.valormaximo = novoValor;
});

Then("o valor máximo da cesta deve ser {int}", async function (valorEsperado) {
  const cestaAtualizada = await cestaService.buscarCestaPorId(
    cestaParaEditar.id,
  );
  expect(cestaAtualizada.valormaximo).to.equal(valorEsperado);
});

Given("que existe uma cesta com status {string}", async function (status) {
  const cestaData = CestaFactory.create({ status: status });
  cestaCriada = await cestaService.criarCesta(cestaData);
});

When("eu edito o status da cesta para {string}", function (novoStatus) {
  cestaParaEditar = { ...cestaCriada.toJSON() };
  cestaParaEditar.status = novoStatus;
});

Then("o status da cesta deve ser {string}", async function (statusEsperado) {
  const cestaAtualizada = await cestaService.buscarCestaPorId(
    cestaParaEditar.id,
  );
  expect(cestaAtualizada.status).to.equal(statusEsperado);
});

Given(
  "que não exista nenhum ciclo que seja composto pela cesta {string}",
  function (nomeCesta) {},
);

When("eu deleto a cesta {string}", async function (nomeCesta) {
  await cestaService.deletarCesta(cestaCriada.id);
});

Then(
  "a cesta {string} não deve mais existir no sistema",
  async function (nomeCesta) {
    let cestaDeletada;
    try {
      cestaDeletada = await cestaService.buscarCestaPorId(cestaCriada.id);
    } catch (error) {
      expect(error).to.be.an.instanceOf(ServiceError);
      expect(error.message).to.include("não encontrada");
    }
    expect(cestaDeletada).to.be.undefined;
  },
);

Given(
  "que existem cestas {string}, {string} e {string} cadastradas",
  async function (cesta1, cesta2, cesta3) {
    await cestaService.criarCesta(
      CestaFactory.create({ nome: cesta1, status: "ativo" }),
    );
    await cestaService.criarCesta(
      CestaFactory.create({ nome: cesta2, status: "ativo" }),
    );
    await cestaService.criarCesta(
      CestaFactory.create({ nome: cesta3, status: "inativo" }),
    );
  },
);

Given("todas as cestas estão com status {string}", async function (status) {});

When("eu solicito a lista de cestas ativas", async function () {
  cestasAtivas = await cestaService.listarCestasAtivas();
});

Then(
  "eu devo ver as cestas {string}, {string} e {string}",
  function (cesta1, cesta2, cesta3) {
    const nomesCestas = cestasAtivas.map((cesta) => cesta.nome);
    expect(nomesCestas).to.have.members([cesta1, cesta2]);
    expect(nomesCestas).to.not.include(cesta3);
  },
);

When("eu tento salvar a nova cesta", async function () {
  try {
    cestaCriada = await cestaService.criarCesta(novaCesta);
  } catch (error) {
    erroCapturado = error;
  }
});

Then("eu devo receber um erro de validação", function () {
  expect(erroCapturado).to.be.an.instanceOf(ServiceError);
  expect(erroCapturado.cause).to.have.property(
    "name",
    "SequelizeValidationError",
  );
});
