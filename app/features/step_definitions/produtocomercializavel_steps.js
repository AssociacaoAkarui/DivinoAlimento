const { Before, Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const {
  ProdutoService,
  ProdutoComercializavelService,
  CategoriaProdutosService,
} = require("../../src/services/services.js");

let produtoService;
let produtoComercializavelService;
let categoriaProdutosService;

Before(function () {
  produtoService = new ProdutoService();
  produtoComercializavelService = new ProdutoComercializavelService();
  categoriaProdutosService = new CategoriaProdutosService();
  this.produtoComercializavelData = {};
  this.currentProdutoComercializavel = null;
  this.currentProduto = null;
  this.currentCategoria = null;
});

// PCO-01: Criar um novo registro de produto comercializável com sucesso
Given(
  "que eu quero criar um registro de produto comercializável para um produto existente",
  async function () {
    // Criar categoria e produto base para o teste
    this.currentCategoria = await categoriaProdutosService.criarCategoria({
      nome: "Frutas",
      status: "ativo",
    });
    this.currentProduto = await produtoService.criarProduto({
      nome: "Maçã Fuji",
      status: "ativo",
      categoriaId: this.currentCategoria.id,
    });
    this.novoProdutoComercializavelData = {
      produtoId: this.currentProduto.id,
    };
  },
);

When("eu preencho a medida como {string}", function (medida) {
  if (!this.novoProdutoComercializavelData) {
    this.novoProdutoComercializavelData = {};
  }
  this.novoProdutoComercializavelData.medida = medida;
});

When("o peso em kilogramas com {string}", function (pesoKg) {
  this.novoProdutoComercializavelData.pesoKg = parseFloat(pesoKg);
});

When("o preço base com {string}", function (precoBase) {
  this.novoProdutoComercializavelData.precoBase = parseFloat(precoBase);
});

When("o status do produto comercializável como {string}", function (status) {
  this.novoProdutoComercializavelData.status = status;
});

When("eu salvo o novo produto comercializável", async function () {
  this.currentProdutoComercializavel =
    await produtoComercializavelService.criarProdutoComercializavel(
      this.novoProdutoComercializavelData,
    );
});

Then(
  "o produto comercializável com medida {string} deve ser criado com sucesso",
  function (medida) {
    expect(this.currentProdutoComercializavel).to.exist;
    expect(this.currentProdutoComercializavel.medida).to.equal(medida);
    expect(this.currentProdutoComercializavel.id).to.exist;
  },
);

// PCO-02: Ver os detalhes de um produto comercializável existente
Given(
  "que existe um produto {string} com cadastro de produto comercializável {string}",
  async function (nomeProduto, medida) {
    // Criar categoria
    this.currentCategoria = await categoriaProdutosService.criarCategoria({
      nome: "Frutas",
      status: "ativo",
    });
    // Criar produto base
    this.currentProduto = await produtoService.criarProduto({
      nome: nomeProduto,
      status: "ativo",
      categoriaId: this.currentCategoria.id,
    });
    // Criar produto comercializável
    this.currentProdutoComercializavel =
      await produtoComercializavelService.criarProdutoComercializavel({
        produtoId: this.currentProduto.id,
        medida: medida,
        pesoKg: 0.5,
        precoBase: 5.0,
        status: "ativo",
      });
  },
);

When(
  "eu peço os detalhes do produto comercializável {string} do produto {string}",
  async function (medida, nomeProduto) {
    const produtoComercializavel =
      await produtoComercializavelService.buscarPorId(
        this.currentProdutoComercializavel.id,
      );
    this.produtoComercializavelData = produtoComercializavel;
  },
);

Then(
  "eu devo ver os detalhes do produto comercializável {string} do produto {string}",
  function (medida, nomeProduto) {
    expect(this.produtoComercializavelData).to.exist;
    expect(this.produtoComercializavelData.medida).to.equal(medida);
    expect(this.produtoComercializavelData.produto).to.exist;
    expect(this.produtoComercializavelData.produto.nome).to.equal(nomeProduto);
  },
);

// PCO-03: Atualizar um produto comercializável existente
When(
  "eu altero a unidade do produto comercializável para {string}",
  function (novaMedida) {
    this.novoProdutoComercializavelData = {
      medida: novaMedida,
    };
  },
);

When("eu salvo as alterações do produto comercializável", async function () {
  this.currentProdutoComercializavel =
    await produtoComercializavelService.atualizarProdutoComercializavel(
      this.currentProdutoComercializavel.id,
      this.novoProdutoComercializavelData,
    );
});

Then(
  "a medida do produto comercializável deve ser {string}",
  function (medidaEsperada) {
    expect(this.currentProdutoComercializavel.medida).to.equal(medidaEsperada);
  },
);

// PCO-04: Deletar um produto comercializável existente
When("eu deleto o produto comercializável {string}", async function (medida) {
  await produtoComercializavelService.deletarProdutoComercializavel(
    this.currentProdutoComercializavel.id,
  );
});

Then(
  "o produto comercializável {string} não deve mais existir para o produto {string} no sistema",
  async function (medida, nomeProduto) {
    try {
      await produtoComercializavelService.buscarPorId(
        this.currentProdutoComercializavel.id,
      );
      throw new Error("O produto comercializável ainda existe");
    } catch (error) {
      expect(error.message).to.match(/not found|não encontrado/i);
    }
  },
);
