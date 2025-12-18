const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const assert = require("assert");
const {
  SubmissaoProdutoService,
  UsuarioService,
  CryptoUUIDService,
} = require("../../src/services/services.js");
const { SubmissaoProduto, Usuario } = require("../../models");

const submissaoProdutoService = new SubmissaoProdutoService();
const uuid4Service = new CryptoUUIDService();
const usuarioService = new UsuarioService(uuid4Service);

let currentSubmissao = null;
let submissoesList = [];
let createdSubmissoes = [];
let currentFornecedor = null;

Before(async function () {
  currentSubmissao = null;
  submissoesList = [];
  createdSubmissoes = [];
  currentFornecedor = null;
});

After(async function () {
  // Limpar submissões criadas durante os testes
  for (const submissao of createdSubmissoes) {
    try {
      await SubmissaoProduto.destroy({ where: { id: submissao.id } });
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }
});

Given("que existe um fornecedor com id {int}", async function (fornecedorId) {
  let fornecedor = await Usuario.findByPk(fornecedorId);
  if (!fornecedor) {
    // Criar fornecedor se não existir
    fornecedor = await usuarioService.create(
      {
        email: `fornecedor${fornecedorId}@example.com`,
        senha: "password123",
        nome: `Fornecedor ${fornecedorId}`,
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );
  }
  currentFornecedor = fornecedor;
  assert(fornecedor, `Fornecedor com id ${fornecedorId} não encontrado`);
});

Given("que existe uma submissão de produto pendente", async function () {
  // Garantir que fornecedor existe
  let fornecedor = await Usuario.findByPk(2);
  if (!fornecedor) {
    fornecedor = await usuarioService.create(
      {
        email: "fornecedor2@example.com",
        senha: "password123",
        nome: "Fornecedor 2",
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );
  }

  currentSubmissao = await submissaoProdutoService.criarSubmissao({
    fornecedorId: fornecedor.id,
    nomeProduto: "Produto Teste BDD",
    descricao: "Descrição teste",
    precoUnidade: 10.0,
    medida: "kg",
  });
  createdSubmissoes.push(currentSubmissao);
});

Given("que existem submissões com diferentes status", async function () {
  // Garantir que fornecedor existe
  let fornecedor = await Usuario.findByPk(2);
  if (!fornecedor) {
    fornecedor = await usuarioService.create(
      {
        email: "fornecedor2@example.com",
        senha: "password123",
        nome: "Fornecedor 2",
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );
  }

  // Criar submissão pendente
  const pendente = await submissaoProdutoService.criarSubmissao({
    fornecedorId: fornecedor.id,
    nomeProduto: "Produto Pendente",
    precoUnidade: 5.0,
    medida: "unidade",
  });
  createdSubmissoes.push(pendente);

  // Criar e aprovar uma submissão
  const aprovada = await submissaoProdutoService.criarSubmissao({
    fornecedorId: fornecedor.id,
    nomeProduto: "Produto Aprovado",
    precoUnidade: 8.0,
    medida: "kg",
  });
  await submissaoProdutoService.aprovarSubmissao(aprovada.id);
  createdSubmissoes.push(aprovada);

  // Criar e reprovar uma submissão
  const reprovada = await submissaoProdutoService.criarSubmissao({
    fornecedorId: fornecedor.id,
    nomeProduto: "Produto Reprovado",
    precoUnidade: 3.0,
    medida: "maço",
  });
  await submissaoProdutoService.reprovarSubmissao(
    reprovada.id,
    "Não atende requisitos",
  );
  createdSubmissoes.push(reprovada);
});

When(
  "eu crio uma submissão de produto com nome {string}, preço {float} e medida {string}",
  async function (nome, preco, medida) {
    currentSubmissao = await submissaoProdutoService.criarSubmissao({
      fornecedorId: currentFornecedor.id,
      nomeProduto: nome,
      descricao: "Descrição do produto",
      precoUnidade: preco,
      medida: medida,
    });
    createdSubmissoes.push(currentSubmissao);
  },
);

When("eu aprovo a submissão", async function () {
  currentSubmissao = await submissaoProdutoService.aprovarSubmissao(
    currentSubmissao.id,
  );
});

When("eu reprovo a submissão com motivo {string}", async function (motivo) {
  currentSubmissao = await submissaoProdutoService.reprovarSubmissao(
    currentSubmissao.id,
    motivo,
  );
});

When("eu listo as submissões com status {string}", async function (status) {
  submissoesList = await submissaoProdutoService.listarPorStatus(status);
});

Then("a submissão deve ser criada com sucesso", function () {
  assert(currentSubmissao, "Submissão não foi criada");
  assert(currentSubmissao.id, "Submissão não tem ID");
});

Then("a submissão deve ter status {string}", async function (status) {
  // Recarregar do banco para ter dados atualizados
  const submissao = await submissaoProdutoService.buscarPorId(
    currentSubmissao.id,
  );
  assert.strictEqual(submissao.status, status);
});

Then(
  "a submissão deve ter o motivo de reprovação {string}",
  async function (motivo) {
    const submissao = await submissaoProdutoService.buscarPorId(
      currentSubmissao.id,
    );
    assert.strictEqual(submissao.motivoReprovacao, motivo);
  },
);

Then("deve retornar apenas as submissões pendentes", function () {
  assert(submissoesList.length > 0, "Nenhuma submissão retornada");
  for (const submissao of submissoesList) {
    assert.strictEqual(
      submissao.status,
      "pendente",
      `Submissão ${submissao.id} tem status ${submissao.status}`,
    );
  }
});
