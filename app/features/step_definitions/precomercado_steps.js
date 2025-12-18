const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const {
  PrecoMercadoService,
  CategoriaProdutosService,
  ProdutoService,
  MercadoService,
} = require("../../src/services/services");
const { Usuario } = require("../../models");

const precoMercadoService = new PrecoMercadoService();
const categoriaProdutosService = new CategoriaProdutosService();
const produtoService = new ProdutoService();
const mercadoService = new MercadoService();

let usuario, categoria, produto, mercado, preco, precos, resultado;

Given("que existe um usuário administrador", async function () {
  usuario = await Usuario.create({
    nome: "Admin Test",
    email: "admin.preco@test.com",
    senha: "senha123",
    perfis: ["admin"],
    status: "ativo",
  });
});

Given("que existe uma categoria de produtos", async function () {
  categoria = await categoriaProdutosService.criarCategoria({
    nome: "Categoria Test",
    descricao: "Categoria para testes",
    status: "ativo",
  });
});

Given("que existe um produto cadastrado", async function () {
  produto = await produtoService.criarProduto({
    nome: "Produto Test",
    medida: "kg",
    pesoGrama: 1000,
    valorReferencia: 10.0,
    categoriaId: categoria.id,
    status: "ativo",
  });
});

Given("que existe um mercado cadastrado", async function () {
  mercado = await mercadoService.criarMercado({
    nome: "Mercado Test",
    tipo: "cesta",
    responsavelId: usuario.id,
    valorMaximoCesta: 100,
    status: "ativo",
  });
});

When(
  "eu criar um preço de {string} para o produto no mercado",
  async function (valor) {
    preco = await precoMercadoService.criarPreco({
      produtoId: produto.id,
      mercadoId: mercado.id,
      preco: parseFloat(valor),
      status: "ativo",
    });
  },
);

Then("o preço deve ser criado com sucesso", function () {
  assert.ok(preco);
  assert.ok(preco.id);
});

Then("o preço deve estar com status {string}", function (status) {
  assert.strictEqual(preco.status, status);
});

Given(
  "que existem {int} preços cadastrados para o mercado",
  async function (quantidade) {
    for (let i = 0; i < quantidade; i++) {
      const prod = await produtoService.criarProduto({
        nome: `Produto ${i}`,
        medida: "kg",
        pesoGrama: 1000,
        valorReferencia: 10.0,
        categoriaId: categoria.id,
        status: "ativo",
      });
      await precoMercadoService.criarPreco({
        produtoId: prod.id,
        mercadoId: mercado.id,
        preco: 10.0 + i,
        status: "ativo",
      });
    }
  },
);

When("eu listar os preços do mercado", async function () {
  precos = await precoMercadoService.listarPrecosPorMercado(mercado.id);
});

Then("devo receber {int} preços", function (quantidade) {
  assert.strictEqual(precos.length, quantidade);
});

Given("que existe um preço cadastrado", async function () {
  preco = await precoMercadoService.criarPreco({
    produtoId: produto.id,
    mercadoId: mercado.id,
    preco: 15.0,
    status: "ativo",
  });
});

When("eu buscar o preço por ID", async function () {
  resultado = await precoMercadoService.buscarPreco(preco.id);
});

Then("devo receber os dados do preço", function () {
  assert.ok(resultado);
  assert.strictEqual(resultado.id, preco.id);
});

Given("que existe um preço de {string} cadastrado", async function (valor) {
  preco = await precoMercadoService.criarPreco({
    produtoId: produto.id,
    mercadoId: mercado.id,
    preco: parseFloat(valor),
    status: "ativo",
  });
});

When("eu atualizar o preço para {string}", async function (novoValor) {
  resultado = await precoMercadoService.atualizarPreco(preco.id, {
    preco: parseFloat(novoValor),
  });
});

Then("o preço deve ser atualizado com sucesso", function () {
  assert.ok(resultado);
});

Then("o novo valor deve ser {string}", async function (valor) {
  const precoAtualizado = await precoMercadoService.buscarPreco(preco.id);
  assert.strictEqual(parseFloat(precoAtualizado.preco), parseFloat(valor));
});

Given("que existe um preço ativo", async function () {
  preco = await precoMercadoService.criarPreco({
    produtoId: produto.id,
    mercadoId: mercado.id,
    preco: 20.0,
    status: "ativo",
  });
});

When("eu inativar o preço", async function () {
  resultado = await precoMercadoService.atualizarPreco(preco.id, {
    status: "inativo",
  });
});

Then("o status do preço deve ser {string}", async function (status) {
  const precoAtualizado = await precoMercadoService.buscarPreco(preco.id);
  assert.strictEqual(precoAtualizado.status, status);
});

When("eu deletar o preço", async function () {
  await precoMercadoService.deletarPreco(preco.id);
});

Then("o preço deve ser removido do sistema", async function () {
  const precoExcluido = await precoMercadoService.buscarPreco(preco.id);
  assert.strictEqual(precoExcluido, null);
});
