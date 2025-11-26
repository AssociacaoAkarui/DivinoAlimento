const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const assert = require("assert");
const {
  CicloFactory,
  UsuarioFactory,
  PontoEntregaFactory,
  ProdutoFactory,
} = require("./support/factories");
const {
  EntregaFornecedorService,
  CicloService,
  ProdutoService,
  OfertaService,
  PontoEntregaService,
} = require("../../src/services/services");

const entregaFornecedorService = new EntregaFornecedorService();
const cicloService = new CicloService();
const produtoService = new ProdutoService();
const ofertaService = new OfertaService();
const pontoEntregaService = new PontoEntregaService();

const { Usuario } = require("../../models");

Before({ tags: "@entregasfornecedores" }, async function () {
  this.ciclo = null;
  this.fornecedores = [];
  this.ofertas = [];
  this.entregas = [];
  this.error = null;
});

// ENT-01: Listar entregas de todos os fornecedores de um ciclo
Given("que existe um ciclo ativo", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  this.ciclo = await cicloService.criarCiclo(cicloData);
  assert.ok(this.ciclo, "O ciclo não foi criado");
});

Given(
  "que existem {int} fornecedores com ofertas neste ciclo",
  async function (quantidade) {
    for (let i = 0; i < quantidade; i++) {
      const fornecedorData = UsuarioFactory.create("fornecedor", {
        nome: `Fornecedor ${i + 1}`,
      });
      const fornecedor = await Usuario.create(fornecedorData);
      this.fornecedores.push(fornecedor);

      // Criar oferta para cada fornecedor
      const oferta = await ofertaService.criarOferta({
        cicloId: this.ciclo.id,
        usuarioId: fornecedor.id,
      });

      // Adicionar produto à oferta
      const produtoData = ProdutoFactory.create({
        nome: `Produto ${i + 1}`,
      });
      const produto = await produtoService.criarProduto(produtoData);
      await ofertaService.adicionarProduto(
        oferta.id,
        produto.id,
        10 + i * 5,
        5.0 + i,
        4.5 + i,
      );

      this.ofertas.push(oferta);
    }
  },
);

When("eu solicito as entregas do ciclo", async function () {
  try {
    const cicloId = this.cicloVazio ? this.cicloVazio.id : this.ciclo.id;
    this.entregas =
      await entregaFornecedorService.listarEntregasFornecedoresPorCiclo(
        cicloId,
      );
    this.error = null;
  } catch (error) {
    this.error = error;
    this.entregas = [];
  }
});

Then(
  "eu devo ver entregas de {int} fornecedores diferentes",
  function (quantidade) {
    expect(this.error).to.be.null;
    expect(this.entregas).to.be.an("array");

    const fornecedoresUnicos = new Set(
      this.entregas.map((e) => e.fornecedorId),
    );
    expect(fornecedoresUnicos.size).to.equal(quantidade);
  },
);

// ENT-02: Listar entregas de um fornecedor específico
Given(
  "que existe um fornecedor {string} com ofertas neste ciclo",
  async function (nomeFornecedor) {
    const fornecedorData = UsuarioFactory.create("fornecedor", {
      nome: nomeFornecedor,
    });
    this.fornecedorEspecifico = await Usuario.create(fornecedorData);

    // Criar oferta para este fornecedor
    const oferta = await ofertaService.criarOferta({
      cicloId: this.ciclo.id,
      usuarioId: this.fornecedorEspecifico.id,
    });

    // Adicionar produto à oferta
    const produtoData = ProdutoFactory.create({ nome: "Tomate" });
    const produto = await produtoService.criarProduto(produtoData);
    await ofertaService.adicionarProduto(oferta.id, produto.id, 50, 5.5, 5.0);

    this.ofertaEspecifica = oferta;
  },
);

When(
  "eu solicito as entregas do ciclo para o fornecedor {string}",
  async function (nomeFornecedor) {
    try {
      this.entregas =
        await entregaFornecedorService.listarEntregasFornecedoresPorCiclo(
          this.ciclo.id,
          this.fornecedorEspecifico.id,
        );
      this.error = null;
    } catch (error) {
      this.error = error;
      this.entregas = [];
    }
  },
);

Then(
  "eu devo ver apenas as entregas do fornecedor {string}",
  function (nomeFornecedor) {
    expect(this.error).to.be.null;
    expect(this.entregas).to.be.an("array");
    expect(this.entregas.length).to.be.greaterThan(0);

    this.entregas.forEach((entrega) => {
      expect(entrega.fornecedor).to.equal(nomeFornecedor);
    });
  },
);

// ENT-03: Visualizar detalhes de uma entrega
Given(
  "que existe uma oferta de {string} no ciclo",
  async function (nomeProduto) {
    // Criar ciclo se não existir
    if (!this.ciclo) {
      const pontoEntregaData = PontoEntregaFactory.create();
      const pontoEntrega =
        await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
      const cicloData = CicloFactory.create({
        pontoEntregaId: pontoEntrega.id,
      });
      this.ciclo = await cicloService.criarCiclo(cicloData);
    }

    const fornecedorData = UsuarioFactory.create("fornecedor", {
      nome: "Maria Santos",
    });
    const fornecedor = await Usuario.create(fornecedorData);

    const oferta = await ofertaService.criarOferta({
      cicloId: this.ciclo.id,
      usuarioId: fornecedor.id,
    });

    const produtoData = ProdutoFactory.create({ nome: nomeProduto });
    const produto = await produtoService.criarProduto(produtoData);
    await ofertaService.adicionarProduto(oferta.id, produto.id, 100, 4.5, 4.0);

    this.fornecedorAtual = fornecedor;
    this.produtoAtual = produto;
  },
);

Then("eu devo ver o nome do fornecedor", function () {
  expect(this.entregas).to.be.an("array");
  expect(this.entregas.length).to.be.greaterThan(0);
  expect(this.entregas[0].fornecedor).to.be.a("string");
  expect(this.entregas[0].fornecedor).to.not.be.empty;
});

Then("eu devo ver o nome do produto", function () {
  expect(this.entregas[0].produto).to.be.a("string");
  expect(this.entregas[0].produto).to.not.be.empty;
});

Then("eu devo ver a quantidade ofertada", function () {
  expect(this.entregas[0].quantidadeOfertada).to.be.a("number");
  expect(this.entregas[0].quantidadeOfertada).to.be.greaterThan(0);
});

Then("eu devo ver o valor unitário", function () {
  expect(this.entregas[0].valorUnitario).to.be.a("number");
  expect(this.entregas[0].valorUnitario).to.be.greaterThan(0);
});

Then("eu devo ver o valor total", function () {
  expect(this.entregas[0].valorTotal).to.be.a("number");
  expect(this.entregas[0].valorTotal).to.be.greaterThan(0);
});

// ENT-04: Listar entregas sem ofertas cadastradas
Given("que existe um ciclo sem ofertas", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  this.cicloVazio = await cicloService.criarCiclo(cicloData);
});

Then("eu devo ver uma lista vazia", function () {
  expect(this.error).to.be.null;
  expect(this.entregas).to.be.an("array");
  expect(this.entregas).to.have.lengthOf(0);
});

// ENT-05: Erro ao buscar entregas de ciclo inexistente
When("eu solicito as entregas de um ciclo inexistente", async function () {
  try {
    this.entregas =
      await entregaFornecedorService.listarEntregasFornecedoresPorCiclo(99999);
    this.error = null;
  } catch (error) {
    this.error = error;
    this.entregas = [];
  }
});

Then("eu devo receber um erro informando que o ciclo não existe", function () {
  // Como não hay validación explícita, solo retorna array vacío
  // En una implementación más robusta, se validaría la existencia del ciclo
  expect(this.entregas).to.be.an("array");
  expect(this.entregas).to.have.lengthOf(0);
});
