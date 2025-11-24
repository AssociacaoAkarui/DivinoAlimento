const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const Factories = require("./support/factories");
const {
  ComposicaoService,
  CicloService,
  CestaService,
  ProdutoService,
  PontoEntregaService,
} = require("../../src/services/services");

const composicaoService = new ComposicaoService();
const cicloService = new CicloService();
const cestaService = new CestaService();
const produtoService = new ProdutoService();
const pontoEntregaService = new PontoEntregaService();

let cicloAtivo;
let cestaDaComposicao;
let novaComposicao = {};
let composicaoCriada;
let composicaoEncontrada;
let produtoDaComposicao;
let quantidadeProduto;
let quantidadePorCesta;
let quantidadeTotalNecessaria;
let quantidadeDisponivel;
let alertaFalta;
let listaComposicoes;

Given("que existe uma cesta {string} cadastrada", async function (nomeCesta) {
  const cestaData = Factories.CestaFactory.create({ nome: nomeCesta });
  cestaDaComposicao = await cestaService.criarCesta(cestaData);
});

Given("que existe um ciclo ativo para composições", async function () {
  const pontoEntregaData = Factories.PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = Factories.CicloFactory.create({
    pontoEntregaId: pontoEntrega.id,
    status: "oferta",
  });
  cicloAtivo = await cicloService.criarCiclo(cicloData);
});

When("eu crio uma composição para a cesta no ciclo", async function () {
  if (!cestaDaComposicao) {
    const cestaData = Factories.CestaFactory.create({ nome: "Cesta Básica" });
    cestaDaComposicao = await cestaService.criarCesta(cestaData);
  }
  novaComposicao = {
    cicloId: cicloAtivo.id,
    cestaId: cestaDaComposicao.id,
  };
});

When("eu salvo a nova composição", async function () {
  composicaoCriada = await composicaoService.criarComposicao(novaComposicao);
});

Then("a composição deve ser criada com sucesso", async function () {
  const composicaoDoBD = await composicaoService.buscarComposicaoPorId(
    composicaoCriada.id,
  );
  expect(composicaoCriada).to.be.an("object");
  expect(composicaoDoBD.cicloCesta.cicloId).to.equal(cicloAtivo.id);
  expect(composicaoDoBD.cicloCesta.cestaId).to.equal(cestaDaComposicao.id);
});

Given("que existe uma composição cadastrada", async function () {
  const pontoEntregaData = Factories.PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = Factories.CicloFactory.create({
    pontoEntregaId: pontoEntrega.id,
    status: "oferta",
  });
  cicloAtivo = await cicloService.criarCiclo(cicloData);
  const cestaData = Factories.CestaFactory.create();
  cestaDaComposicao = await cestaService.criarCesta(cestaData);

  composicaoCriada = await composicaoService.criarComposicao({
    cicloId: cicloAtivo.id,
    cestaId: cestaDaComposicao.id,
  });
});

When("eu solicito os detalhes da composição", async function () {
  composicaoEncontrada = await composicaoService.buscarComposicaoPorId(
    composicaoCriada.id,
  );
});

Then(
  "eu devo ver o ciclo, a cesta e os produtos da composição",
  async function () {
    expect(composicaoEncontrada).to.be.an("object");
    expect(composicaoEncontrada.cicloCesta.ciclo.id).to.equal(cicloAtivo.id);
    expect(composicaoEncontrada.cicloCesta.cesta.id).to.equal(
      cestaDaComposicao.id,
    );
  },
);

Given("que existe uma composição de cesta", async function () {
  const pontoEntregaData = Factories.PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = Factories.CicloFactory.create({
    pontoEntregaId: pontoEntrega.id,
    status: "oferta",
  });
  cicloAtivo = await cicloService.criarCiclo(cicloData);
  cestaDaComposicao = await cestaService.criarCesta(
    Factories.CestaFactory.create(),
  );
  composicaoCriada = await composicaoService.criarComposicao({
    cicloId: cicloAtivo.id,
    cestaId: cestaDaComposicao.id,
  });
});

Given(
  "que existe um produto {string} disponível",
  async function (nomeProduto) {
    const produtoData = Factories.ProdutoFactory.create({ nome: nomeProduto });
    produtoDaComposicao = await produtoService.criarProduto(produtoData);
  },
);

When(
  "eu adiciono o produto {string} à composição",
  async function (nomeProduto) {},
);

When("defino a quantidade do produto como {int}", function (quantidade) {
  quantidadeProduto = quantidade;
});

When("eu salvo o produto na composição", async function () {
  const produtos = [
    {
      produtoId: produtoDaComposicao.id,
      quantidade: quantidadeProduto,
    },
  ];
  await composicaoService.sincronizarProdutos(composicaoCriada.id, produtos);
});

Then(
  "o produto {string} deve estar na composição",
  async function (nomeProduto) {
    const composicaoDoBD = await composicaoService.buscarComposicaoPorId(
      composicaoCriada.id,
    );
    const produtosNaComposicao = composicaoDoBD.composicaoOfertaProdutos.map(
      (p) => p.produto.nome,
    );
    expect(produtosNaComposicao).to.include(nomeProduto);
  },
);

Given(
  "que existe uma composição com produto {string} e quantidade {int}",
  async function (nomeProduto, quantidade) {
    const pontoEntregaData = Factories.PontoEntregaFactory.create();
    const pontoEntrega =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
    const cicloData = Factories.CicloFactory.create({
      pontoEntregaId: pontoEntrega.id,
    });
    cicloAtivo = await cicloService.criarCiclo(cicloData);
    cestaDaComposicao = await cestaService.criarCesta(
      Factories.CestaFactory.create(),
    );
    composicaoCriada = await composicaoService.criarComposicao({
      cicloId: cicloAtivo.id,
      cestaId: cestaDaComposicao.id,
    });
    const produtoData = Factories.ProdutoFactory.create({ nome: nomeProduto });
    produtoDaComposicao = await produtoService.criarProduto(produtoData);
    await composicaoService.sincronizarProdutos(composicaoCriada.id, [
      { produtoId: produtoDaComposicao.id, quantidade: quantidade },
    ]);
    quantidadeProduto = quantidade;
  },
);

When(
  "eu edito a quantidade do produto na composição para {int}",
  function (novaQuantidade) {
    quantidadeProduto = novaQuantidade;
  },
);

When("salvo as alterações da composição", async function () {
  await composicaoService.sincronizarProdutos(composicaoCriada.id, [
    { produtoId: produtoDaComposicao.id, quantidade: quantidadeProduto },
  ]);
});

Then(
  "a quantidade de {string} na composição deve ser {int}",

  async function (nomeProduto, quantidadeEsperada) {
    const composicaoDoBD = await composicaoService.buscarComposicaoPorId(
      composicaoCriada.id,
    );

    const produtoNaComposicao = composicaoDoBD.composicaoOfertaProdutos.find(
      (p) => p.produto.nome === nomeProduto,
    );

    expect(produtoNaComposicao).to.exist;

    expect(produtoNaComposicao.quantidade).to.equal(quantidadeEsperada);
  },
);

Given(
  "que existe uma composição com produto {string}",

  async function (nomeProduto) {
    const pontoEntregaData = Factories.PontoEntregaFactory.create();
    const pontoEntrega =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
    const cicloData = Factories.CicloFactory.create({
      pontoEntregaId: pontoEntrega.id,
    });
    cicloAtivo = await cicloService.criarCiclo(cicloData);
    cestaDaComposicao = await cestaService.criarCesta(
      Factories.CestaFactory.create(),
    );

    composicaoCriada = await composicaoService.criarComposicao({
      cicloId: cicloAtivo.id,

      cestaId: cestaDaComposicao.id,
    });

    const produtoData = Factories.ProdutoFactory.create({ nome: nomeProduto });

    produtoDaComposicao = await produtoService.criarProduto(produtoData);

    await composicaoService.sincronizarProdutos(composicaoCriada.id, [
      { produtoId: produtoDaComposicao.id, quantidade: 5 },
    ]);
  },
);

Then(
  "o produto {string} não deve mais estar na composição",
  async function (nomeProduto) {
    const composicaoDoBD = await composicaoService.buscarComposicaoPorId(
      composicaoCriada.id,
    );
    const produtosNaComposicao = composicaoDoBD.composicaoOfertaProdutos.map(
      (p) => p.produto.nome,
    );
    expect(produtosNaComposicao).to.not.include(nomeProduto);
  },
);

Given(
  "que existe uma composição com {int} cestas",
  async function (numeroCestas) {
    const pontoEntregaData = Factories.PontoEntregaFactory.create();
    const pontoEntrega =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
    const cicloData = Factories.CicloFactory.create({
      pontoEntregaId: pontoEntrega.id,
    });
    cicloAtivo = await cicloService.criarCiclo(cicloData);
    cestaDaComposicao = await cestaService.criarCesta(
      Factories.CestaFactory.create(),
    );
    composicaoCriada = await composicaoService.criarComposicao({
      cicloId: cicloAtivo.id,
      cestaId: cestaDaComposicao.id,
      quantidadeCestas: numeroCestas,
    });
  },
);

Given(
  "o produto {string} tem quantidade {int}",
  async function (nomeProduto, quantidade) {
    const produtoData = Factories.ProdutoFactory.create({ nome: nomeProduto });
    produtoDaComposicao = await produtoService.criarProduto(produtoData);
    await composicaoService.sincronizarProdutos(composicaoCriada.id, [
      { produtoId: produtoDaComposicao.id, quantidade: quantidade },
    ]);
    quantidadeProduto = quantidade;
  },
);

When("eu calculo a quantidade total necessária", async function () {
  quantidadePorCesta = await composicaoService.calcularQuantidadePorCesta(
    composicaoCriada.id,
    produtoDaComposicao.id,
  );
});

Then(
  "a quantidade por cesta de {string} deve ser {int}",
  function (nomeProduto, quantidadeEsperada) {
    expect(quantidadePorCesta).to.equal(quantidadeEsperada);
  },
);

Given("a quantidade total necessária é {int} unidades", function (quantidade) {
  quantidadeTotalNecessaria = quantidade;
});

Given(
  "as ofertas disponíveis somam apenas {int} unidades",
  function (quantidade) {
    quantidadeDisponivel = quantidade;
  },
);

When("eu valido a disponibilidade", async function () {
  alertaFalta = await composicaoService.validarDisponibilidade(
    quantidadeDisponivel,
    quantidadeTotalNecessaria,
  );
});

Then("o sistema deve alertar sobre a falta", function () {
  expect(alertaFalta).to.not.be.null;
  expect(alertaFalta).to.have.property("mensagem");
  expect(alertaFalta.falta).to.be.greaterThan(0);
});

Given("que existem múltiplas composições em um ciclo", async function () {
  const pontoEntregaData = Factories.PontoEntregaFactory.create();
  const pontoEntrega =
    await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  const cicloData = Factories.CicloFactory.create({
    pontoEntregaId: pontoEntrega.id,
  });
  cicloAtivo = await cicloService.criarCiclo(cicloData);
  const cesta1Data = Factories.CestaFactory.create({ nome: "Cesta Básica" });
  const cesta2Data = Factories.CestaFactory.create({ nome: "Cesta Premium" });
  const cesta1 = await cestaService.criarCesta(cesta1Data);
  const cesta2 = await cestaService.criarCesta(cesta2Data);

  const comp1 = await composicaoService.criarComposicao({
    cicloId: cicloAtivo.id,
    cestaId: cesta1.id,
  });
  const comp2 = await composicaoService.criarComposicao({
    cicloId: cicloAtivo.id,
    cestaId: cesta2.id,
  });

  const produto1 = await produtoService.criarProduto(
    Factories.ProdutoFactory.create({ nome: "Arroz" }),
  );
  const produto2 = await produtoService.criarProduto(
    Factories.ProdutoFactory.create({ nome: "Feijão" }),
  );

  await composicaoService.sincronizarProdutos(comp1.id, [
    { produtoId: produto1.id, quantidade: 5 },
    { produtoId: produto2.id, quantidade: 3 },
  ]);
  await composicaoService.sincronizarProdutos(comp2.id, [
    { produtoId: produto1.id, quantidade: 10 },
  ]);
});

When("eu solicito todas as composições do ciclo", async function () {
  listaComposicoes = await composicaoService.listarComposicoesPorCiclo(
    cicloAtivo.id,
  );
});

Then("eu devo ver todas as composições, produtos e quantidade", function () {
  expect(listaComposicoes).to.be.an("array");
  expect(listaComposicoes.length).to.be.greaterThan(0);

  listaComposicoes.forEach((cicloCesta) => {
    expect(cicloCesta).to.have.property("composicoes");
    expect(cicloCesta.composicoes).to.be.an("array");

    cicloCesta.composicoes.forEach((composicao) => {
      expect(composicao).to.have.property("composicaoOfertaProdutos");

      composicao.composicaoOfertaProdutos.forEach((ofertaProduto) => {
        expect(ofertaProduto).to.have.property("produto");
        expect(ofertaProduto).to.have.property("quantidade");
        expect(ofertaProduto.quantidade).to.be.a("number");
      });
    });
  });
});
