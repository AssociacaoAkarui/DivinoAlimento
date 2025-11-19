const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { CategoriaProdutosService } = require("../../src/services/services");
const { expect } = require("chai");

let categoriaProdutosService;

Before(function () {
  categoriaProdutosService = new CategoriaProdutosService();
  this.categoriaData = {};
  this.currentCategoria = null;
  this.categoriasList = [];
});

Given("que eu quero criar uma nova categoria de produtos", function () {
  this.novaCategoriaData = {};
});

When("eu preencho o nome da categoria com {string}", function (nome) {
  this.novaCategoriaData.nome = nome;
});

When("o status da categoria como {string}", function (status) {
  this.novaCategoriaData.status = status;
});

When("eu salvo a nova categoria", async function () {
  this.currentCategoria = await categoriaProdutosService.criarCategoria(
    this.novaCategoriaData,
  );
});

Then("a categoria {string} deve ser criada com sucesso", function (nome) {
  expect(this.currentCategoria).to.exist;
  expect(this.currentCategoria.nome).to.equal(nome);
  expect(this.currentCategoria.id).to.exist;
});

Given("que existe uma categoria {string} cadastrada", async function (nome) {
  this.currentCategoria = await categoriaProdutosService.criarCategoria({
    nome: nome,
    status: "ativo",
  });
});

When("eu solicito os detalhes da categoria {string}", async function (nome) {
  const categoria = await categoriaProdutosService.buscarPorId(
    this.currentCategoria.id,
  );
  this.categoriaData = categoria;
});

Then("eu devo ver os detalhes da categoria {string}", function (nome) {
  expect(this.categoriaData).to.exist;
  expect(this.categoriaData.nome).to.equal(nome);
});

Given("que existe uma categoria {string}", async function (nome) {
  this.currentCategoria = await categoriaProdutosService.criarCategoria({
    nome: nome,
    status: "ativo",
  });
});

When("eu edito o nome da categoria para {string}", function (novoNome) {
  this.categoriaData.nome = novoNome;
});

When("salvo as alterações da categoria", async function () {
  this.currentCategoria = await categoriaProdutosService.atualizarCategoria(
    this.currentCategoria.id,
    this.categoriaData,
  );
});

Then("o nome da categoria deve ser {string}", function (nomeEsperado) {
  expect(this.currentCategoria.nome).to.equal(nomeEsperado);
});

Given("que existe uma categoria com status {string}", async function (status) {
  this.currentCategoria = await categoriaProdutosService.criarCategoria({
    nome: "Categoria Teste",
    status: status,
  });
});

When("eu edito o status da categoria para {string}", function (novoStatus) {
  this.categoriaData.status = novoStatus;
});

Then("o status da categoria deve ser {string}", function (statusEsperado) {
  expect(this.currentCategoria.status).to.equal(statusEsperado);
});

Given(
  "que não existam produtos associados à categoria {string}",
  function (nome) {
    return true;
  },
);

When("eu deleto a categoria {string}", async function (nome) {
  await categoriaProdutosService.deletarCategoria(this.currentCategoria.id);
});

Then(
  "a categoria {string} não deve mais existir no sistema",
  async function (nome) {
    try {
      await categoriaProdutosService.buscarPorId(this.currentCategoria.id);
      throw new Error("A categoria ainda existe");
    } catch (error) {
      expect(error.message).to.include("Categoria not found");
    }
  },
);

Given(
  "que existem categorias {string}, {string} e {string} cadastradas",
  async function (nome1, nome2, nome3) {
    const cat1 = await categoriaProdutosService.criarCategoria({
      nome: nome1,
      status: "ativo",
    });
    const cat2 = await categoriaProdutosService.criarCategoria({
      nome: nome2,
      status: "ativo",
    });
    const cat3 = await categoriaProdutosService.criarCategoria({
      nome: nome3,
      status: "ativo",
    });
    this.categoriasList = [cat1, cat2, cat3];
  },
);

Given("todas as categorias estão com status {string}", function (status) {
  this.categoriasList.forEach((cat) => {
    expect(cat.status).to.equal(status);
  });
});

When("eu solicito a lista de categorias ativas", async function () {
  const todasCategorias = await categoriaProdutosService.listarCategorias();
  this.categoriasList = todasCategorias.filter((cat) => cat.status === "ativo");
});

Then(
  "eu devo ver as categorias {string}, {string} e {string}",
  function (nome1, nome2, nome3) {
    expect(this.categoriasList).to.have.lengthOf.at.least(3);
    const nomes = this.categoriasList.map((cat) => cat.nome);
    expect(nomes).to.include(nome1);
    expect(nomes).to.include(nome2);
    expect(nomes).to.include(nome3);
  },
);
