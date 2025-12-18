const { expect } = require("chai");
const { Before, Given, When, Then } = require("@cucumber/cucumber");
const {
  ProdutoService,
  CategoriaProdutosService,
} = require("../../src/services/services.js");

let produtoService;
let categoriaProdutosService;

Before(function () {
  produtoService = new ProdutoService();
  categoriaProdutosService = new CategoriaProdutosService();
  this.produtoData = {};
  this.currentProduto = null;
  this.currentCategoria = null;
});

Given("que eu quero criar um novo Produto", function () {
  this.novoProdutoData = {};
});

When("eu preencho o nome com {string}", function (nome) {
  if (!this.novoProdutoData) {
    this.novoProdutoData = {};
  }
  this.novoProdutoData.nome = nome;
});

When("o status como {string}", function (status) {
  this.novoProdutoData.status = status;
});

When("a categoria como {string}", async function (categoriaNome) {
  let categoria = await categoriaProdutosService.criarCategoria({
    nome: categoriaNome,
    status: "ativo",
  });
  this.currentCategoria = categoria;
  this.novoProdutoData.categoriaId = categoria.id;
});

When("o descritivo com {string}", function (descritivo) {
  this.novoProdutoData.descritivo = descritivo;
});

When("eu salvo o novo produto", async function () {
  this.currentProduto = await produtoService.criarProduto(this.novoProdutoData);
});

Then("o produto {string} deve ser criado com sucesso", function (nome) {
  expect(this.currentProduto).to.exist;
  expect(this.currentProduto.nome).to.equal(nome);
  expect(this.currentProduto.id).to.exist;
});

Given(
  "que existe um produto {string} cadastrado na categoria {string}",
  async function (nomeProduto, nomeCategoria) {
    let categoria = await categoriaProdutosService.criarCategoria({
      nome: nomeCategoria,
      status: "ativo",
    });
    this.currentCategoria = categoria;

    this.currentProduto = await produtoService.criarProduto({
      nome: nomeProduto,
      status: "ativo",
      categoriaId: categoria.id,
    });
  },
);

When("eu peço os detalhes do produto {string}", async function (nomeProduto) {
  const produto = await produtoService.buscarProdutoPorId(
    this.currentProduto.id,
  );
  this.produtoData = produto;
});

Then(
  "eu devo ver os detalhes do produto {string} com a categoria {string}",
  function (nomeProduto, nomeCategoria) {
    expect(this.produtoData).to.exist;
    expect(this.produtoData.nome).to.equal(nomeProduto);
    expect(this.produtoData.categoria).to.exist;
    expect(this.produtoData.categoria.nome).to.equal(nomeCategoria);
  },
);

When("eu salvo as alterações do produto", async function () {
  this.currentProduto = await produtoService.atualizarProduto(
    this.currentProduto.id,
    this.novoProdutoData,
  );
});

Then(
  "o nome do produto na base de dados deve ser {string}",
  function (nomeEsperado) {
    expect(this.currentProduto.nome).to.equal(nomeEsperado);
  },
);

When("eu deleto o produto {string}", async function (nomeProduto) {
  await produtoService.deletarProduto(this.currentProduto.id);
});

Then(
  "o produto {string} não deve mais existir no sistema",
  async function (nomeProduto) {
    try {
      await produtoService.buscarProdutoPorId(this.currentProduto.id);
      throw new Error("O produto ainda existe");
    } catch (error) {
      expect(error.message).to.match(/not found|não encontrado/i);
    }
  },
);
