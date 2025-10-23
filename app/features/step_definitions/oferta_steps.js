const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const { expect } = require("chai");
const {
  CicloFactory,
  UsuarioFactory,
  PontoEntregaFactory,
  ProdutoFactory,
  CestaFactory,
} = require("./support/factories");
const {
  OfertaService,
  CicloService,
  ProdutoService,
  ComposicaoService,
  PontoEntregaService,
} = require("../../src/services/services");
const ofertaService = new OfertaService();
const cicloService = new CicloService();
const produtoService = new ProdutoService();
const composicaoService = new ComposicaoService();
const pontoEntregaService = new PontoEntregaService();

const { Usuario } = require("../../models");

Given("que existe um ciclo para ofertas", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  this.ciclo = await cicloService.criarCiclo(cicloData);
});

Given("que existe um fornecedor", async function () {
  const fornecedorData = UsuarioFactory.create("fornecedor");
  this.fornecedor = await Usuario.create(fornecedorData);
});

When("eu crio uma oferta para o ciclo e fornecedor", async function () {
  try {
    this.oferta = await ofertaService.criarOferta({
      cicloId: this.ciclo.id,
      usuarioId: this.fornecedor.id,
    });
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then("a oferta deve ser criada com sucesso", function () {
  assert.ok(this.oferta.id, "A oferta deveria ter um ID");
  assert.strictEqual(this.oferta.cicloId, this.ciclo.id);
  assert.strictEqual(this.oferta.usuarioId, this.fornecedor.id);
  assert.strictEqual(
    this.error,
    null,
    "Não deveria haver erro ao criar a oferta",
  );
});

Given("que existe uma oferta ativa", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  const ciclo = await cicloService.criarCiclo(cicloData);
  const fornecedorData = UsuarioFactory.create("fornecedor");
  const fornecedor = await Usuario.create(fornecedorData);
  this.oferta = await ofertaService.criarOferta({
    cicloId: ciclo.id,
    usuarioId: fornecedor.id,
  });
  assert.ok(this.oferta, "A oferta não foi criada");
});

Given(
  "que existe um produto {string} cadastrado",
  async function (nomeProduto) {
    const produtoData = ProdutoFactory.create({ nome: nomeProduto });
    this.produto = await produtoService.criarProduto(produtoData);
    assert.ok(this.produto, "O produto não foi criado");
  },
);

When("eu adiciono o produto {string} à oferta", async function (nomeProduto) {
  assert.strictEqual(this.produto.nome, nomeProduto);
  this.produtoAdicionado = this.produto;
});

When(
  "defino a quantidade do produto na oferta como {int}",
  async function (quantidade) {
    this.quantidadeAdicionada = quantidade;
  },
);

When("eu salvo o produto na oferta", async function () {
  try {
    this.resultadoAdicao = await ofertaService.adicionarProduto(
      this.oferta.id,
      this.produtoAdicionado.id,
      this.quantidadeAdicionada,
    );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "o produto {string} deve estar associado à oferta",
  async function (nomeProduto) {
    assert.strictEqual(
      this.error,
      null,
      "Não deveria haver erro ao salvar o produto na oferta",
    );

    const ofertaAtualizada = await ofertaService.buscarOfertaPorIdComProdutos(
      this.oferta.id,
    );

    const produtoOfertado = ofertaAtualizada.ofertaProdutos.find(
      (op) => op.produto.nome === nomeProduto,
    );

    assert.ok(
      produtoOfertado,
      `Produto "${nomeProduto}" não encontrado na oferta.`,
    );
    assert.strictEqual(
      produtoOfertado.quantidade,
      this.quantidadeAdicionada,
      "A quantidade do produto na oferta está incorreta.",
    );
  },
);

Given(
  "que existe um produto {string} em uma oferta",
  async function (nomeProduto) {
    const pontoEntregaData = PontoEntregaFactory.create();
    const pontoEntrega =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
    const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
    const ciclo = await cicloService.criarCiclo(cicloData);
    const fornecedorData = UsuarioFactory.create("fornecedor");
    const fornecedor = await Usuario.create(fornecedorData);
    const oferta = await ofertaService.criarOferta({
      cicloId: ciclo.id,
      usuarioId: fornecedor.id,
    });

    const produtoData = ProdutoFactory.create({ nome: nomeProduto });
    const produto = await produtoService.criarProduto(produtoData);

    this.produtoOfertado = await ofertaService.adicionarProduto(
      oferta.id,
      produto.id,
      10,
    );
    this.produtoOriginal = produto;
  },
);

When("eu solicito os detalhes do produto ofertado", async function () {
  // Este step é mais narrativo, a verificação ocorre no 'Then'
  // Apenas garantimos que temos o objeto para verificar
  assert.ok(this.produtoOfertado, "Produto ofertado não foi definido no Given");
});

Then("eu devo ver quantidade, medida e valor de referência", async function () {
  const oferta = await ofertaService.buscarOfertaPorIdComProdutos(
    this.produtoOfertado.ofertaId,
  );
  const produtoNaOferta = oferta.ofertaProdutos.find(
    (op) => op.produtoId === this.produtoOriginal.id,
  );

  assert.ok(produtoNaOferta, "Produto não encontrado na oferta atualizada");
  assert.strictEqual(
    produtoNaOferta.quantidade,
    this.produtoOfertado.quantidade,
  );
  assert.strictEqual(
    produtoNaOferta.produto.medida,
    this.produtoOriginal.medida,
  );
  assert.strictEqual(
    produtoNaOferta.produto.valorReferencia,
    this.produtoOriginal.valorReferencia,
  );
});

Given(
  "que existe um produto ofertado com quantidade {int}",
  async function (quantidadeInicial) {
    const pontoEntregaData = PontoEntregaFactory.create();
    const pontoEntrega =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
    const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
    const ciclo = await cicloService.criarCiclo(cicloData);
    this.cicloId = ciclo.id;
    const fornecedorData = UsuarioFactory.create("fornecedor");
    const fornecedor = await Usuario.create(fornecedorData);
    const oferta = await ofertaService.criarOferta({
      cicloId: ciclo.id,
      usuarioId: fornecedor.id,
    });
    const produtoData = ProdutoFactory.create();
    const produto = await produtoService.criarProduto(produtoData);
    this.produtoOfertado = await ofertaService.adicionarProduto(
      oferta.id,
      produto.id,
      quantidadeInicial,
    );
  },
);

When("eu edito a quantidade para {int}", async function (novaQuantidade) {
  this.novaQuantidade = novaQuantidade;
});

When("salvo as alterações do produto ofertado", async function () {
  try {
    await ofertaService.atualizarQuantidadeProduto(
      this.produtoOfertado.id,
      this.novaQuantidade,
    );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "a quantidade do produto ofertado deve ser {int}",
  async function (quantidadeEsperada) {
    assert.strictEqual(
      this.error,
      null,
      "Ocorreu um erro ao atualizar a quantidade.",
    );
    const oferta = await ofertaService.buscarOfertaPorIdComProdutos(
      this.produtoOfertado.ofertaId,
    );
    const produtoNaOferta = oferta.ofertaProdutos.find(
      (op) => op.id === this.produtoOfertado.id,
    );
    assert.strictEqual(produtoNaOferta.quantidade, quantidadeEsperada);
  },
);

Given(
  "que não existem composições para este produto ofertado",
  async function () {
    // Este step é narrativo por enquanto, a lógica de composição é complexa
    // e será testada em sua própria feature. A remoção deve funcionar
    // independentemente, mas a regra de negócio pode impedir em outro nível.
    assert.ok(
      this.produtoOfertado,
      "O produto ofertado deve existir para este step.",
    );
  },
);

When("eu removo o produto da oferta", async function () {
  try {
    await ofertaService.removerProduto(this.produtoOfertado.id);
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "o produto {string} não deve mais estar na oferta",
  async function (nomeProduto) {
    assert.strictEqual(
      this.error,
      null,
      "Ocorreu um erro ao remover o produto.",
    );
    const oferta = await ofertaService.buscarOfertaPorIdComProdutos(
      this.produtoOfertado.ofertaId,
    );
    const produtoNaOferta = oferta.ofertaProdutos.find(
      (op) => op.produto.nome === nomeProduto,
    );
    assert.strictEqual(
      produtoNaOferta,
      undefined,
      `O produto "${nomeProduto}" ainda foi encontrado na oferta.`,
    );
  },
);

Given(
  "existem composições que somam {int} unidades",
  async function (somaComposicoes) {
    const cesta = await CestaFactory.create();
    const composicao = await composicaoService.criarComposicao({
      cicloId: this.cicloId,
      cestaId: cesta.id,
    });

    await composicaoService.sincronizarProdutos(composicao.id, [
      {
        produtoId: this.produtoOfertado.produtoId,
        quantidade: somaComposicoes,
        ofertaProdutoId: this.produtoOfertado.id,
      },
    ]);
  },
);

When("eu verifico a quantidade disponível", async function () {
  try {
    this.quantidadeDisponivel =
      await ofertaService.calcularDisponibilidadeProduto(
        this.produtoOfertado.id,
      );
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "a quantidade disponível deve ser {int}",
  async function (quantidadeEsperada) {
    assert.strictEqual(
      this.error,
      null,
      "Ocorreu um erro ao verificar a disponibilidade.",
    );

    assert.strictEqual(this.quantidadeDisponivel, quantidadeEsperada);
  },
);

Given("que existe uma oferta com múltiplos produtos", async function () {
  const pontoEntregaData = PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = CicloFactory.create({ pontoEntregaId: pontoEntrega.id });
  const ciclo = await cicloService.criarCiclo(cicloData);
  const fornecedorData = UsuarioFactory.create("fornecedor");
  const fornecedor = await Usuario.create(fornecedorData);
  this.oferta = await ofertaService.criarOferta({
    cicloId: ciclo.id,
    usuarioId: fornecedor.id,
  });

  const produto1 = await produtoService.criarProduto(ProdutoFactory.create());
  const produto2 = await produtoService.criarProduto(ProdutoFactory.create());

  await ofertaService.adicionarProduto(this.oferta.id, produto1.id, 10);
  await ofertaService.adicionarProduto(this.oferta.id, produto2.id, 20);

  this.numeroDeProdutosEsperado = 2;
});

When("eu solicito todos os produtos da oferta", async function () {
  try {
    const ofertaCompleta = await ofertaService.buscarOfertaPorIdComProdutos(
      this.oferta.id,
    );
    this.listaDeProdutosOfertados = ofertaCompleta.ofertaProdutos;
    this.error = null;
  } catch (error) {
    this.error = error;
  }
});

Then("eu devo ver a lista completa de produtos ofertados", function () {
  assert.strictEqual(
    this.error,
    null,
    "Ocorreu um erro ao buscar os produtos da oferta.",
  );
  expect(this.listaDeProdutosOfertados).to.be.an(
    "array",
    "A lista de produtos não é um array.",
  );
  expect(this.listaDeProdutosOfertados).to.have.lengthOf(
    this.numeroDeProdutosEsperado,
    "O número de produtos na lista está incorreto.",
  );
});
