const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const assert = require("assert");
const { CicloService } = require("../../src/services/services.js");
const { Ciclo, PontoEntrega } = require("../../models");

const cicloService = new CicloService();

let currentCiclo = null;
let ciclosList = [];
let createdCiclos = [];
let currentPontoEntrega = null;

Before(async function () {
  currentCiclo = null;
  ciclosList = [];
  createdCiclos = [];
  currentPontoEntrega = null;
});

After(async function () {
  // Limpar ciclos criados durante os testes
  for (const ciclo of createdCiclos) {
    try {
      await Ciclo.destroy({ where: { id: ciclo.id } });
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }
});

Given("que existe um ponto de entrega ativo", async function () {
  let pontoEntrega = await PontoEntrega.findOne({ where: { status: "ativo" } });
  if (!pontoEntrega) {
    // Criar ponto de entrega se não existir
    pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Entrega Teste BDD",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      status: "ativo",
    });
  }
  currentPontoEntrega = pontoEntrega;
  this.currentPontoEntrega = pontoEntrega; // Compartir en contexto
  assert(pontoEntrega, "Ponto de entrega não encontrado");
});

Given("que existe um ciclo cadastrado", async function () {
  // Garantir que existe um ponto de entrega
  let pontoEntrega = await PontoEntrega.findOne({ where: { status: "ativo" } });
  if (!pontoEntrega) {
    pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Entrega Teste BDD",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      status: "ativo",
    });
  }
  currentPontoEntrega = pontoEntrega;
  this.currentPontoEntrega = pontoEntrega; // Compartir en contexto

  const agora = new Date();
  const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

  currentCiclo = await cicloService.criarCiclo({
    nome: "Ciclo Teste BDD",
    ofertaInicio: agora,
    ofertaFim: umaSemanaDepois,
    pontoEntregaId: pontoEntrega.id,
  });
  createdCiclos.push(currentCiclo);
  this.currentCiclo = currentCiclo; // Compartir en contexto
});

Given("que existem ciclos cadastrados", async function () {
  // Garantir que existe um ponto de entrega
  let pontoEntrega = await PontoEntrega.findOne({ where: { status: "ativo" } });
  if (!pontoEntrega) {
    pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Entrega Teste BDD",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      status: "ativo",
    });
  }
  currentPontoEntrega = pontoEntrega;

  const agora = new Date();
  const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Criar múltiplos ciclos
  for (let i = 1; i <= 3; i++) {
    const ciclo = await cicloService.criarCiclo({
      nome: `Ciclo Teste ${i}`,
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
    });
    createdCiclos.push(ciclo);
  }
});

When(
  "eu crio um ciclo com nome {string} e datas válidas",
  async function (nome) {
    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

    currentCiclo = await cicloService.criarCiclo({
      nome: nome,
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: currentPontoEntrega.id,
    });
    createdCiclos.push(currentCiclo);
  },
);

When("eu atualizo o ciclo com nome {string}", async function (novoNome) {
  currentCiclo = await cicloService.atualizarCiclo(currentCiclo.id, {
    nome: novoNome,
  });
});

When("eu listo os ciclos", async function () {
  const result = await cicloService.listarCiclos(10);
  ciclosList = result.ciclos;
});

When("eu deleto o ciclo", async function () {
  await cicloService.deletarCiclo(currentCiclo.id);
  // Remover da lista de criados para não tentar limpar novamente
  createdCiclos = createdCiclos.filter((c) => c.id !== currentCiclo.id);
});

Then("o ciclo deve ser criado com sucesso", function () {
  assert(currentCiclo, "Ciclo não foi criado");
  assert(currentCiclo.id, "Ciclo não tem ID");
});

Then("o ciclo deve ter status {string}", async function (status) {
  const ciclo = await cicloService.buscarCicloPorId(currentCiclo.id);
  assert.strictEqual(ciclo.status, status);
});

Then("o ciclo deve ter o nome {string}", async function (nome) {
  const ciclo = await cicloService.buscarCicloPorId(currentCiclo.id);
  assert.strictEqual(ciclo.nome, nome);
});

Then("deve retornar a lista de ciclos", function () {
  assert(ciclosList.length > 0, "Nenhum ciclo retornado");
});

Then("o ciclo deve ser removido com sucesso", async function () {
  const ciclo = await Ciclo.findByPk(currentCiclo.id);
  assert.strictEqual(ciclo, null, "Ciclo não foi removido");
});
