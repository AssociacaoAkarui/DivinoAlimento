const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const assert = require("assert");
const {
  CicloFactory,
  UsuarioFactory,
  PontoEntregaFactory,
  ProdutoFactory,
} = require("./support/factories");
const {
  CicloService,
  PontoEntregaService,
  PedidoConsumidoresService,
  ProdutoService,
} = require("../../src/services/services");
const { Usuario } = require("../../models");

const cicloService = new CicloService();
const pontoEntregaService = new PontoEntregaService();
const pedidoConsumidoresService = new PedidoConsumidoresService();
const produtoService = new ProdutoService();

let cicloAtivo;
let consumidor;
let novoPedidoData = {};
let pedidoCriado;
let pedidoEncontrado;
let produtoDisponivel;
let quantidadeProduto;

Given("que existe um ciclo ativo para pedidos", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  cicloAtivo = await cicloService.criarCiclo(cicloData);
});

Given("que existe um usuário consumidor cadastrado", async function () {
  const consumidorData = UsuarioFactory.create("consumidor");
  consumidor = await Usuario.create(consumidorData);
});

When("eu crio um novo pedido para o consumidor no ciclo", function () {
  novoPedidoData.cicloId = cicloAtivo.id;
  novoPedidoData.usuarioId = consumidor.id;
});

When("o status do pedido como {string}", function (status) {
  novoPedidoData.status = status;
});

When("eu salvo o novo pedido", async function () {
  try {
    pedidoCriado = await pedidoConsumidoresService.criarPedido(novoPedidoData);
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then("o pedido deve ser criado com sucesso", function () {
  assert.ok(pedidoCriado.id, "O pedido deveria ter um ID");
  assert.strictEqual(pedidoCriado.cicloId, novoPedidoData.cicloId);
  assert.strictEqual(pedidoCriado.usuarioId, novoPedidoData.usuarioId);
  assert.strictEqual(pedidoCriado.status, novoPedidoData.status);
  assert.strictEqual(
    this.error,
    null,
    "Não deveria haver erro ao criar o pedido",
  );
});

Given("que existe um pedido cadastrado para um consumidor", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  const ciclo = await cicloService.criarCiclo(cicloData);
  const consumidorData = UsuarioFactory.create("consumidor");
  const consumidor = await Usuario.create(consumidorData);

  pedidoCriado = await pedidoConsumidoresService.criarPedido({
    cicloId: ciclo.id,
    usuarioId: consumidor.id,
    status: "pendente",
  });
});

When("eu solicito os detalhes do pedido", async function () {
  pedidoEncontrado = await pedidoConsumidoresService.buscarPedidoPorId(
    pedidoCriado.id,
  );
});

Then(
  "eu devo ver os detalhes do pedido incluindo consumidor e ciclo",
  function () {
    expect(pedidoEncontrado).to.be.an("object");
    expect(pedidoEncontrado.ciclo).to.be.an("object");
    expect(pedidoEncontrado.usuario).to.be.an("object");
    expect(pedidoEncontrado.cicloId).to.equal(pedidoCriado.cicloId);
    expect(pedidoEncontrado.usuarioId).to.equal(pedidoCriado.usuarioId);
  },
);

Given("que existe um pedido ativo de um consumidor", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  const ciclo = await cicloService.criarCiclo(cicloData);
  const consumidorData = UsuarioFactory.create("consumidor");
  const consumidor = await Usuario.create(consumidorData);

  pedidoCriado = await pedidoConsumidoresService.criarPedido({
    cicloId: ciclo.id,
    usuarioId: consumidor.id,
    status: "ativo",
  });
});

Given(
  "que existe um produto {string} disponível para compra",
  async function (nomeProduto) {
    const produtoData = ProdutoFactory.create({ nome: nomeProduto });
    produtoDisponivel = await produtoService.criarProduto(produtoData);
  },
);

When("eu adiciono o produto {string} ao pedido", function (nomeProduto) {
  // Step narrativo
});

When(
  "defino a quantidade do produto no pedido como {int}",
  function (quantidade) {
    quantidadeProduto = quantidade;
  },
);

When("eu salvo o produto no pedido", async function () {
  try {
    await pedidoConsumidoresService.adicionarProduto(
      pedidoCriado.id,
      produtoDisponivel.id,
      quantidadeProduto,
    );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "o produto {string} deve estar no pedido com quantidade {int}",
  async function (nomeProduto, quantidadeEsperada) {
    assert.strictEqual(
      this.error,
      null,
      "Ocorreu um erro ao adicionar o produto ao pedido.",
    );
    const pedido = await pedidoConsumidoresService.buscarPedidoPorIdComProdutos(
      pedidoCriado.id,
    );
    const produtoNoPedido = pedido.pedidoConsumidoresProdutos.find(
      (p) => p.produto.nome === nomeProduto,
    );
    assert.ok(produtoNoPedido, `Produto "${nomeProduto}" não encontrado.`);
    assert.strictEqual(produtoNoPedido.quantidade, quantidadeEsperada);
  },
);

// Steps pendentes restantes...
Given(
  "que existe um pedido com produto {string} e quantidade {int}",
  async function (nomeProduto, quantidade) {
    const pontoEntregaData = PontoEntregaFactory.create();
    const pontoEntrega =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
    const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
    const ciclo = await cicloService.criarCiclo(cicloData);
    const consumidorData = UsuarioFactory.create("consumidor");
    const consumidor = await Usuario.create(consumidorData);
    pedidoCriado = await pedidoConsumidoresService.criarPedido({
      cicloId: ciclo.id,
      usuarioId: consumidor.id,
      status: "ativo",
    });
    const produtoData = ProdutoFactory.create({ nome: nomeProduto });
    produtoDisponivel = await produtoService.criarProduto(produtoData);
    pedidoProduto = await pedidoConsumidoresService.adicionarProduto(
      pedidoCriado.id,
      produtoDisponivel.id,
      quantidade,
    );
  },
);

When(
  "eu edito a quantidade do produto no pedido para {int}",
  function (novaQuantidade) {
    quantidadeProduto = novaQuantidade;
  },
);

When("salvo as alterações da quantidade do produto", async function () {
  try {
    await pedidoConsumidoresService.atualizarQuantidadeProduto(
      pedidoProduto.id,
      quantidadeProduto,
    );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "a quantidade de {string} no pedido deve ser {int}",
  async function (nomeProduto, quantidadeEsperada) {
    assert.strictEqual(
      this.error,
      null,
      "Ocorreu um erro ao atualizar a quantidade.",
    );
    const pedido = await pedidoConsumidoresService.buscarPedidoPorIdComProdutos(
      pedidoCriado.id,
    );
    const produtoNoPedido = pedido.pedidoConsumidoresProdutos.find(
      (p) => p.produto.nome === nomeProduto,
    );
    assert.ok(produtoNoPedido, `Produto "${nomeProduto}" não encontrado.`);
    assert.strictEqual(produtoNoPedido.quantidade, quantidadeEsperada);
  },
);
let valorTotalCalculado;

Given("que existe um pedido com produtos", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  const ciclo = await cicloService.criarCiclo(cicloData);
  const consumidorData = UsuarioFactory.create("consumidor");
  const consumidor = await Usuario.create(consumidorData);
  pedidoCriado = await pedidoConsumidoresService.criarPedido({
    cicloId: ciclo.id,
    usuarioId: consumidor.id,
    status: "ativo",
  });
});

Given(
  "o produto {string} tem quantidade {int} e valor {float}",
  async function (nomeProduto, quantidade, valor) {
    const produtoData = ProdutoFactory.create({ nome: nomeProduto });
    const produto = await produtoService.criarProduto(produtoData);
    const pedidoProduto = await pedidoConsumidoresService.adicionarProduto(
      pedidoCriado.id,
      produto.id,
      quantidade,
    );
    await pedidoProduto.update({ valorCompra: valor });
  },
);

When("eu calculo o valor total do pedido", async function () {
  try {
    valorTotalCalculado = await pedidoConsumidoresService.calcularValorTotal(
      pedidoCriado.id,
    );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then("o valor total deve ser {float}", function (valorEsperado) {
  assert.strictEqual(
    this.error,
    null,
    "Ocorreu um erro ao calcular o valor total.",
  );
  assert.strictEqual(valorTotalCalculado, valorEsperado);
});
let novoStatusPedido;

Given("que existe um pedido com status {string}", async function (status) {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  const ciclo = await cicloService.criarCiclo(cicloData);
  const consumidorData = UsuarioFactory.create("consumidor");
  const consumidor = await Usuario.create(consumidorData);
  pedidoCriado = await pedidoConsumidoresService.criarPedido({
    cicloId: ciclo.id,
    usuarioId: consumidor.id,
    status: status,
  });
});

When("eu edito o status do pedido para {string}", function (novoStatus) {
  novoStatusPedido = novoStatus;
});

When("salvo as alterações do status do pedido", async function () {
  try {
    await pedidoConsumidoresService.atualizarStatus(
      pedidoCriado.id,
      novoStatusPedido,
    );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then("o status do pedido deve ser {string}", async function (statusEsperado) {
  assert.strictEqual(
    this.error,
    null,
    "Ocorreu um erro ao atualizar o status.",
  );
  const pedidoAtualizado = await pedidoConsumidoresService.buscarPedidoPorId(
    pedidoCriado.id,
  );
  assert.strictEqual(pedidoAtualizado.status, statusEsperado);
});
let pedidoDoConsumidor;

Given("que um consumidor possui pedido", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  const ciclo = await cicloService.criarCiclo(cicloData);
  const consumidorData = UsuarioFactory.create("consumidor");
  consumidor = await Usuario.create(consumidorData);
  pedidoCriado = await pedidoConsumidoresService.criarPedido({
    cicloId: ciclo.id,
    usuarioId: consumidor.id,
    status: "ativo",
  });

  const produto1Data = ProdutoFactory.create({ nome: "Produto A" });
  const produto2Data = ProdutoFactory.create({ nome: "Produto B" });
  const produto1 = await produtoService.criarProduto(produto1Data);
  const produto2 = await produtoService.criarProduto(produto2Data);

  await pedidoConsumidoresService.adicionarProduto(
    pedidoCriado.id,
    produto1.id,
    5,
  );
  await pedidoConsumidoresService.adicionarProduto(
    pedidoCriado.id,
    produto2.id,
    10,
  );
});

When("eu solicito o pedido do consumidor", async function () {
  try {
    pedidoDoConsumidor =
      await pedidoConsumidoresService.buscarPedidoPorIdComProdutos(
        pedidoCriado.id,
      );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "eu devo ver todos os produtos e quantidades pedidos do consumidor",
  function () {
    assert.strictEqual(this.error, null, "Ocorreu um erro ao buscar o pedido.");
    expect(pedidoDoConsumidor.pedidoConsumidoresProdutos).to.have.lengthOf(2);
    const nomesDosProdutos = pedidoDoConsumidor.pedidoConsumidoresProdutos.map(
      (p) => p.produto.nome,
    );
    expect(nomesDosProdutos).to.have.members(["Produto A", "Produto B"]);
  },
);
let listaDePedidos;

Given("que existem múltiplos pedidos em um ciclo", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  cicloAtivo = await cicloService.criarCiclo(cicloData);

  const consumidor1Data = UsuarioFactory.create("consumidor");
  const consumidor2Data = UsuarioFactory.create("consumidor");
  const consumidor1 = await Usuario.create(consumidor1Data);
  const consumidor2 = await Usuario.create(consumidor2Data);

  await pedidoConsumidoresService.criarPedido({
    cicloId: cicloAtivo.id,
    usuarioId: consumidor1.id,
    status: "ativo",
  });
  await pedidoConsumidoresService.criarPedido({
    cicloId: cicloAtivo.id,
    usuarioId: consumidor2.id,
    status: "ativo",
  });
});

When("eu solicito todos os pedidos do ciclo", async function () {
  try {
    listaDePedidos = await pedidoConsumidoresService.listarPedidosPorCiclo(
      cicloAtivo.id,
    );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then("eu devo ver todos os pedidos associados ao ciclo", function () {
  assert.strictEqual(
    this.error,
    null,
    "Ocorreu um erro ao buscar os pedidos do ciclo.",
  );
  expect(listaDePedidos).to.have.lengthOf(2);
});
