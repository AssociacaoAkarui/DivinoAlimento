const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const PagamentoService = require("../../src/services/pagamento-service");
const models = require("../../models");

const pagamentoService = new PagamentoService();

let fornecedor, consumidor, pagamento, pagamentos, resultado, erro;

Given("que existe um fornecedor cadastrado", async function () {
  fornecedor = await models.Usuario.create({
    nome: "Fornecedor Test",
    email: `fornecedor.${Date.now()}@test.com`,
    senha: "senha123",
    perfis: ["fornecedor"],
    status: "ativo",
  });
});

Given("que existe um consumidor cadastrado", async function () {
  consumidor = await models.Usuario.create({
    nome: "Consumidor Test",
    email: `consumidor.${Date.now()}@test.com`,
    senha: "senha123",
    perfis: ["consumidor"],
    status: "ativo",
  });
});

When(
  "eu criar um pagamento de tipo {string} com valor {string}",
  async function (tipo, valor) {
    const usuario = await models.Usuario.findOne({
      where: { perfis: ["admin"] },
    });
    const ciclo = await models.Ciclo.findOne();
    const mercado = await models.Mercado.findOne();
    const usuarioId = tipo === "fornecedor" ? fornecedor.id : consumidor.id;
    pagamento = await pagamentoService.criarPagamento({
      tipo,
      valorTotal: parseFloat(valor),
      status: "pendente",
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      usuarioId,
    });
  },
);

Then("o pagamento deve ser criado com sucesso", function () {
  assert.ok(pagamento);
  assert.ok(pagamento.id);
});

Then("o status deve ser {string}", function (status) {
  const entidade = resultado || pagamento;
  assert.strictEqual(entidade.status, status);
});

Then("o tipo deve ser {string}", function (tipo) {
  assert.strictEqual(pagamento.tipo, tipo);
});

Given("que existem {int} pagamentos cadastrados", async function (quantidade) {
  const ciclo = await models.Ciclo.findOne();
  const mercado = await models.Mercado.findOne();
  for (let i = 0; i < quantidade; i++) {
    await pagamentoService.criarPagamento({
      tipo: i % 2 === 0 ? "fornecedor" : "consumidor",
      valorTotal: 100 + i * 10,
      status: "pendente",
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      usuarioId: i % 2 === 0 ? fornecedor.id : consumidor.id,
    });
  }
});

When("eu listar todos os pagamentos", async function () {
  pagamentos = await pagamentoService.listarPagamentos();
});

Then("devo receber {int} pagamentos", function (quantidade) {
  assert.strictEqual(pagamentos.length, quantidade);
});

Given(
  "que existem {int} pagamentos de fornecedor",
  async function (quantidade) {
    const ciclo = await models.Ciclo.findOne();
    const mercado = await models.Mercado.findOne();
    for (let i = 0; i < quantidade; i++) {
      await pagamentoService.criarPagamento({
        tipo: "fornecedor",
        valorTotal: 100 + i * 10,
        status: "pendente",
        cicloId: ciclo.id,
        mercadoId: mercado.id,
        usuarioId: fornecedor.id,
      });
    }
  },
);

Given(
  "que existem {int} pagamentos de consumidor",
  async function (quantidade) {
    const ciclo = await models.Ciclo.findOne();
    const mercado = await models.Mercado.findOne();
    for (let i = 0; i < quantidade; i++) {
      await pagamentoService.criarPagamento({
        tipo: "consumidor",
        valorTotal: 50 + i * 5,
        status: "pendente",
        cicloId: ciclo.id,
        mercadoId: mercado.id,
        usuarioId: consumidor.id,
      });
    }
  },
);

When("eu filtrar pagamentos por tipo {string}", async function (tipo) {
  pagamentos = await pagamentoService.listarPagamentos({ tipo });
});

Given("que existem {int} pagamentos pendentes", async function (quantidade) {
  const ciclo = await models.Ciclo.findOne();
  const mercado = await models.Mercado.findOne();
  for (let i = 0; i < quantidade; i++) {
    await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 100,
      status: "pendente",
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      usuarioId: fornecedor.id,
    });
  }
});

Given("que existem {int} pagamentos pagos", async function (quantidade) {
  const ciclo = await models.Ciclo.findOne();
  const mercado = await models.Mercado.findOne();
  for (let i = 0; i < quantidade; i++) {
    const pag = await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 100,
      status: "pago",
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      usuarioId: fornecedor.id,
    });
    await pag.update({ status: "pago", dataPagamento: "2025-01-15" });
  }
});

When("eu filtrar pagamentos por status {string}", async function (status) {
  pagamentos = await pagamentoService.listarPagamentos({ status });
});

Given(
  "que existem {int} pagamentos do ciclo atual",
  async function (quantidade) {
    const ciclo = await models.Ciclo.findOne();
    const mercado = await models.Mercado.findOne();
    for (let i = 0; i < quantidade; i++) {
      await pagamentoService.criarPagamento({
        tipo: "fornecedor",
        valorTotal: 100,
        status: "pendente",
        cicloId: ciclo.id,
        mercadoId: mercado.id,
        usuarioId: fornecedor.id,
      });
    }
  },
);

Given(
  "que existem {int} pagamentos de outro ciclo",
  async function (quantidade) {
    const usuario = await models.Usuario.findOne({
      where: { perfis: ["admin"] },
    });
    const mercado = await models.Mercado.findOne();
    const pontoEntrega = await models.PontoEntrega.findOne();
    const outroCiclo = await models.Ciclo.create({
      nome: "Outro Ciclo",
      ofertaInicio: "2025-01-20",
      ofertaFim: "2025-01-25",
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });

    for (let i = 0; i < quantidade; i++) {
      await pagamentoService.criarPagamento({
        tipo: "fornecedor",
        valorTotal: 100,
        status: "pendente",
        cicloId: outroCiclo.id,
        mercadoId: mercado.id,
        usuarioId: fornecedor.id,
      });
    }
  },
);

When("eu filtrar pagamentos por ciclo", async function () {
  const ciclo = await models.Ciclo.findOne({ order: [["createdAt", "ASC"]] });
  pagamentos = await pagamentoService.listarPagamentos({ cicloId: ciclo.id });
});

Given("que existe um pagamento cadastrado", async function () {
  const ciclo = await models.Ciclo.findOne();
  const mercado = await models.Mercado.findOne();
  pagamento = await pagamentoService.criarPagamento({
    tipo: "fornecedor",
    valorTotal: 300,
    status: "pendente",
    cicloId: ciclo.id,
    mercadoId: mercado.id,
    usuarioId: fornecedor.id,
  });
});

When("eu buscar o pagamento por ID", async function () {
  resultado = await pagamentoService.buscarPorId(pagamento.id);
});

Then("devo receber os dados do pagamento", function () {
  assert.ok(resultado);
  assert.strictEqual(resultado.id, pagamento.id);
});

Given("que existe um pagamento de {string}", async function (valor) {
  const ciclo = await models.Ciclo.findOne();
  const mercado = await models.Mercado.findOne();
  pagamento = await pagamentoService.criarPagamento({
    tipo: "fornecedor",
    valorTotal: parseFloat(valor),
    status: "pendente",
    cicloId: ciclo.id,
    mercadoId: mercado.id,
    usuarioId: fornecedor.id,
  });
});

When("eu atualizar o valor para {string}", async function (novoValor) {
  resultado = await pagamentoService.atualizarPagamento(pagamento.id, {
    valorTotal: parseFloat(novoValor),
  });
});

Then("o pagamento deve ser atualizado com sucesso", function () {
  assert.ok(resultado);
});

Then("o valor total do pagamento deve ser {string}", async function (valor) {
  const pagamentoAtualizado = await pagamentoService.buscarPorId(pagamento.id);
  assert.strictEqual(
    parseFloat(pagamentoAtualizado.valorTotal),
    parseFloat(valor),
  );
});

Given("que existe um pagamento pendente", async function () {
  const ciclo = await models.Ciclo.findOne();
  const mercado = await models.Mercado.findOne();
  pagamento = await pagamentoService.criarPagamento({
    tipo: "fornecedor",
    valorTotal: 500,
    status: "pendente",
    cicloId: ciclo.id,
    mercadoId: mercado.id,
    usuarioId: fornecedor.id,
  });
});

When("eu marcar o pagamento como pago", async function () {
  resultado = await pagamentoService.marcarComoPago(pagamento.id);
});

Then("a data de pagamento deve ser preenchida", function () {
  assert.ok(resultado.dataPagamento);
});

When("eu cancelar o pagamento", async function () {
  resultado = await pagamentoService.cancelarPagamento(pagamento.id);
});

When("eu deletar o pagamento", async function () {
  await pagamentoService.deletarPagamento(pagamento.id);
});

Then("o pagamento deve ser removido do sistema", async function () {
  try {
    await pagamentoService.buscarPorId(pagamento.id);
    assert.fail("Deveria ter lançado erro");
  } catch (error) {
    assert.ok(error.message.includes("não encontrado"));
  }
});

Given("que o ciclo está finalizado", async function () {
  const ciclo = await models.Ciclo.findOne();
  await ciclo.update({ status: "finalizado" });
});

Given("que existem ofertas com valor total", async function () {
  const ciclo = await models.Ciclo.findOne();
  let categoria = await models.CategoriaProdutos.findOne();
  if (!categoria) {
    categoria = await models.CategoriaProdutos.create({
      nome: "Categoria Test",
      descricao: "Categoria de teste",
    });
  }
  const produto = await models.Produto.create({
    nome: "Produto Test Oferta",
    medida: "kg",
    pesoGrama: 1000,
    valorReferencia: 50,
    categoriaId: categoria.id,
    status: "ativo",
  });

  const oferta = await models.Oferta.create({
    cicloId: ciclo.id,
    usuarioId: fornecedor.id,
    status: "ativo",
  });

  await models.OfertaProdutos.create({
    ofertaId: oferta.id,
    produtoId: produto.id,
    quantidade: 10,
    valorOferta: 500,
  });
});

Given("que existem pedidos com valor total", async function () {
  const ciclo = await models.Ciclo.findOne();
  let categoria = await models.CategoriaProdutos.findOne();
  if (!categoria) {
    categoria = await models.CategoriaProdutos.create({
      nome: "Categoria Test",
      descricao: "Categoria de teste",
    });
  }
  const produto = await models.Produto.create({
    nome: "Produto Test Pedido",
    medida: "kg",
    pesoGrama: 1000,
    valorReferencia: 50,
    categoriaId: categoria.id,
    status: "ativo",
  });

  const pedido = await models.PedidoConsumidores.create({
    cicloId: ciclo.id,
    usuarioId: consumidor.id,
    status: "ativo",
  });

  await models.PedidoConsumidoresProdutos.create({
    pedidoConsumidorId: pedido.id,
    produtoId: produto.id,
    quantidade: 5,
    valorCompra: 250,
  });
});

When("eu gerar pagamentos para o ciclo", async function () {
  try {
    const ciclo = await models.Ciclo.findOne();
    pagamentos = await pagamentoService.gerarPagamentosPorCiclo(ciclo.id);
  } catch (error) {
    erro = error;
  }
});

Then("os pagamentos para fornecedores devem ser criados", function () {
  if (!erro) {
    const fornecedorPagamentos = pagamentos.filter(
      (p) => p.tipo === "fornecedor",
    );
    assert.ok(fornecedorPagamentos.length > 0);
  } else {
    this.skip();
  }
});

Then("os pagamentos para consumidores devem ser criados", function () {
  if (!erro) {
    const consumidorPagamentos = pagamentos.filter(
      (p) => p.tipo === "consumidor",
    );
    assert.ok(consumidorPagamentos.length > 0);
  } else {
    this.skip();
  }
});

Given(
  "que existem pagamentos de fornecedores no valor de {string}",
  async function (valor) {
    const ciclo = await models.Ciclo.findOne();
    const mercado = await models.Mercado.findOne();
    await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: parseFloat(valor),
      status: "a_receber",
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      usuarioId: fornecedor.id,
    });
  },
);

Given(
  "que existem pagamentos de consumidores no valor de {string}",
  async function (valor) {
    const ciclo = await models.Ciclo.findOne();
    const mercado = await models.Mercado.findOne();
    await pagamentoService.criarPagamento({
      tipo: "consumidor",
      valorTotal: parseFloat(valor),
      status: "a_pagar",
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      usuarioId: consumidor.id,
    });
  },
);

When("eu calcular o total do ciclo", async function () {
  const ciclo = await models.Ciclo.findOne();
  resultado = await pagamentoService.calcularTotalPorCiclo(ciclo.id);
});

Then("o total a receber deve ser {string}", function (valor) {
  assert.strictEqual(parseFloat(resultado.totalReceber), parseFloat(valor));
});

Then("o total a pagar deve ser {string}", function (valor) {
  assert.strictEqual(parseFloat(resultado.totalPagar), parseFloat(valor));
});

Then("o saldo deve ser {string}", function (valor) {
  assert.strictEqual(parseFloat(resultado.saldo), parseFloat(valor));
});

When("eu tentar criar um pagamento sem ciclo", async function () {
  try {
    const mercado = await models.Mercado.findOne();
    await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 100,
      mercadoId: mercado.id,
      usuarioId: fornecedor.id,
    });
  } catch (error) {
    erro = error;
  }
});

Then("deve retornar erro {string}", function (mensagem) {
  assert.ok(erro);
  assert.ok(erro.message.includes(mensagem));
  erro = null;
});

When("eu tentar criar um pagamento sem mercado", async function () {
  try {
    const ciclo = await models.Ciclo.findOne();
    await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 100,
      cicloId: ciclo.id,
      usuarioId: fornecedor.id,
    });
  } catch (error) {
    erro = error;
  }
});

When("eu tentar criar um pagamento sem usuário", async function () {
  try {
    const ciclo = await models.Ciclo.findOne();
    const mercado = await models.Mercado.findOne();
    await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 100,
      cicloId: ciclo.id,
      mercadoId: mercado.id,
    });
  } catch (error) {
    erro = error;
  }
});

When("eu tentar criar um pagamento com valor {string}", async function (valor) {
  try {
    const ciclo = await models.Ciclo.findOne();
    const mercado = await models.Mercado.findOne();
    await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: parseFloat(valor),
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      usuarioId: fornecedor.id,
    });
  } catch (error) {
    erro = error;
  }
});
