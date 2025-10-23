const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { PontoEntregaService } = require("../../src/services/services.js");
const Factories = require("./support/factories");

const pontoEntregaService = new PontoEntregaService();
let novoPontoEntrega;
let pontoEntregaCriado;
let pontoEntregaExistente;
let pontoEntregaEncontrado;
let pontoEntregaParaEditar;

/*Given("que eu quero criar um novo ponto de entrega", function () {
  novoPontoEntrega = {};
});*/

Given('que eu quero criar um novo ponto de entrega para o mercado {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When("eu preencho o nome do ponto de entrega com {string}", function (nome) {
  novoPontoEntrega.nome = nome;
});

/*When("o endereço do ponto de entrega com {string}", function (endereco) {
  novoPontoEntrega.endereco = endereco;
});*/

/*When("o status do ponto de entrega como {string}", function (status) {
  novoPontoEntrega.status = status;
});*/

When("eu salvo o novo ponto de entrega", async function () {
  try {
    pontoEntregaCriado =
      await pontoEntregaService.criarPontoEntrega(novoPontoEntrega);
  } catch (error) {
    this.error = error;
  }
});

/*Then(
  "o ponto de entrega {string} deve ser criado com sucesso",
  async function (nome) {
    expect(this.error).to.be.undefined;
    expect(pontoEntregaCriado).to.have.property("id");
    expect(pontoEntregaCriado.nome).to.equal(nome);
  },
);*/

Then('o ponto de entrega {string} é criado para o mercado {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

/*Given(
  /que existe um ponto de entrega "([^"]*)"(?: cadastrado)?/,
  async function (nome) {
    const pontoEntregaData = Factories.PontoEntregaFactory.create({ nome });
    pontoEntregaExistente =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  },
);*/

Given('que existe os pontos de entrega {string} e {string} cadastrados para o mercado {string}', function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

/*When(
  "eu solicito os detalhes do ponto de entrega {string}",
  async function (nome) {
    pontoEntregaEncontrado = await pontoEntregaService.buscarPontoEntregaPorId(
      pontoEntregaExistente.id,
    );
  },
);*/

When('eu solicito os nomes dos pontos de entrega do mercado {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

/*Then("eu devo ver os detalhes do ponto de entrega {string}", function (nome) {
  expect(pontoEntregaEncontrado).to.be.an("object");
  expect(pontoEntregaEncontrado.nome).to.equal(nome);
});*/

Then('eu devo ver os nomes dos pontos de entrega {string} e {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que existe um ponto de entrega {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
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

/* Funcionalidade não exisitirá mais, campo endereço não existirá
Given(
  "que existe um ponto de entrega com endereço {string}",
  async function (endereco) {
    const pontoEntregaData = Factories.PontoEntregaFactory.create({
      endereco,
    });
    pontoEntregaExistente =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  },
);

When("eu edito o endereço para {string}", async function (novoEndereco) {
  pontoEntregaParaEditar = { ...pontoEntregaExistente.toJSON() };
  pontoEntregaParaEditar.endereco = novoEndereco;
});

Then(
  "o endereço do ponto de entrega deve ser {string}",
  async function (enderecoEsperado) {
    const pontoAtualizado = await pontoEntregaService.buscarPontoEntregaPorId(
      pontoEntregaParaEditar.id,
    );
    expect(pontoAtualizado.endereco).to.equal(enderecoEsperado);
  },
);*/

/* Funcionalidade não existirá mais, campo status não existirá
Given(
  "que existe um ponto de entrega com status {string}",
  async function (status) {
    const pontoEntregaData = Factories.PontoEntregaFactory.create({
      status,
    });
    pontoEntregaExistente =
      await pontoEntregaService.criarPontoEntrega(pontoEntregaData);
  },
);

When(
  "eu edito o status do ponto de entrega para {string}",
  async function (novoStatus) {
    pontoEntregaParaEditar = { ...pontoEntregaExistente.toJSON() };
    pontoEntregaParaEditar.status = novoStatus;
  },
);

Then(
  "o status do ponto de entrega deve ser {string}",
  async function (statusEsperado) {
    const pontoAtualizado = await pontoEntregaService.buscarPontoEntregaPorId(
      pontoEntregaParaEditar.id,
    );
    expect(pontoAtualizado.status).to.equal(statusEsperado);
  },
);*/

let erroDeletar;

Given(
  "que não exista nenhum ciclo associado ao ponto de entrega {string}",
  function (string) {
    // Nenhuma ação necessária, o banco de dados é limpo antes de cada cenário.
  },
);

When("eu deleto o ponto de entrega {string}", async function (string) {
  try {
    await pontoEntregaService.deletarPontoEntrega(pontoEntregaExistente.id);
  } catch (error) {
    erroDeletar = error;
  }
});

Then(
  "o ponto de entrega {string} não deve mais existir no sistema",
  async function (string) {
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

let listaDePontos;

/* Funcionalidade não existe mais, campo status não existe 
Given(
  "que existem pontos de entrega {string}, {string} e {string} cadastrados",
  async function (ponto1, ponto2, ponto3) {
    await pontoEntregaService.criarPontoEntrega(
      Factories.PontoEntregaFactory.create({ nome: ponto1, status: "ativo" }),
    );
    await pontoEntregaService.criarPontoEntrega(
      Factories.PontoEntregaFactory.create({ nome: ponto2, status: "inativo" }),
    );
    await pontoEntregaService.criarPontoEntrega(
      Factories.PontoEntregaFactory.create({ nome: ponto3, status: "ativo" }),
    );
  },
);

Given(
  "todos os pontos de entrega estão com status {string}",
  async function (status) {
    // Este step pode ser ajustado ou combinado com o anterior se necessário,
    // mas por enquanto, a criação no step acima já define os status.
  },
);

When("eu solicito a lista de pontos de entrega ativos", async function () {
  listaDePontos = await pontoEntregaService.listarPontosDeEntregaAtivos();
});

Then(
  "eu devo ver os pontos de entrega {string}, {string} e {string}",
  function (ponto1, ponto2, ponto3) {
    const nomesDosPontos = listaDePontos.map((p) => p.nome);
    const pontosEsperados = [ponto1, ponto3]; // Apenas os ativos
    expect(nomesDosPontos).to.have.members(pontosEsperados);
    expect(nomesDosPontos).to.not.include(ponto2);
  },
);*/
