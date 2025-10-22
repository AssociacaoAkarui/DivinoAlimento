const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const Factories = require("./support/factories");
const models = require("../../models");
const { ComposicaoService } = require("../../src/services/services");

const composicaoService = new ComposicaoService();

let cicloAtivo;
let cestaDaComposicao;
let novaComposicao = {};
let composicaoCriada;

Given("que existe um ciclo ativo", async function () {
  const pontoEntrega = await models.PontoEntrega.create(
    Factories.PontoEntregaFactory.create(),
  );
  const cicloData = Factories.CicloFactory.create({
    pontoEntregaId: pontoEntrega.id,
    status: "oferta",
  });
  cicloAtivo = await models.Ciclo.create(cicloData);
});

When("eu crio uma composição para a cesta no ciclo", async function () {
  cestaDaComposicao = await models.Cesta.findOne({
    where: { nome: "Cesta Básica" },
  });
  novaComposicao = {
    cicloId: cicloAtivo.id,
    cestaId: cestaDaComposicao.id,
  };
});

When("eu salvo a nova composição", async function () {
  composicaoCriada = await composicaoService.criarComposicao(novaComposicao);
});

Then("a composição deve ser criada com sucesso", async function () {
  const composicaoDoBD = await models.Composicoes.findByPk(
    composicaoCriada.id,
    {
      include: [{ model: models.CicloCestas, as: "cicloCesta" }],
    },
  );
  expect(composicaoCriada).to.be.an("object");
  expect(composicaoDoBD.cicloCesta.cicloId).to.equal(cicloAtivo.id);
  expect(composicaoDoBD.cicloCesta.cestaId).to.equal(cestaDaComposicao.id);
});

Given("que existe uma composição cadastrada", async function () {
  const pontoEntrega = await models.PontoEntrega.create(
    Factories.PontoEntregaFactory.create(),
  );
  const cicloData = Factories.CicloFactory.create({
    pontoEntregaId: pontoEntrega.id,
    status: "oferta",
  });
  cicloAtivo = await models.Ciclo.create(cicloData);

  const cestaData = Factories.CestaFactory.create();
  cestaDaComposicao = await models.Cesta.create(cestaData);

  const cicloCesta = await models.CicloCestas.create({
    cicloId: cicloAtivo.id,
    cestaId: cestaDaComposicao.id,
    quantidadeCestas: 1,
  });

  composicaoCriada = await models.Composicoes.create({
    cicloCestaId: cicloCesta.id,
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

let produtoDaComposicao;
let quantidadeProduto;
let quantidadePorCesta;
let quantidadeTotalNecessaria;
let quantidadeDisponivel;
let alertaFalta;
let listaComposicoes;

Given("que existe uma composição de cesta", async function () {
  const pontoEntrega = await models.PontoEntrega.create(
    Factories.PontoEntregaFactory.create(),
  );
  const cicloData = Factories.CicloFactory.create({
    pontoEntregaId: pontoEntrega.id,
    status: "oferta",
  });
  cicloAtivo = await models.Ciclo.create(cicloData);
  const cestaData = Factories.CestaFactory.create();
  cestaDaComposicao = await models.Cesta.create(cestaData);
  const cicloCesta = await models.CicloCestas.create({
    cicloId: cicloAtivo.id,
    cestaId: cestaDaComposicao.id,
  });
  composicaoCriada = await models.Composicoes.create({
    cicloCestaId: cicloCesta.id,
  });
});

Given(
  "que existe um produto {string} disponível",
  async function (nomeProduto) {
    const produtoData = Factories.ProdutoFactory.create({ nome: nomeProduto });
    produtoDaComposicao = await models.Produto.create(produtoData);
  },
);

When(
  "eu adiciono o produto {string} à composição",
  async function (nomeProduto) {
    produtoDaComposicao = await models.Produto.findOne({
      where: { nome: nomeProduto },
    });
  },
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
    const composicaoDoBD = await models.Composicoes.findByPk(
      composicaoCriada.id,
      {
        include: [
          {
            model: models.ComposicaoOfertaProdutos,
            as: "composicaoOfertaProdutos",
            include: ["produto"],
          },
        ],
      },
    );
    const produtosNaComposicao = composicaoDoBD.composicaoOfertaProdutos.map(
      (p) => p.produto.nome,
    );
    const quantidadesNaComposicao = composicaoDoBD.composicaoOfertaProdutos.map(
      (p) => p.quantidade,
    );

    expect(produtosNaComposicao).to.include(nomeProduto);
    expect(quantidadesNaComposicao).to.include(quantidadeProduto);
  },
);

Given(
  "que existe uma composição com produto {string} e quantidade {int}",
  async function (nomeProduto, quantidade) {
    const pontoEntrega = await models.PontoEntrega.create(
      Factories.PontoEntregaFactory.create(),
    );
    const cicloData = Factories.CicloFactory.create({
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });
    cicloAtivo = await models.Ciclo.create(cicloData);

    const cestaData = Factories.CestaFactory.create();
    cestaDaComposicao = await models.Cesta.create(cestaData);

    const cicloCesta = await models.CicloCestas.create({
      cicloId: cicloAtivo.id,
      cestaId: cestaDaComposicao.id,
      quantidadeCestas: 1,
    });

    composicaoCriada = await models.Composicoes.create({
      cicloCestaId: cicloCesta.id,
    });

    const produtoData = Factories.ProdutoFactory.create({ nome: nomeProduto });
    produtoDaComposicao = await models.Produto.create(produtoData);

    await models.ComposicaoOfertaProdutos.create({
      composicaoId: composicaoCriada.id,
      produtoId: produtoDaComposicao.id,
      quantidade: quantidade,
    });

    quantidadeProduto = quantidade;
  },
);

When(
  "eu edito a quantidade do produto na composição para {int}",
  async function (novaQuantidade) {
    quantidadeProduto = novaQuantidade;
  },
);

When("salvo as alterações da composição", async function () {
  const produtos = [
    {
      produtoId: produtoDaComposicao.id,
      quantidade: quantidadeProduto,
    },
  ];
  await composicaoService.sincronizarProdutos(composicaoCriada.id, produtos);
});

Then(
  "a quantidade de {string} na composição deve ser {int}",
  async function (nomeProduto, quantidadeEsperada) {
    const composicaoDoBD = await models.Composicoes.findByPk(
      composicaoCriada.id,
      {
        include: [
          {
            model: models.ComposicaoOfertaProdutos,
            as: "composicaoOfertaProdutos",
            include: ["produto"],
          },
        ],
      },
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
    const pontoEntrega = await models.PontoEntrega.create(
      Factories.PontoEntregaFactory.create(),
    );
    const cicloData = Factories.CicloFactory.create({
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });
    cicloAtivo = await models.Ciclo.create(cicloData);

    const cestaData = Factories.CestaFactory.create();
    cestaDaComposicao = await models.Cesta.create(cestaData);

    const cicloCesta = await models.CicloCestas.create({
      cicloId: cicloAtivo.id,
      cestaId: cestaDaComposicao.id,
      quantidadeCestas: 1,
    });

    composicaoCriada = await models.Composicoes.create({
      cicloCestaId: cicloCesta.id,
    });

    const produtoData = Factories.ProdutoFactory.create({ nome: nomeProduto });
    produtoDaComposicao = await models.Produto.create(produtoData);

    await models.ComposicaoOfertaProdutos.create({
      composicaoId: composicaoCriada.id,
      produtoId: produtoDaComposicao.id,
      quantidade: 5,
    });
  },
);

Then(
  "o produto {string} não deve mais estar na composição",
  async function (nomeProduto) {
    const composicaoDoBD = await models.Composicoes.findByPk(
      composicaoCriada.id,
      {
        include: [
          {
            model: models.ComposicaoOfertaProdutos,
            as: "composicaoOfertaProdutos",
            include: ["produto"],
          },
        ],
      },
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
    const pontoEntrega = await models.PontoEntrega.create(
      Factories.PontoEntregaFactory.create(),
    );
    const cicloData = Factories.CicloFactory.create({
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });
    cicloAtivo = await models.Ciclo.create(cicloData);

    const cestaData = Factories.CestaFactory.create();
    cestaDaComposicao = await models.Cesta.create(cestaData);

    const cicloCesta = await models.CicloCestas.create({
      cicloId: cicloAtivo.id,
      cestaId: cestaDaComposicao.id,
      quantidadeCestas: numeroCestas,
    });

    composicaoCriada = await models.Composicoes.create({
      cicloCestaId: cicloCesta.id,
    });
  },
);

Given(
  "o produto {string} tem quantidade {int}",
  async function (nomeProduto, quantidade) {
    const produtoData = Factories.ProdutoFactory.create({ nome: nomeProduto });
    produtoDaComposicao = await models.Produto.create(produtoData);

    await models.ComposicaoOfertaProdutos.create({
      composicaoId: composicaoCriada.id,
      produtoId: produtoDaComposicao.id,
      quantidade: quantidade,
    });

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
  async function (nomeProduto, quantidadeEsperada) {
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
  const pontoEntrega = await models.PontoEntrega.create(
    Factories.PontoEntregaFactory.create(),
  );
  const cicloData = Factories.CicloFactory.create({
    pontoEntregaId: pontoEntrega.id,
    status: "oferta",
  });
  cicloAtivo = await models.Ciclo.create(cicloData);

  const cesta1 = await models.Cesta.create(
    Factories.CestaFactory.create({ nome: "Cesta Básica" }),
  );
  const cesta2 = await models.Cesta.create(
    Factories.CestaFactory.create({ nome: "Cesta Premium" }),
  );
  const cesta3 = await models.Cesta.create(
    Factories.CestaFactory.create({ nome: "Cesta Vegana" }),
  );

  const cicloCesta1 = await models.CicloCestas.create({
    cicloId: cicloAtivo.id,
    cestaId: cesta1.id,
    quantidadeCestas: 10,
  });

  const cicloCesta2 = await models.CicloCestas.create({
    cicloId: cicloAtivo.id,
    cestaId: cesta2.id,
    quantidadeCestas: 5,
  });

  const cicloCesta3 = await models.CicloCestas.create({
    cicloId: cicloAtivo.id,
    cestaId: cesta3.id,
    quantidadeCestas: 8,
  });

  const comp1 = await models.Composicoes.create({
    cicloCestaId: cicloCesta1.id,
  });
  const comp2 = await models.Composicoes.create({
    cicloCestaId: cicloCesta2.id,
  });
  const comp3 = await models.Composicoes.create({
    cicloCestaId: cicloCesta3.id,
  });

  const produto1 = await models.Produto.create(
    Factories.ProdutoFactory.create({ nome: "Arroz" }),
  );
  const produto2 = await models.Produto.create(
    Factories.ProdutoFactory.create({ nome: "Feijão" }),
  );
  const produto3 = await models.Produto.create(
    Factories.ProdutoFactory.create({ nome: "Maçã" }),
  );

  await models.ComposicaoOfertaProdutos.create({
    composicaoId: comp1.id,
    produtoId: produto1.id,
    quantidade: 50,
  });

  await models.ComposicaoOfertaProdutos.create({
    composicaoId: comp1.id,
    produtoId: produto2.id,
    quantidade: 30,
  });

  await models.ComposicaoOfertaProdutos.create({
    composicaoId: comp2.id,
    produtoId: produto1.id,
    quantidade: 25,
  });

  await models.ComposicaoOfertaProdutos.create({
    composicaoId: comp2.id,
    produtoId: produto3.id,
    quantidade: 40,
  });

  await models.ComposicaoOfertaProdutos.create({
    composicaoId: comp3.id,
    produtoId: produto3.id,
    quantidade: 60,
  });
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
