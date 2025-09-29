const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { CategoriaProdutos, Produto } = require("../../models");
const Factories = require("./support/factories");
const { ProdutoService } = require("../../src/services/services");

let novoProdutoData = {};
let categoriaCriada;
let produtoCriado;
let produtoExistente;
let produtoRetornado;

Given("que eu quero criar um novo Produto", async function () {
  novoProdutoData = {};

  [categoriaCriada] = await CategoriaProdutos.findOrCreate({
    where: { nome: "Frutas" },
    defaults: { status: "ativo" },
  });
});

When("eu preencho o nome com {string}", function (nome) {
  novoProdutoData.nome = nome;
});

When("a medida como {string}", function (medida) {
  novoProdutoData.medida = medida;
});

When("o peso em gramas com {string}", function (peso) {
  novoProdutoData.pesoGrama = parseInt(peso, 10);
});

When("o valor de referência com {string}", function (valor) {
  novoProdutoData.valorReferencia = parseFloat(valor);
});

When("o status como {string}", function (status) {
  novoProdutoData.status = status;
});

When("a categoria como {string}", function (nomeCategoria) {
  if (categoriaCriada && categoriaCriada.nome === nomeCategoria) {
    novoProdutoData.categoriaId = categoriaCriada.id;
  }
});

When("o descritivo com {string}", function (descritivo) {
  novoProdutoData.descritivo = descritivo;
});

When("eu salvo o novo produto", async function () {
  const produtoService = new ProdutoService();
  produtoCriado = await produtoService.criarProduto(novoProdutoData);
});

Then("o produto {string} deve ser criado com sucesso", function (nomeProduto) {
  expect(produtoCriado).to.not.be.null;
  expect(produtoCriado.id).to.be.a("number");
  expect(produtoCriado.nome).to.equal(nomeProduto);
  expect(produtoCriado.nome).to.equal(novoProdutoData.nome);
  expect(produtoCriado.medida).to.equal(novoProdutoData.medida);
  expect(produtoCriado.pesoGrama).to.equal(novoProdutoData.pesoGrama);
  expect(produtoCriado.valorReferencia).to.equal(
    novoProdutoData.valorReferencia,
  );
  expect(produtoCriado.status).to.equal(novoProdutoData.status);
  expect(produtoCriado.categoriaId).to.equal(novoProdutoData.categoriaId);
  expect(produtoCriado.descritivo).to.equal(novoProdutoData.descritivo);
});

Given(
  "que existe um produto {string} cadastrado na categoria {string}",
  async function (nomeProduto, nomeCategoria) {
    const [categoria] = await CategoriaProdutos.findOrCreate({
      where: { nome: nomeCategoria },
      defaults: { status: "ativo" },
    });

    produtoExistente = await Produto.create({
      nome: nomeProduto,
      medida: "unidade",
      pesoGrama: 120,
      valorReferencia: 0.8,
      status: "ativo",
      categoriaId: categoria.id,
      descritivo: `Uma deliciosa ${nomeProduto}`,
    });
  },
);

When("eu peço os detalhes do produto {string}", async function (nomeProduto) {
  expect(produtoExistente.nome).to.equal(nomeProduto);
  const produtoService = new ProdutoService();
  produtoRetornado = await produtoService.buscarProdutoPorId(
    produtoExistente.id,
  );
});

Then(
  "eu devo ver os detalhes do produto {string} com a categoria {string}",
  function (nomeProduto, nomeCategoria) {
    expect(produtoRetornado).to.exist;
    expect(produtoRetornado.nome).to.equal(nomeProduto);

    expect(produtoRetornado.categoria.nome).to.equal(nomeCategoria);
  },
);

let produtoAtualizado;
let produtoDeletado;

When("eu salvo as alterações do produto", async function () {
  const produtoService = new ProdutoService();
  produtoAtualizado = await produtoService.atualizarProduto(
    produtoExistente.id,
    novoProdutoData,
  );
});

Then(
  "o nome do produto na base de dados deve ser {string}",
  async function (nomeEsperado) {
    expect(produtoAtualizado).to.exist;
    expect(produtoAtualizado.nome).to.equal(nomeEsperado);
    expect(produtoAtualizado.valorReferencia).to.equal(
      novoProdutoData.valorReferencia,
    );

    const produtoNaDb = await Produto.findByPk(produtoExistente.id);
    expect(produtoNaDb.nome).to.equal(nomeEsperado);
  },
);

When("eu deleto o produto {string}", async function (nomeProduto) {
  expect(produtoExistente.nome).to.equal(nomeProduto);
  const produtoService = new ProdutoService();
  produtoDeletado = await produtoService.deletarProduto(produtoExistente.id);
});

Then(
  "o produto {string} não deve mais existir no sistema",
  async function (nomeProduto) {
    expect(produtoDeletado).to.be.true;

    const produtoService = new ProdutoService();
    try {
      await produtoService.buscarProdutoPorId(produtoExistente.id);

      expect.fail(
        `Produto "${nomeProduto}" ainda foi encontrado no sistema, mas deveria ter sido deletado.`,
      );
    } catch (error) {
      expect(error.message).to.equal(
        `Produto com ID ${produtoExistente.id} não encontrado`,
      );
    }
  },
);
