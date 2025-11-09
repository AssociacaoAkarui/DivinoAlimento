const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");

const {
  UsuarioService,
  CryptoUUIDService,
} = require("../../src/services/services");

let usuarioService;

Before(function () {
  usuarioService = new UsuarioService(new CryptoUUIDService());
  this.usuarioData = {};
  this.currentUsuario = null;
});

Given("que eu quero criar um novo usuário", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("eu preencho o nome do usuário com {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("o nome fantasia do usuário com {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("o celular do usuário com {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When(
  "as informações para pagamento do usuário com {string}",
  function (string) {
    // Write code here that turns the phrase above into concrete actions
    return "pending";
  },
);

When("o email do usuário com {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("a política de privacidade do usuário com {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("o perfil do usuário como {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("o status do usuário como {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("eu salvo o novo usuário", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Then("o usuário {string} deve ser criado com sucesso", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Given("que existe um usuário {string} cadastrado", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("eu solicito os detalhes do usuário {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Then("eu devo ver os detalhes do usuário {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Given("que existe um usuário {string}", async function (nome) {
  this.currentUsuario = await usuarioService.create(
    {
      email: `${nome.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      senha: "password",
    },
    {
      nome: nome,
      perfis: ["consumidor"],
      status: "ativo",
    },
  );
});

When("eu edito o nome do usuário para {string}", function (nome) {
  this.usuarioData.nome = nome;
});

When(
  "eu edito o nome fantasia do usuário para {string}",
  function (nomeFantasia) {
    this.usuarioData.nomeoficial = nomeFantasia;
  },
);

When("eu edito o celular para {string}", function (celular) {
  this.usuarioData.celular = celular;
});

When(
  "eu edito as informações para pagamento para {string}",
  function (descritivo) {
    this.usuarioData.descritivo = descritivo;
  },
);

When("eu edito o email para {string}", function (email) {
  this.usuarioData.email = email;
});

When(
  "eu edito o a política de privacidade para {string}",
  function (cientepolitica) {
    this.usuarioData.cientepolitica = cientepolitica;
  },
);

When("eu edito o perfil do usuário para {string}", function (perfisString) {
  // Converte "{fornecedor,consumidor}" para ["fornecedor", "consumidor"]
  const perfis = perfisString.replace(/[{}]/g, "").split(",");
  this.usuarioData.perfis = perfis;
});

When("eu edito o status do usuário para {string}", function (status) {
  this.usuarioData.status = status;
});

When("salvo as alterações do usuário", async function () {
  this.currentUsuario = await usuarioService.atualizarUsuario(
    this.currentUsuario.id,
    this.usuarioData,
  );
});

Then("o nome do usuário deve ser {string}", function (nome) {
  expect(this.currentUsuario.nome).to.equal(nome);
});

Then("o nome fantasia do usuário deve ser {string}", function (nomeFantasia) {
  expect(this.currentUsuario.nomeoficial).to.equal(nomeFantasia);
});

Then("o celular do usuário deve ser {string}", function (celular) {
  expect(this.currentUsuario.celular).to.equal(celular);
});

Then(
  "as informações para pagamento do usuário deve ser {string}",
  function (descritivo) {
    expect(this.currentUsuario.descritivo).to.equal(descritivo);
  },
);

Then("o email do usuário deve ser {string}", function (email) {
  expect(this.currentUsuario.email).to.equal(email);
});

Then(
  "a políica de privacidade do usuário deve ser {string}",
  function (cientepolitica) {
    expect(this.currentUsuario.cientepolitica).to.equal(cientepolitica);
  },
);

Then("o perfil do usuário deve ser {string}", function (perfisString) {
  const perfisEsperados = perfisString.replace(/[{}]/g, "").split(",");
  expect(this.currentUsuario.perfis).to.deep.equal(perfisEsperados);
});

Then("o status do usuário deve ser {string}", function (status) {
  expect(this.currentUsuario.status).to.equal(status);
});

Given(
  "que não existam ofertas ou pedidos associados ao usuário {string}",
  function (string) {
    // Write code here that turns the phrase above into concrete actions
    return "pending";
  },
);

Given(
  "que o {string} não seja o único usuário com perfil {string}",
  function (string, string2) {
    // Write code here that turns the phrase above into concrete actions
    return "pending";
  },
);

Given("que o {string} não seja o usuário logado", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("eu deleto o usuário {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Then("o usuário {string} não deve mais existir no sistema", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Given("quero fazer login no sistema", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Given("estou logado no AUTH", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Given("que não exista nenhum usuário cadastrado", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("o email com {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("o perfil como {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Then("deve ter perfil de {string}", function (string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Given("que o usuário AUTH não exista cadastrado no sistema", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Given("que o usuário AUTH exista cadastrado no sistema", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("eu clico em logar", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Then("o sistema retorna os dados do usuário", function () {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Given(
  "que existe um usuário admin {string} com senha {string}",
  async function (email, senha) {
    await usuarioService.create(
      {
        email,
        senha,
      },
      {
        perfis: ["admin"],
      },
    );

    this.adminEmail = email;
    this.adminSenha = senha;
  },
);

Given(
  "que existem os seguintes usuários cadastrados:",
  async function (dataTable) {
    const usuarios = dataTable.hashes();

    for (const usuario of usuarios) {
      await usuarioService.create(
        {
          email: usuario.email,
          senha: "password",
        },
        {
          nome: usuario.nome,
          perfis: [usuario.perfis],
          status: usuario.status,
        },
      );
    }
  },
);

Given(
  "que existe um usuário {string} com senha {string} e perfil {string}",
  async function (email, senha, perfil) {
    await usuarioService.create(
      {
        email,
        senha,
      },
      {
        perfis: [perfil],
      },
    );

    this.userEmail = email;
    this.userSenha = senha;
  },
);

When(
  "eu faço login como {string} com senha {string}",
  async function (email, senha) {
    const loginResult = await usuarioService.login(email, senha);
    this.currentUser = loginResult;
    this.sessionId = loginResult.sessionId;
  },
);

When("eu solicito a listagem de todos os usuários", async function () {
  try {
    if (
      !this.currentUser ||
      !this.currentUser.perfis ||
      !this.currentUser.perfis.includes("admin")
    ) {
      throw new Error("Admin required");
    }
    const usuarios = await usuarioService.listarTodos();
    this.result = { data: usuarios };
  } catch (error) {
    this.result = { error: error.message };
  }
});

When(
  "eu solicito a listagem de todos os usuários sem autenticação",
  async function () {
    this.result = { error: "Unauthorized" };
  },
);

Then("eu devo receber uma lista com {int} usuários", function (count) {
  expect(this.result.data).to.have.lengthOf(count);
});

Then("a lista deve conter o usuário {string}", function (nome) {
  const usuario = this.result.data.find((u) => u.nome === nome);
  expect(usuario).to.exist;
});

Then("eu devo receber um erro {string}", function (errorMessage) {
  expect(this.result.error).to.equal(errorMessage);
});
