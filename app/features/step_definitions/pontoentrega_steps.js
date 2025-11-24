const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { PontoEntregaService } = require("../../src/services/services.js");

const pontoEntregaService = new PontoEntregaService();

let novoPontoEntrega;
let pontoEntregaCriado;
let pontoEntregaExistente;
let pontoEntregaEncontrado;
let pontoEntregaParaEditar;
let listaDePontos;
let erroDeletar;

Given(
  "que eu quero criar um novo ponto de entrega para o mercado {string}",
  function (mercado) {
    novoPontoEntrega = { status: "ativo" };
  },
);

When("eu preencho o nome do ponto de entrega com {string}", function (nome) {
  novoPontoEntrega.nome = nome;
});

When("eu salvo o novo ponto de entrega", async function () {
  try {
    pontoEntregaCriado =
      await pontoEntregaService.criarPontoEntrega(novoPontoEntrega);
  } catch (error) {
    this.error = error;
  }
});

Then(
  "o ponto de entrega {string} é criado para o mercado {string}",
  async function (nomePonto, mercado) {
    expect(this.error).to.not.exist;
    expect(pontoEntregaCriado).to.have.property("id");
    expect(pontoEntregaCriado.nome).to.equal(nomePonto);
  },
);

Given(
  "que existe os pontos de entrega {string} e {string} cadastrados para o mercado {string}",
  async function (ponto1, ponto2, mercado) {
    await pontoEntregaService.criarPontoEntrega({
      nome: ponto1,
      status: "ativo",
    });
    await pontoEntregaService.criarPontoEntrega({
      nome: ponto2,
      status: "ativo",
    });
  },
);

When(
  "eu solicito os nomes dos pontos de entrega do mercado {string}",
  async function (mercado) {
    listaDePontos = await pontoEntregaService.listarTodos();
  },
);

Then(
  "eu devo ver os nomes dos pontos de entrega {string} e {string}",
  function (ponto1, ponto2) {
    const nomes = listaDePontos.map((p) => p.nome);
    expect(nomes).to.include(ponto1);
    expect(nomes).to.include(ponto2);
  },
);

Given("que existe um ponto de entrega {string}", async function (nome) {
  pontoEntregaExistente = await pontoEntregaService.criarPontoEntrega({
    nome: nome,
    status: "ativo",
  });
});

When(
  "eu edito o nome do ponto de entrega para {string}",
  async function (novoNome) {
    pontoEntregaParaEditar = { ...pontoEntregaExistente.toJSON() };
    pontoEntregaParaEditar.nome = novoNome;
  },
);

When("salvo as alterações do ponto de entrega", async function () {
  await pontoEntregaService.atualizarPontoEntrega(
    pontoEntregaParaEditar.id,
    pontoEntregaParaEditar,
  );
});

Then(
  "o nome do ponto de entrega deve ser {string}",
  async function (nomeEsperado) {
    const pontoAtualizado = await pontoEntregaService.buscarPontoEntregaPorId(
      pontoEntregaParaEditar.id,
    );
    expect(pontoAtualizado.nome).to.equal(nomeEsperado);
  },
);

Given(
  "que não exista nenhum ciclo associado ao ponto de entrega {string}",
  function (nome) {
    // Banco limpo antes de cada cenário
  },
);

When("eu deleto o ponto de entrega {string}", async function (nome) {
  try {
    await pontoEntregaService.deletarPontoEntrega(pontoEntregaExistente.id);
  } catch (error) {
    erroDeletar = error;
  }
});

Then(
  "o ponto de entrega {string} não deve mais existir no sistema",
  async function (nome) {
    let pontoDeletado;
    try {
      pontoDeletado = await pontoEntregaService.buscarPontoEntregaPorId(
        pontoEntregaExistente.id,
      );
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.include("não encontrado");
    }
    expect(pontoDeletado).to.be.undefined;
  },
);
