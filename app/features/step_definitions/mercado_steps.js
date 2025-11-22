const { Before, Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const { MercadoService } = require("../../src/services/services");
const { Usuario } = require("../../models");
const ServiceError = require("../../src/utils/ServiceError");

const mercadoService = new MercadoService();

Before(function () {
  this.mercadoData = {};
  this.currentMercado = null;
  this.usuarios = {};
  this.mercados = {};
  this.result = null;
  this.error = null;
});

Given("que eu quero criar um novo mercado tipo Cesta", function () {
  this.mercadoData = { tipo: "cesta", status: "ativo" };
});

Given("que eu quero criar um novo mercado tipo Lote", function () {
  this.mercadoData = { tipo: "lote", status: "ativo" };
});

Given("que eu quero criar um novo mercado tipo Venda Direta", function () {
  this.mercadoData = { tipo: "venda_direta", status: "ativo" };
});

Given("que eu quero criar um novo Mercado", function () {
  this.mercadoData = { status: "ativo" };
});

Given("exista um usuário cadastrado com nome {string}", async function (nome) {
  if (!this.usuarios[nome]) {
    const usuario = await Usuario.create({
      nome,
      email: `${nome.toLowerCase().replace(/\s/g, "")}@test.com`,
      senha: "senha123",
      perfis: ["admin"],
      status: "ativo",
    });
    this.usuarios[nome] = usuario;
  }
});

When("eu preencho o nome do mercado com {string}", function (nome) {
  this.mercadoData.nome = nome;
});

When("o tipo do mercado como Cesta", function () {
  this.mercadoData.tipo = "cesta";
});

When("o tipo do mercado como Lote", function () {
  this.mercadoData.tipo = "lote";
});

When("o tipo do mercado como Venda Direta", function () {
  this.mercadoData.tipo = "venda_direta";
});

When(
  "o responsável do mercado tipo Cesta como {string}",
  function (nomeResponsavel) {
    this.mercadoData.responsavelId = this.usuarios[nomeResponsavel].id;
  },
);

When(
  "o responsável do mercado tipo Lote como {string}",
  function (nomeResponsavel) {
    this.mercadoData.responsavelId = this.usuarios[nomeResponsavel].id;
  },
);

When(
  "o responsável do mercado tipo Venda Direta como {string}",
  function (nomeResponsavel) {
    this.mercadoData.responsavelId = this.usuarios[nomeResponsavel].id;
  },
);

When("a taxa administrativa como {int}", function (taxa) {
  this.mercadoData.taxaAdministrativa = taxa;
});

When("o ponto de entrega como {string}", function (nomePonto) {
  if (!this.mercadoData.pontosEntrega) {
    this.mercadoData.pontosEntrega = [];
  }
  this.mercadoData.pontosEntrega.push({ nome: nomePonto, status: "ativo" });
});

When("o valor máximo do mercado tipo Cesta como {int}", function (valor) {
  this.mercadoData.valorMaximoCesta = valor;
});

When("o status do mercado tipo Cesta como {string}", function (status) {
  this.mercadoData.status = status;
});

When("o status do mercado como {string}", function (status) {
  this.mercadoData.status = status;
});

When("o status do mercado tipo Venda Direta como {string}", function (status) {
  this.mercadoData.status = status;
});

When("eu salvo o novo mercado tipo Cesta", async function () {
  try {
    this.currentMercado = await mercadoService.criarMercado(this.mercadoData);
    this.result = this.currentMercado;
  } catch (error) {
    this.error = error;
  }
});

When("eu salvo o novo mercado tipo Lote", async function () {
  try {
    this.currentMercado = await mercadoService.criarMercado(this.mercadoData);
    this.result = this.currentMercado;
  } catch (error) {
    this.error = error;
  }
});

When("eu salvo o novo mercado tipo Venda Direta", async function () {
  try {
    this.currentMercado = await mercadoService.criarMercado(this.mercadoData);
    this.result = this.currentMercado;
  } catch (error) {
    this.error = error;
  }
});

When("eu tento salvar o novo mercado", async function () {
  try {
    this.currentMercado = await mercadoService.criarMercado(this.mercadoData);
    this.result = this.currentMercado;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "o mercado tipo Cesta {string} deve ser criado com sucesso com o ponto de entrega {string} deve ser criado vinculado ao mercado {string}",
  function (nomeMercado, nomePonto, nomeMercado2) {
    assert.strictEqual(this.error, null);
    assert.ok(this.currentMercado);
    assert.strictEqual(this.currentMercado.nome, nomeMercado);
    assert.strictEqual(this.currentMercado.tipo, "cesta");
    assert.ok(this.currentMercado.pontosEntrega);
    assert.ok(
      this.currentMercado.pontosEntrega.some((p) => p.nome === nomePonto),
    );
    this.mercados[nomeMercado] = this.currentMercado;
  },
);

Then(
  "o mercado tipo Lote {string} deve ser criado com sucesso com o ponto de entrega {string} deve ser criado vinculado ao mercado {string}",
  function (nomeMercado, nomePonto, nomeMercado2) {
    assert.strictEqual(this.error, null);
    assert.ok(this.currentMercado);
    assert.strictEqual(this.currentMercado.nome, nomeMercado);
    assert.strictEqual(this.currentMercado.tipo, "lote");
    assert.ok(this.currentMercado.pontosEntrega);
    assert.ok(
      this.currentMercado.pontosEntrega.some((p) => p.nome === nomePonto),
    );
    this.mercados[nomeMercado] = this.currentMercado;
  },
);

Then(
  "o mercado tipo Venda Direta {string} deve ser criado com sucesso com o ponto de entrega {string} deve ser criado vinculado ao mercado {string}",
  function (nomeMercado, nomePonto, nomeMercado2) {
    assert.strictEqual(this.error, null);
    assert.ok(this.currentMercado);
    assert.strictEqual(this.currentMercado.nome, nomeMercado);
    assert.strictEqual(this.currentMercado.tipo, "venda_direta");
    assert.ok(this.currentMercado.pontosEntrega);
    assert.ok(
      this.currentMercado.pontosEntrega.some((p) => p.nome === nomePonto),
    );
    this.mercados[nomeMercado] = this.currentMercado;
  },
);

Given("que existe um mercado {string} cadastrado", async function (nome) {
  if (!this.mercados[nome]) {
    let usuario = await Usuario.findOne();
    if (!usuario) {
      usuario = await Usuario.create({
        nome: "Admin Test",
        email: "admin@test.com",
        senha: "senha123",
        perfis: ["admin"],
        status: "ativo",
      });
    }
    const mercado = await mercadoService.criarMercado({
      nome,
      tipo: "cesta",
      responsavelId: usuario.id,
      valorMaximoCesta: 50,
      status: "ativo",
      pontosEntrega: [{ nome: "Ponto Central", status: "ativo" }],
    });
    this.mercados[nome] = mercado;
  }
  this.currentMercado = this.mercados[nome];
});

Given(
  "que existe um mercado tipo Cesta {string} cadastrado",
  async function (nome) {
    if (!this.usuarios["Manuel"]) {
      this.usuarios["Manuel"] = await Usuario.create({
        nome: "Manuel",
        email: "manuel@test.com",
        senha: "senha123",
        perfis: ["admin"],
        status: "ativo",
      });
    }
    const mercado = await mercadoService.criarMercado({
      nome,
      tipo: "cesta",
      responsavelId: this.usuarios["Manuel"].id,
      taxaAdministrativa: 1,
      valorMaximoCesta: 30,
      status: "ativo",
      pontosEntrega: [{ nome: "Ponto 1", status: "ativo" }],
    });
    this.mercados[nome] = mercado;
    this.currentMercado = mercado;
  },
);

Given(
  "que existe um mercado tipo Lote {string} cadastrado",
  async function (nome) {
    if (!this.usuarios["Manuel"]) {
      this.usuarios["Manuel"] = await Usuario.create({
        nome: "Manuel",
        email: "manuel@test.com",
        senha: "senha123",
        perfis: ["admin"],
        status: "ativo",
      });
    }
    const mercado = await mercadoService.criarMercado({
      nome,
      tipo: "lote",
      responsavelId: this.usuarios["Manuel"].id,
      taxaAdministrativa: 1,
      status: "ativo",
      pontosEntrega: [{ nome: "Ponto 1", status: "ativo" }],
    });
    this.mercados[nome] = mercado;
    this.currentMercado = mercado;
  },
);

Given(
  "que existe um mercado tipo Venda Direta {string} cadastrado",
  async function (nome) {
    if (!this.usuarios["Manuel"]) {
      this.usuarios["Manuel"] = await Usuario.create({
        nome: "Manuel",
        email: "manuel@test.com",
        senha: "senha123",
        perfis: ["admin"],
        status: "ativo",
      });
    }
    const mercado = await mercadoService.criarMercado({
      nome,
      tipo: "venda_direta",
      responsavelId: this.usuarios["Manuel"].id,
      taxaAdministrativa: 1,
      status: "ativo",
      pontosEntrega: [{ nome: "Ponto 1", status: "ativo" }],
    });
    this.mercados[nome] = mercado;
    this.currentMercado = mercado;
  },
);

When("eu solicito os detalhes do mercado {string}", async function (nome) {
  try {
    this.currentMercado = await mercadoService.buscarPorId(
      this.mercados[nome].id,
    );
    this.result = this.currentMercado;
  } catch (error) {
    this.error = error;
  }
});

Then("eu devo ver os detalhes do mercado {string}", function (nome) {
  assert.strictEqual(this.error, null);
  assert.ok(this.currentMercado);
  assert.strictEqual(this.currentMercado.nome, nome);
});

When(
  "eu edito o nome do mercado {string} para {string}",
  function (nomeAntigo, nomeNovo) {
    if (!this.mercadoUpdateData) {
      this.mercadoUpdateData = {};
    }
    this.mercadoUpdateData.nome = nomeNovo;
  },
);

When(
  "edito o responsável de {string} para {string}",
  function (nomeAntigo, nomeNovo) {
    if (!this.mercadoUpdateData) {
      this.mercadoUpdateData = {};
    }
    this.mercadoUpdateData.responsavelId = this.usuarios[nomeNovo].id;
  },
);

When(
  "edito a taxa administrativa de {int} para {int}",
  function (taxaAntiga, taxaNova) {
    if (!this.mercadoUpdateData) {
      this.mercadoUpdateData = {};
    }
    this.mercadoUpdateData.taxaAdministrativa = taxaNova;
  },
);

When(
  "edito o valor máximo do mercado de {int} para {int}",
  function (valorAntigo, valorNovo) {
    if (!this.mercadoUpdateData) {
      this.mercadoUpdateData = {};
    }
    this.mercadoUpdateData.valorMaximoCesta = valorNovo;
  },
);

When("salvo as alterações do mercado tipo Cesta", async function () {
  try {
    this.currentMercado = await mercadoService.atualizarMercado(
      this.currentMercado.id,
      this.mercadoUpdateData,
    );
    this.result = this.currentMercado;
  } catch (error) {
    this.error = error;
  }
});

When("salvo as alterações do mercado tipo Lote", async function () {
  try {
    this.currentMercado = await mercadoService.atualizarMercado(
      this.currentMercado.id,
      this.mercadoUpdateData,
    );
    this.result = this.currentMercado;
  } catch (error) {
    this.error = error;
  }
});

When("salvo as alterações do mercado tipo Venda Direta", async function () {
  try {
    this.currentMercado = await mercadoService.atualizarMercado(
      this.currentMercado.id,
      this.mercadoUpdateData,
    );
    this.result = this.currentMercado;
  } catch (error) {
    this.error = error;
  }
});

Then(
  "o nome do mercado deve ser {string}, com responsável {string}, com taxa administrativa {int}, com valor máximo {int}",
  function (nome, nomeResponsavel, taxa, valor) {
    assert.strictEqual(this.error, null);
    assert.ok(this.currentMercado);
    assert.strictEqual(this.currentMercado.nome, nome);
    assert.strictEqual(this.currentMercado.responsavel.nome, nomeResponsavel);
    assert.strictEqual(
      parseFloat(this.currentMercado.taxaAdministrativa),
      taxa,
    );
    assert.strictEqual(parseFloat(this.currentMercado.valorMaximoCesta), valor);
  },
);

Then(
  "o nome do mercado deve ser {string}, com responsável {string}, com taxa administrativa {int}",
  function (nome, nomeResponsavel, taxa) {
    assert.strictEqual(this.error, null);
    assert.ok(this.currentMercado);
    assert.strictEqual(this.currentMercado.nome, nome);
    assert.strictEqual(this.currentMercado.responsavel.nome, nomeResponsavel);
    assert.strictEqual(
      parseFloat(this.currentMercado.taxaAdministrativa),
      taxa,
    );
  },
);

Given(
  "que não exista nenhum ciclo que seja composto pelo mercado {string}",
  function (nome) {
    return true;
  },
);

When("eu deleto o mercado {string}", async function (nome) {
  try {
    this.result = await mercadoService.deletarMercado(this.mercados[nome].id);
  } catch (error) {
    this.error = error;
  }
});

Then(
  "o mercado {string} não deve mais existir no sistema",
  async function (nome) {
    assert.strictEqual(this.error, null);
    try {
      await mercadoService.buscarPorId(this.mercados[nome].id);
      assert.fail("Mercado deveria ter sido deletado");
    } catch (error) {
      assert.ok(error instanceof ServiceError);
      assert.match(error.message, /não encontrado/i);
    }
  },
);

Given(
  "que existem mercados {string}, {string} e {string} cadastrados",
  async function (nome1, nome2, nome3) {
    let usuario = await Usuario.findOne();
    if (!usuario) {
      usuario = await Usuario.create({
        nome: "Manuel",
        email: "manuel2@test.com",
        senha: "senha123",
        perfis: ["admin"],
        status: "ativo",
      });
    }
    for (const nome of [nome1, nome2, nome3]) {
      const mercado = await mercadoService.criarMercado({
        nome,
        tipo: "cesta",
        responsavelId: usuario.id,
        valorMaximoCesta: 50,
        status: "ativo",
        pontosEntrega: [{ nome: "Ponto 1", status: "ativo" }],
      });
      this.mercados[nome] = mercado;
    }
  },
);

Given(
  "que todos tenham como administrador o usuário {string}",
  async function (nomeUsuario) {
    return true;
  },
);

Given("todos os mercados estão com status {string}", async function (status) {
  return true;
});

When("eu solicito a lista de mercados ativos", async function () {
  try {
    this.result = await mercadoService.listarMercadosAtivos();
  } catch (error) {
    this.error = error;
  }
});

Then(
  "eu devo ver os mercados {string}, {string} e {string}",
  function (nome1, nome2, nome3) {
    assert.strictEqual(this.error, null);
    assert.ok(this.result);
    assert.ok(Array.isArray(this.result));
    const nomes = this.result.map((m) => m.nome);
    assert.ok(nomes.includes(nome1));
    assert.ok(nomes.includes(nome2));
    assert.ok(nomes.includes(nome3));
  },
);

Then("eu devo receber um erro de validação", function () {
  assert.ok(this.error);
  assert.ok(this.error instanceof ServiceError || this.error instanceof Error);
});
