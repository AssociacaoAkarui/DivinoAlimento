import {
  UsuarioService,
  PontoEntregaService,
  CicloService,
  MercadoService,
  CicloMercadoService,
} from "../src/services/services.js";
import { createRequire } from "module";
import { buildSchema, graphql } from "graphql";

import { expect } from "chai";

const require = createRequire(import.meta.url);
const { sequelize, Usuario } = require("../models/index.js");
const { default: APIGraphql } = require("../src/api-graphql.js");

describe("Array", function () {
  describe("ejemplo", function () {
    it("ejemplo", function () {
      expect([1, 2, 3]).to.have.lengthOf(3);
    });
  });
});

describe("Howto", function () {
  it("query user perfis", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const currentUsuario = await usuarioService.create({
      email: "john@example.com",
      senha: "password",
    });

    const dbUsuario = await Usuario.findOne({
      where: {
        email: currentUsuario.email,
        senha: currentUsuario.senha,
        status: "ativo",
      },
      attributes: ["id", "email", "perfis"],
    });

    const dbUsuarioJSON = dbUsuario.toJSON();

    expect(currentUsuario.perfis).to.deep.equal(dbUsuarioJSON.perfis);
  });
});

describe("Graphql", async function () {
  it("ejemplo", async function () {
    var database = {};

    const schema = buildSchema(`
      type Mutation {
        createUser(userId: String!, name: String!): User!
      }

      type Query {
        user(id: ID!): User
      }

      type User {
        id: ID!
        name: String!
      }
    `);

    const query = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

    const root = {
      createUser: (args) => {
        database[args.userId] = { id: args.userId, name: args.name };
        return { id: args.userId, name: args.name };
      },
      user: (args) => database[args.id],
    };

    const queryCreateUser = `
  mutation CreateUser($userId: String!, $name: String!) {
    createUser(userId: $userId, name: $name) {
      id
      name
    }
  }
`;

    const resultCreateUser = await graphql({
      schema,
      source: queryCreateUser,
      variableValues: { userId: "12356", name: "John Doe" },
      rootValue: root,
      contextValue: {}, // mock database, authorization, loaders, etc.
    });

    expect(resultCreateUser).to.deep.equal({
      data: {
        createUser: {
          id: "12356",
          name: "John Doe",
        },
      },
    });

    const result = await graphql({
      schema,
      source: query,
      variableValues: { id: "12356" },
      rootValue: root,
      contextValue: {}, // mock database, authorization, loaders, etc.
    });

    expect(result.data).to.deep.equal({
      user: {
        id: "12356",
        name: "John Doe",
      },
    });
  });

  it("login", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const queryLogin = `
      mutation Login($input: LoginInput!) {
        sessionLogin(input: $input) {
          usuarioId
          token
          perfis
        }
      }
    `;

    const currentUsuario = await usuarioService.create({
      email: "john@example.com",
      senha: "password",
    });

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: queryLogin,
      variableValues: {
        input: { email: "john@example.com", senha: "password" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService }, // mock database, authorization, loaders, etc.
    });

    expect(resultLogin).to.deep.equal({
      data: {
        sessionLogin: {
          usuarioId: `${currentUsuario.id}`,
          token: "1234567890",
          perfis: ["admin"],
        },
      },
    });
  });

  it("error logout unauthenticated", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const queryLogin = `
      mutation Login($input: LoginInput!) {
        sessionLogin(input: $input) {
          usuarioId
          token
        }
      }
    `;

    const currentUsuario = await usuarioService.create({
      email: "john@example.com",
      senha: "password",
    });

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: queryLogin,
      variableValues: {
        input: { email: "john@example.com", senha: "password" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService }, // mock database, authorization, loaders, etc.
    });

    const queryLogout = `
      mutation Logout {
        sessionLogout {
        success
        }
      }
    `;

    const resultLogout = await graphql({
      schema: APIGraphql.schema,
      source: queryLogout,
      variableValues: {
        input: {},
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService, sessionToken: "invalidtoken" }, // mock database, authorization, loaders, etc.
    });

    expect(resultLogout.errors).to.exist;
  });

  it("logout authenticated", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const queryLogin = `
      mutation Login($input: LoginInput!) {
        sessionLogin(input: $input) {
          usuarioId
          token
        }
      }
    `;

    const currentUsuario = await usuarioService.create({
      email: "john@example.com",
      senha: "password",
    });

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: queryLogin,
      variableValues: {
        input: { email: "john@example.com", senha: "password" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService }, // mock database, authorization, loaders, etc.
    });

    const queryLogout = `
      mutation Logout {
        sessionLogout {
        success
        }
      }
    `;

    const resultLogout = await graphql({
      schema: APIGraphql.schema,
      source: queryLogout,
      variableValues: {
        input: {},
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService, sessionToken: "1234567890" }, // mock database, authorization, loaders, etc.
    });

    expect(resultLogout).to.deep.equal({
      data: {
        sessionLogout: {
          success: true,
        },
      },
    });
  });

  it("login returns multiple perfis correctly", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const queryLogin = `
      mutation Login($input: LoginInput!) {
        sessionLogin(input: $input) {
          usuarioId
          token
          perfis
        }
      }
    `;

    const currentUsuario = await usuarioService.create(
      {
        email: "multi@example.com",
        senha: "password",
      },
      {
        perfis: ["admin", "fornecedor"],
      },
    );

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: queryLogin,
      variableValues: {
        input: { email: "multi@example.com", senha: "password" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService },
    });

    expect(resultLogin).to.deep.equal({
      data: {
        sessionLogin: {
          usuarioId: `${currentUsuario.id}`,
          token: "1234567890",
          perfis: ["admin", "fornecedor"],
        },
      },
    });
  });

  it("not login when parameters is invalid", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const queryLogin = `
      mutation Login($input: LoginInput!) {
        sessionLogin(input: $input) {
          usuarioId
          token
        }
      }
    `;

    const currentUsuario = await usuarioService.create({
      email: "john@example.com",
      senha: "password",
    });

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: queryLogin,
      variableValues: {
        input: { email: "john@example.com", senha: "invalid" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService }, // mock database, authorization, loaders, etc.
    });

    expect(resultLogin).to.not.deep.equal({
      data: {
        sessionLogin: {
          usuarioId: `${currentUsuario.id}`,
          token: "1234567890",
        },
      },
    });
  });

  it("admin user can access systemInformation", async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const currentUsuario = await usuarioService.create({
      email: "admin@example.com",
      senha: "password",
    });

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: `
        mutation Login($input: LoginInput!) {
          sessionLogin(input: $input) {
            usuarioId
            token
          }
        }
      `,
      variableValues: {
        input: { email: "admin@example.com", senha: "password" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService },
    });

    const querySystemInfo = `
      query SystemInformation {
        systemInformation {
          version
        }
      }
    `;

    const resultSystemInfo = await graphql({
      schema: APIGraphql.schema,
      source: querySystemInfo,
      rootValue: APIGraphql.rootValue,
      contextValue: {
        usuarioService,
        sessionToken: resultLogin.data.sessionLogin.token,
      },
    });

    expect(resultSystemInfo.data).to.deep.equal({
      systemInformation: {
        version: "1.0.0",
      },
    });
  });

  it("non-admin user cannot access systemInformation", async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const currentUsuario = await usuarioService.create(
      {
        email: "user@example.com",
        senha: "password",
      },
      {
        perfis: ["consumidor"],
      },
    );

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: `
        mutation Login($input: LoginInput!) {
          sessionLogin(input: $input) {
            usuarioId
            token
          }
        }
      `,
      variableValues: {
        input: { email: "user@example.com", senha: "password" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService },
    });

    const querySystemInfo = `
      query SystemInformation {
        systemInformation {
          version
        }
      }
    `;

    const resultSystemInfo = await graphql({
      schema: APIGraphql.schema,
      source: querySystemInfo,
      rootValue: APIGraphql.rootValue,
      contextValue: {
        usuarioService,
        sessionToken: resultLogin.data.sessionLogin.token,
      },
    });

    expect(resultSystemInfo.errors).to.exist;
    expect(resultSystemInfo.errors[0].message).to.equal("Admin required");
  });

  it("unauthenticated user cannot access systemInformation", async function () {
    await sequelize.sync({ force: true });

    const querySystemInfo = `
      query SystemInformation {
        systemInformation {
          version
        }
      }
    `;

    const resultSystemInfo = await graphql({
      schema: APIGraphql.schema,
      source: querySystemInfo,
      rootValue: APIGraphql.rootValue,
      contextValue: {
        usuarioService: new UsuarioService({
          uuid4() {
            return "1234567890";
          },
        }),
      },
    });

    expect(resultSystemInfo.errors).to.exist;
    expect(resultSystemInfo.errors[0].message).to.equal("Unauthorized");
  });
  it("admin user can list all usuarios", async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create({
      email: "admin@example.com",
      senha: "password",
    });

    await usuarioService.create(
      {
        email: "user1@example.com",
        senha: "password",
      },
      {
        perfis: ["consumidor"],
      },
    );

    await usuarioService.create(
      {
        email: "user2@example.com",
        senha: "password",
      },
      {
        perfis: ["fornecedor"],
      },
    );

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: `
        mutation Login($input: LoginInput!) {
          sessionLogin(input: $input) {
            usuarioId
            token
          }
        }
      `,
      variableValues: {
        input: { email: "admin@example.com", senha: "password" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService },
    });

    const queryListarUsuarios = `
      query ListarUsuarios {
        listarUsuarios {
          id
          nome
          email
          status
          perfis
        }
      }
    `;

    const resultListarUsuarios = await graphql({
      schema: APIGraphql.schema,
      source: queryListarUsuarios,
      rootValue: APIGraphql.rootValue,
      contextValue: {
        usuarioService,
        sessionToken: resultLogin.data.sessionLogin.token,
      },
    });

    expect(resultListarUsuarios.data.listarUsuarios).to.have.lengthOf(3);
    expect(resultListarUsuarios.data.listarUsuarios[0]).to.have.property(
      "email",
    );
    expect(resultListarUsuarios.data.listarUsuarios[0]).to.have.property(
      "perfis",
    );
  });

  it("non-admin user cannot list usuarios", async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const currentUsuario = await usuarioService.create(
      {
        email: "user@example.com",
        senha: "password",
      },
      {
        perfis: ["consumidor"],
      },
    );

    const resultLogin = await graphql({
      schema: APIGraphql.schema,
      source: `
        mutation Login($input: LoginInput!) {
          sessionLogin(input: $input) {
            usuarioId
            token
          }
        }
      `,
      variableValues: {
        input: { email: "user@example.com", senha: "password" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: { usuarioService },
    });

    const queryListarUsuarios = `
      query ListarUsuarios {
        listarUsuarios {
          id
          nome
          email
        }
      }
    `;

    const resultListarUsuarios = await graphql({
      schema: APIGraphql.schema,
      source: queryListarUsuarios,
      rootValue: APIGraphql.rootValue,
      contextValue: {
        usuarioService,
        sessionToken: resultLogin.data.sessionLogin.token,
      },
    });

    expect(resultListarUsuarios.errors).to.exist;
    expect(resultListarUsuarios.errors[0].message).to.equal("Admin required");
  });

  it("unauthenticated user cannot list usuarios", async function () {
    await sequelize.sync({ force: true });

    const queryListarUsuarios = `
      query ListarUsuarios {
        listarUsuarios {
          id
          nome
          email
        }
      }
    `;

    const resultListarUsuarios = await graphql({
      schema: APIGraphql.schema,
      source: queryListarUsuarios,
      rootValue: APIGraphql.rootValue,
      contextValue: {
        usuarioService: new UsuarioService({
          uuid4() {
            return "1234567890";
          },
        }),
      },
    });

    expect(resultListarUsuarios.errors).to.exist;
    expect(resultListarUsuarios.errors[0].message).to.equal("Unauthorized");
  });

  it("admin user can find usuario by id", async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });
    const user = await usuarioService.create(
      {
        email: "user@example.com",
        senha: "password",
      },
      {
        nome: "João Silva",
        nomeoficial: "João da Silva Oficial",
        celular: "11987654321",
        perfis: ["fornecedor"],
        status: "ativo",
        banco: "Itaú",
        agencia: "1234",
        conta: "56789-0",
        chavePix: "joao@email.com",
        cientepolitica: "true",
      },
    );
    const foundUser = await usuarioService.buscarPorId(user.id);
    expect(foundUser.id).to.equal(user.id);
    expect(foundUser.nome).to.equal("João Silva");
    expect(foundUser.nomeoficial).to.equal("João da Silva Oficial");
    expect(foundUser.celular).to.equal("11987654321");
    expect(foundUser.email).to.equal("user@example.com");
    expect(foundUser.perfis).to.deep.equal(["fornecedor"]);
    expect(foundUser.status).to.equal("ativo");
    expect(foundUser.banco).to.equal("Itaú");
    expect(foundUser.agencia).to.equal("1234");
    expect(foundUser.conta).to.equal("56789-0");
    expect(foundUser.chavePix).to.equal("joao@email.com");
    expect(foundUser.cientepolitica).to.equal("true");
  });

  it("error finding non-existent usuario", async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });
    try {
      await usuarioService.buscarPorId("non-existent-id");
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error.message).to.equal("Usuario not found");
    }
  });

  it("admin user can update usuario", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    // Create admin user
    const adminUser = await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password",
      },
      {
        nome: "Admin",
        perfis: ["admin"],
      },
    );

    // Create user to update
    const userToUpdate = await usuarioService.create(
      {
        email: "user@example.com",
        senha: "password",
      },
      {
        nome: "User Original",
        perfis: ["consumidor"],
        status: "ativo",
      },
    );

    // Update user
    const updatedUser = await usuarioService.atualizarUsuario(userToUpdate.id, {
      nome: "User Updated",
      status: "inativo",
    });

    expect(updatedUser.nome).to.equal("User Updated");
    expect(updatedUser.status).to.equal("inativo");
  });

  it("update usuario with multiple fields", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const user = await usuarioService.create(
      {
        email: "user@example.com",
        senha: "password",
      },
      {
        nome: "Original Name",
        perfis: ["consumidor"],
      },
    );

    const updatedUser = await usuarioService.atualizarUsuario(user.id, {
      nome: "New Name",
      nomeoficial: "Official Name",
      celular: "11999999999",
      email: "newemail@example.com",
      perfis: ["fornecedor", "consumidor"],
      status: "inativo",
    });

    expect(updatedUser.nome).to.equal("New Name");
    expect(updatedUser.nomeoficial).to.equal("Official Name");
    expect(updatedUser.celular).to.equal("11999999999");
    expect(updatedUser.email).to.equal("newemail@example.com");
    expect(updatedUser.perfis).to.deep.equal(["fornecedor", "consumidor"]);
    expect(updatedUser.status).to.equal("inativo");
  });

  it("error updating non-existent usuario", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    try {
      await usuarioService.atualizarUsuario(999, {
        nome: "Test",
      });
      expect.fail("Should have thrown error");
    } catch (error) {
      expect(error.message).to.include("Falha ao atualizar usuario");
    }
  });

  it("can create new usuario with required fields", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const newUser = await usuarioService.create(
      {
        email: "newuser@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "New User",
        perfis: ["consumidor"],
        status: "ativo",
      },
    );

    expect(newUser.email).to.equal("newuser@example.com");
    expect(newUser.nome).to.equal("New User");
    expect(newUser.celular).to.equal("11999887766");
    expect(newUser.perfis).to.deep.equal(["consumidor"]);
    expect(newUser.status).to.equal("ativo");
  });

  it("can create usuario with multiple perfis", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const newUser = await usuarioService.create(
      {
        email: "multi@example.com",
        senha: "password123",
        phoneNumber: "11988776655",
      },
      {
        nome: "Multi Perfil User",
        perfis: ["admin", "fornecedor", "consumidor"],
        status: "ativo",
      },
    );

    expect(newUser.perfis).to.deep.equal(["admin", "fornecedor", "consumidor"]);
    expect(newUser.perfis).to.have.lengthOf(3);
  });

  it("creates usuario with default values when optional params omitted", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const newUser = await usuarioService.create({
      email: "simple@example.com",
      senha: "password123",
      phoneNumber: "11977665544",
    });

    expect(newUser.email).to.equal("simple@example.com");
    expect(newUser.nome).to.equal("simple");
    expect(newUser.perfis).to.deep.equal(["admin"]);
    expect(newUser.status).to.equal("ativo");
  });
});

describe("CategoriaProdutos GraphQL", function () {
  it("admin user can create categoria", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const mutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
          nome
          status
          observacao
        }
      }
    `;

    const context = APIGraphql.buildContext(session.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
          observacao: "Categoria de frutas",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarCategoria.nome).to.equal("Frutas");
    expect(result.data.criarCategoria.status).to.equal("ativo");
    expect(result.data.criarCategoria.observacao).to.equal(
      "Categoria de frutas",
    );
  });

  it("admin user can list categorias", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create some categorias first
    const createMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
          nome
        }
      }
    `;

    await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: { input: { nome: "Frutas", status: "ativo" } },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: { input: { nome: "Verduras", status: "ativo" } },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    // Now list them
    const query = `
      query ListarCategorias {
        listarCategorias {
          id
          nome
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarCategorias).to.have.lengthOf(2);
    expect(result.data.listarCategorias[0].nome).to.equal("Frutas");
    expect(result.data.listarCategorias[1].nome).to.equal("Verduras");
  });

  it("admin user can find categoria by id", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create a categoria first
    const createMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
          nome
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: { nome: "Legumes", status: "ativo", observacao: "Vegetais" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = createResult.data.criarCategoria.id;

    // Now find it
    const query = `
      query BuscarCategoria($id: ID!) {
        buscarCategoria(id: $id) {
          id
          nome
          status
          observacao
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { id: categoriaId },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.buscarCategoria.nome).to.equal("Legumes");
    expect(result.data.buscarCategoria.observacao).to.equal("Vegetais");
  });

  it("admin user can update categoria", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create a categoria first
    const createMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: { input: { nome: "Original", status: "ativo" } },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = createResult.data.criarCategoria.id;

    // Now update it
    const updateMutation = `
      mutation AtualizarCategoria($id: ID!, $input: AtualizarCategoriaProdutosInput!) {
        atualizarCategoria(id: $id, input: $input) {
          id
          nome
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: updateMutation,
      variableValues: {
        id: categoriaId,
        input: { nome: "Atualizado", status: "inativo" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarCategoria.nome).to.equal("Atualizado");
    expect(result.data.atualizarCategoria.status).to.equal("inativo");
  });

  it("admin user can delete categoria", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create a categoria first
    const createMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: { input: { nome: "Para Deletar", status: "ativo" } },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = createResult.data.criarCategoria.id;

    // Now delete it
    const deleteMutation = `
      mutation DeletarCategoria($id: ID!) {
        deletarCategoria(id: $id) {
          success
          message
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: deleteMutation,
      variableValues: { id: categoriaId },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarCategoria.success).to.be.true;
  });

  it("non-admin user cannot create categoria", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "user@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Regular User",
        perfis: ["consumidor"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "user@example.com",
      "password123",
    );

    const mutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
          nome
        }
      }
    `;

    const context = APIGraphql.buildContext(session.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: { nome: "Test", status: "ativo" },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.not.be.undefined;
    expect(result.errors[0].message).to.equal("Admin required");
  });

  // SubmissaoProduto tests
  it("admin user can create submissao produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const fornecedor = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    const mutation = `
      mutation CriarSubmissaoProduto($input: CriarSubmissaoProdutoInput!) {
        criarSubmissaoProduto(input: $input) {
          id
          nomeProduto
          precoUnidade
          medida
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: {
          fornecedorId: fornecedor.id,
          nomeProduto: "Tomate Orgânico",
          descricao: "Tomate cultivado sem agrotóxicos",
          precoUnidade: 4.5,
          medida: "kg",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarSubmissaoProduto.nomeProduto).to.equal(
      "Tomate Orgânico",
    );
    expect(result.data.criarSubmissaoProduto.status).to.equal("pendente");
  });

  it("admin user can approve submissao produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const fornecedor = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create submissao first
    const { SubmissaoProdutoService } = require("../src/services/services.js");
    const submissaoService = new SubmissaoProdutoService();
    const submissao = await submissaoService.criarSubmissao({
      fornecedorId: fornecedor.id,
      nomeProduto: "Alface",
      precoUnidade: 3.0,
      medida: "unidade",
    });

    const mutation = `
      mutation AprovarSubmissaoProduto($id: ID!, $input: AprovarSubmissaoInput) {
        aprovarSubmissaoProduto(id: $id, input: $input) {
          id
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        id: submissao.id,
        input: { precoUnidade: 3.5 },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.aprovarSubmissaoProduto.status).to.equal("aprovado");
  });

  it("admin user can reject submissao produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const fornecedor = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create submissao first
    const { SubmissaoProdutoService } = require("../src/services/services.js");
    const submissaoService = new SubmissaoProdutoService();
    const submissao = await submissaoService.criarSubmissao({
      fornecedorId: fornecedor.id,
      nomeProduto: "Produto Ruim",
      precoUnidade: 100.0,
      medida: "kg",
    });

    const mutation = `
      mutation ReprovarSubmissaoProduto($id: ID!, $motivoReprovacao: String!) {
        reprovarSubmissaoProduto(id: $id, motivoReprovacao: $motivoReprovacao) {
          id
          status
          motivoReprovacao
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        id: submissao.id,
        motivoReprovacao: "Preço muito alto",
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.reprovarSubmissaoProduto.status).to.equal("reprovado");
    expect(result.data.reprovarSubmissaoProduto.motivoReprovacao).to.equal(
      "Preço muito alto",
    );
  });

  it("admin user can list submissoes produtos", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const fornecedor = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create submissoes
    const { SubmissaoProdutoService } = require("../src/services/services.js");
    const submissaoService = new SubmissaoProdutoService();
    await submissaoService.criarSubmissao({
      fornecedorId: fornecedor.id,
      nomeProduto: "Produto 1",
      precoUnidade: 5.0,
      medida: "kg",
    });
    await submissaoService.criarSubmissao({
      fornecedorId: fornecedor.id,
      nomeProduto: "Produto 2",
      precoUnidade: 10.0,
      medida: "unidade",
    });

    const query = `
      query ListarSubmissoesProdutos {
        listarSubmissoesProdutos {
          id
          nomeProduto
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarSubmissoesProdutos).to.have.lengthOf(2);
  });

  it("admin user can delete submissao produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const fornecedor = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create submissao
    const { SubmissaoProdutoService } = require("../src/services/services.js");
    const submissaoService = new SubmissaoProdutoService();
    const submissao = await submissaoService.criarSubmissao({
      fornecedorId: fornecedor.id,
      nomeProduto: "Produto para Deletar",
      precoUnidade: 5.0,
      medida: "kg",
    });

    const mutation = `
      mutation DeletarSubmissaoProduto($id: ID!) {
        deletarSubmissaoProduto(id: $id)
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: { id: submissao.id },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarSubmissaoProduto).to.be.true;
  });

  it("admin user can list submissoes by status", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const fornecedor = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create submissoes with different status
    const { SubmissaoProdutoService } = require("../src/services/services.js");
    const submissaoService = new SubmissaoProdutoService();

    await submissaoService.criarSubmissao({
      fornecedorId: fornecedor.id,
      nomeProduto: "Pendente 1",
      precoUnidade: 5.0,
      medida: "kg",
    });

    const aprovada = await submissaoService.criarSubmissao({
      fornecedorId: fornecedor.id,
      nomeProduto: "Aprovada",
      precoUnidade: 10.0,
      medida: "unidade",
    });
    await submissaoService.aprovarSubmissao(aprovada.id);

    const query = `
      query ListarSubmissoesPorStatus($status: String!) {
        listarSubmissoesPorStatus(status: $status) {
          id
          nomeProduto
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { status: "pendente" },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarSubmissoesPorStatus).to.have.lengthOf(1);
    expect(result.data.listarSubmissoesPorStatus[0].status).to.equal(
      "pendente",
    );
  });
});

describe("ProdutoComercializavel GraphQL", function () {
  it("admin user can create produto comercializavel", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // First create a categoria
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    // Create a produto base
    const createProdutoMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
        }
      }
    `;

    const produtoResult = await graphql({
      schema: APIGraphql.schema,
      source: createProdutoMutation,
      variableValues: {
        input: {
          nome: "Maçã Fuji",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoId = parseInt(produtoResult.data.criarProduto.id);

    // Create produto comercializavel
    const mutation = `
      mutation CriarProdutoComercializavel($input: CriarProdutoComercializavelInput!) {
        criarProdutoComercializavel(input: $input) {
          id
          produtoId
          medida
          pesoKg
          precoBase
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: {
          produtoId: produtoId,
          medida: "unidade",
          pesoKg: 0.2,
          precoBase: 2.5,
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarProdutoComercializavel.medida).to.equal("unidade");
    expect(result.data.criarProdutoComercializavel.pesoKg).to.equal(0.2);
    expect(result.data.criarProdutoComercializavel.precoBase).to.equal(2.5);
    expect(result.data.criarProdutoComercializavel.status).to.equal("ativo");
  });

  it("admin user can list produtos comercializaveis", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    const query = `
      query ListarProdutosComercializaveis {
        listarProdutosComercializaveis {
          id
          medida
          pesoKg
          precoBase
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarProdutosComercializaveis).to.be.an("array");
  });

  it("admin user can find produto comercializavel by id", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // Create categoria, produto and produto comercializavel
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    const createProdutoMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
        }
      }
    `;

    const produtoResult = await graphql({
      schema: APIGraphql.schema,
      source: createProdutoMutation,
      variableValues: {
        input: {
          nome: "Banana Prata",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoId = parseInt(produtoResult.data.criarProduto.id);

    const createMutation = `
      mutation CriarProdutoComercializavel($input: CriarProdutoComercializavelInput!) {
        criarProdutoComercializavel(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          produtoId: produtoId,
          medida: "dúzia",
          pesoKg: 1.2,
          precoBase: 15.0,
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoComercializavelId =
      createResult.data.criarProdutoComercializavel.id;

    // Find by id
    const query = `
      query BuscarProdutoComercializavel($id: ID!) {
        buscarProdutoComercializavel(id: $id) {
          id
          medida
          pesoKg
          precoBase
          produto {
            id
            nome
          }
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { id: produtoComercializavelId },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.buscarProdutoComercializavel.medida).to.equal("dúzia");
    expect(result.data.buscarProdutoComercializavel.produto.nome).to.equal(
      "Banana Prata",
    );
  });

  it("admin user can update produto comercializavel", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // Create categoria and produto
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    const createProdutoMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
        }
      }
    `;

    const produtoResult = await graphql({
      schema: APIGraphql.schema,
      source: createProdutoMutation,
      variableValues: {
        input: {
          nome: "Pera Williams",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoId = parseInt(produtoResult.data.criarProduto.id);

    // Create produto comercializavel
    const createMutation = `
      mutation CriarProdutoComercializavel($input: CriarProdutoComercializavelInput!) {
        criarProdutoComercializavel(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          produtoId: produtoId,
          medida: "caixa",
          pesoKg: 5.0,
          precoBase: 45.0,
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoComercializavelId =
      createResult.data.criarProdutoComercializavel.id;

    // Update produto comercializavel
    const mutation = `
      mutation AtualizarProdutoComercializavel($id: ID!, $input: AtualizarProdutoComercializavelInput!) {
        atualizarProdutoComercializavel(id: $id, input: $input) {
          id
          medida
          precoBase
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        id: produtoComercializavelId,
        input: {
          medida: "unidade",
          precoBase: 3.5,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarProdutoComercializavel.medida).to.equal(
      "unidade",
    );
    expect(result.data.atualizarProdutoComercializavel.precoBase).to.equal(3.5);
  });

  it("admin user can delete produto comercializavel", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // Create categoria and produto
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    const createProdutoMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
        }
      }
    `;

    const produtoResult = await graphql({
      schema: APIGraphql.schema,
      source: createProdutoMutation,
      variableValues: {
        input: {
          nome: "Uva Itália",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoId = parseInt(produtoResult.data.criarProduto.id);

    // Create produto comercializavel
    const createMutation = `
      mutation CriarProdutoComercializavel($input: CriarProdutoComercializavelInput!) {
        criarProdutoComercializavel(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          produtoId: produtoId,
          medida: "kg",
          pesoKg: 1.0,
          precoBase: 12.0,
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoComercializavelId =
      createResult.data.criarProdutoComercializavel.id;

    // Delete produto comercializavel
    const mutation = `
      mutation DeletarProdutoComercializavel($id: ID!) {
        deletarProdutoComercializavel(id: $id)
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: { id: produtoComercializavelId },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarProdutoComercializavel).to.be.true;
  });

  it("admin user can list produtos comercializaveis by produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // Create categoria and produto
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    const createProdutoMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
        }
      }
    `;

    const produtoResult = await graphql({
      schema: APIGraphql.schema,
      source: createProdutoMutation,
      variableValues: {
        input: {
          nome: "Laranja",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoId = parseInt(produtoResult.data.criarProduto.id);

    // Create multiple produtos comercializaveis for the same produto
    const createMutation = `
      mutation CriarProdutoComercializavel($input: CriarProdutoComercializavelInput!) {
        criarProdutoComercializavel(input: $input) {
          id
        }
      }
    `;

    await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          produtoId: produtoId,
          medida: "unidade",
          pesoKg: 0.2,
          precoBase: 1.5,
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          produtoId: produtoId,
          medida: "dúzia",
          pesoKg: 2.4,
          precoBase: 15.0,
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    // List by produto
    const query = `
      query ListarProdutosComercializaveisPorProduto($produtoId: Int!) {
        listarProdutosComercializaveisPorProduto(produtoId: $produtoId) {
          id
          medida
          precoBase
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { produtoId: produtoId },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarProdutosComercializaveisPorProduto).to.have.length(
      2,
    );
  });
});

describe("Produto GraphQL", function () {
  it("admin user can create produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // First create a categoria
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    const mutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
          nome
          status
          descritivo
          categoriaId
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: {
          nome: "Maçã Fuji",
          status: "ativo",
          descritivo: "Maçã fresca e crocante",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarProduto.nome).to.equal("Maçã Fuji");
    expect(result.data.criarProduto.status).to.equal("ativo");
    expect(result.data.criarProduto.descritivo).to.equal(
      "Maçã fresca e crocante",
    );
  });

  it("admin user can list produtos", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // Create categoria first
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    // Create some produtos
    const createMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
          nome
        }
      }
    `;

    await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          nome: "Maçã",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          nome: "Banana",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    // List produtos
    const query = `
      query ListarProdutos {
        listarProdutos {
          id
          nome
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarProdutos).to.have.lengthOf(2);
    const nomes = result.data.listarProdutos.map((p) => p.nome).sort();
    expect(nomes).to.deep.equal(["Banana", "Maçã"]);
  });

  it("admin user can find produto by id", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // Create categoria first
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    // Create a produto first
    const createMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          nome: "Pera",
          status: "ativo",
          descritivo: "Pera fresca",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoId = createResult.data.criarProduto.id;

    // Find produto by id
    const query = `
      query BuscarProduto($id: ID!) {
        buscarProduto(id: $id) {
          id
          nome
          descritivo
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { id: produtoId },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.buscarProduto.nome).to.equal("Pera");
    expect(result.data.buscarProduto.descritivo).to.equal("Pera fresca");
  });

  it("admin user can update produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // Create categoria first
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    // Create a produto first
    const createMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          nome: "Produto Original",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const produtoId = createResult.data.criarProduto.id;

    // Update the produto
    const mutation = `
      mutation AtualizarProduto($id: ID!, $input: AtualizarProdutoInput!) {
        atualizarProduto(id: $id, input: $input) {
          id
          nome
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        id: produtoId,
        input: {
          nome: "Produto Atualizado",
          status: "inativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarProduto.nome).to.equal("Produto Atualizado");
    expect(result.data.atualizarProduto.status).to.equal("inativo");
  });

  it("admin user can delete produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    // Create categoria first
    const createCategoriaMutation = `
      mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
        criarCategoria(input: $input) {
          id
        }
      }
    `;

    const categoriaResult = await graphql({
      schema: APIGraphql.schema,
      source: createCategoriaMutation,
      variableValues: {
        input: {
          nome: "Frutas",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    const categoriaId = parseInt(categoriaResult.data.criarCategoria.id);

    // Create a produto first
    const createMutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: createMutation,
      variableValues: {
        input: {
          nome: "Produto para Deletar",
          status: "ativo",
          categoriaId: categoriaId,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(createResult.errors).to.be.undefined;
    const produtoId = createResult.data.criarProduto.id;

    // Delete the produto
    const mutation = `
      mutation DeletarProduto($id: ID!) {
        deletarProduto(id: $id)
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: { id: produtoId },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarProduto).to.be.true;
  });

  it("non-admin user cannot create produto", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "user@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Regular User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "user@example.com",
      "password123",
    );

    const context = APIGraphql.buildContext(session.token);

    const mutation = `
      mutation CriarProduto($input: CriarProdutoInput!) {
        criarProduto(input: $input) {
          id
          nome
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: {
          nome: "Produto Teste",
          status: "ativo",
          categoriaId: 1,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.not.be.undefined;
    expect(result.errors[0].message).to.equal("Admin required");
  });
});

describe("Ciclo GraphQL", function () {
  it("admin user can create ciclo", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create ponto de entrega first
    const { PontoEntrega } = require("../models");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo ao mercado",
      status: "ativo",
    });

    const agora = new Date().toISOString();
    const umaSemanaDepois = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const mutation = `
      mutation CriarCiclo($input: CriarCicloInput!) {
        criarCiclo(input: $input) {
          id
          nome
          status
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: {
          nome: "Ciclo Teste",
          ofertaInicio: agora,
          ofertaFim: umaSemanaDepois,
          pontoEntregaId: pontoEntrega.id,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarCiclo.nome).to.equal("Ciclo Teste");
    expect(result.data.criarCiclo.status).to.equal("oferta");
  });

  it("admin user can list ciclos", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create ponto de entrega and ciclo
    const { PontoEntrega } = require("../models");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo ao shopping",
      status: "ativo",
    });

    const { CicloService } = require("../src/services/services.js");
    const cicloService = new CicloService();
    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

    await cicloService.criarCiclo({
      nome: "Ciclo 1",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
    });
    await cicloService.criarCiclo({
      nome: "Ciclo 2",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
    });

    const query = `
      query ListarCiclos {
        listarCiclos {
          total
          ciclos {
            id
            nome
            status
          }
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarCiclos.ciclos).to.have.lengthOf(2);
  });

  it("admin user can update ciclo", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create ponto de entrega and ciclo
    const { PontoEntrega } = require("../models");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo ao shopping",
      status: "ativo",
    });

    const { CicloService } = require("../src/services/services.js");
    const cicloService = new CicloService();
    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

    const ciclo = await cicloService.criarCiclo({
      nome: "Ciclo Original",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
    });

    const mutation = `
      mutation AtualizarCiclo($id: ID!, $input: AtualizarCicloInput!) {
        atualizarCiclo(id: $id, input: $input) {
          id
          nome
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        id: ciclo.id,
        input: {
          nome: "Ciclo Atualizado",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarCiclo.nome).to.equal("Ciclo Atualizado");
  });

  it("admin user can delete ciclo", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create ponto de entrega and ciclo
    const { PontoEntrega } = require("../models");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo ao shopping",
      status: "ativo",
    });

    const { CicloService } = require("../src/services/services.js");
    const cicloService = new CicloService();
    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

    const ciclo = await cicloService.criarCiclo({
      nome: "Ciclo para Deletar",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
    });

    const mutation = `
      mutation DeletarCiclo($id: ID!) {
        deletarCiclo(id: $id)
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: { id: ciclo.id },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarCiclo).to.be.true;
  });

  it("admin user can get ciclo by id", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
      "admin",
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );
    const context = APIGraphql.buildContext(session.token);

    // Create ponto de entrega and ciclo
    const { PontoEntrega } = require("../models");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo ao shopping",
      status: "ativo",
    });

    const { CicloService } = require("../src/services/services.js");
    const cicloService = new CicloService();
    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

    const ciclo = await cicloService.criarCiclo({
      nome: "Ciclo Específico",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
    });

    const query = `
      query BuscarCiclo($id: ID!) {
        buscarCiclo(id: $id) {
          id
          nome
          status
          pontoEntrega {
            id
            nome
          }
        }
      }
    `;

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { id: ciclo.id },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.buscarCiclo.nome).to.equal("Ciclo Específico");
    expect(result.data.buscarCiclo.pontoEntrega.nome).to.equal("Ponto Teste");
  });
});

describe("Oferta GraphQL", function () {
  it("authenticated user can create oferta", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const usuario = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "fornecedor@example.com",
      "password123",
    );

    const { PontoEntrega, Ciclo } = require("../models/index.js");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo à estação de metrô",
      status: "ativo",
    });

    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
    const ciclo = await Ciclo.create({
      nome: "Ciclo Teste",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });

    const mutation = `
      mutation CriarOferta($input: CriarOfertaInput!) {
        criarOferta(input: $input) {
          id
          cicloId
          usuarioId
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(session.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: {
          cicloId: ciclo.id,
          usuarioId: usuario.id,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    if (result.errors)
      console.log(
        "criarOferta errors:",
        JSON.stringify(result.errors, null, 2),
      );
    expect(result.errors).to.be.undefined;
    expect(result.data.criarOferta.cicloId).to.equal(ciclo.id);
    expect(result.data.criarOferta.usuarioId).to.equal(usuario.id);
  });

  it("authenticated user can add produto to oferta", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const usuario = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "fornecedor@example.com",
      "password123",
    );

    const {
      PontoEntrega,
      Ciclo,
      Produto,
      Oferta,
    } = require("../models/index.js");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo à estação de metrô",
      status: "ativo",
    });

    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
    const ciclo = await Ciclo.create({
      nome: "Ciclo Teste",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });

    const produto = await Produto.create({
      nome: "Tomate",
      medida: "kg",
      valorReferencia: 5.0,
      status: "ativo",
    });

    const oferta = await Oferta.create({
      cicloId: ciclo.id,
      usuarioId: usuario.id,
      status: "ativo",
    });

    const mutation = `
      mutation AdicionarProdutoOferta($ofertaId: ID!, $input: AdicionarProdutoOfertaInput!) {
        adicionarProdutoOferta(ofertaId: $ofertaId, input: $input) {
          id
          ofertaId
          produtoId
          quantidade
          valorOferta
        }
      }
    `;

    const context = APIGraphql.buildContext(session.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        ofertaId: oferta.id,
        input: {
          produtoId: produto.id,
          quantidade: 10,
          valorOferta: 4.5,
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.adicionarProdutoOferta.produtoId).to.equal(produto.id);
    expect(result.data.adicionarProdutoOferta.quantidade).to.equal(10);
    expect(result.data.adicionarProdutoOferta.valorOferta).to.equal(4.5);
  });

  it("authenticated user can get oferta with produtos", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    const usuario = await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "fornecedor@example.com",
      "password123",
    );

    const {
      PontoEntrega,
      Ciclo,
      Produto,
      Oferta,
      OfertaProdutos,
    } = require("../models/index.js");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo à estação de metrô",
      status: "ativo",
    });

    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
    const ciclo = await Ciclo.create({
      nome: "Ciclo Teste",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });

    const produto = await Produto.create({
      nome: "Tomate",
      medida: "kg",
      valorReferencia: 5.0,
      status: "ativo",
    });

    const oferta = await Oferta.create({
      cicloId: ciclo.id,
      usuarioId: usuario.id,
      status: "ativo",
    });

    await OfertaProdutos.create({
      ofertaId: oferta.id,
      produtoId: produto.id,
      quantidade: 10,
      valorOferta: 4.5,
    });

    const query = `
      query BuscarOferta($id: ID!) {
        buscarOferta(id: $id) {
          id
          cicloId
          usuarioId
          status
          ofertaProdutos {
            id
            produtoId
            quantidade
            valorOferta
            produto {
              id
              nome
            }
          }
        }
      }
    `;

    const context = APIGraphql.buildContext(session.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { id: oferta.id },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    if (result.errors)
      console.log(
        "buscarOferta errors:",
        JSON.stringify(result.errors, null, 2),
      );
    expect(result.errors).to.be.undefined;
    expect(result.data.buscarOferta.id).to.equal(String(oferta.id));
    expect(result.data.buscarOferta.ofertaProdutos).to.have.lengthOf(1);
    expect(result.data.buscarOferta.ofertaProdutos[0].produto.nome).to.equal(
      "Tomate",
    );
  });

  it("authenticated user can remove produto from oferta", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "1234567890";
      },
    });

    await usuarioService.create(
      {
        email: "fornecedor@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Fornecedor User",
        perfis: ["fornecedor"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "fornecedor@example.com",
      "password123",
    );

    const {
      PontoEntrega,
      Ciclo,
      Produto,
      Oferta,
      OfertaProdutos,
    } = require("../models/index.js");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo à estação de metrô",
      status: "ativo",
    });

    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
    const ciclo = await Ciclo.create({
      nome: "Ciclo Teste",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });

    const produto = await Produto.create({
      nome: "Tomate",
      medida: "kg",
      valorReferencia: 5.0,
      status: "ativo",
    });

    const { Usuario } = require("../models/index.js");
    const usuario = await Usuario.findOne({
      where: { email: "fornecedor@example.com" },
    });
    const oferta = await Oferta.create({
      cicloId: ciclo.id,
      usuarioId: usuario.id,
      status: "ativo",
    });

    const ofertaProduto = await OfertaProdutos.create({
      ofertaId: oferta.id,
      produtoId: produto.id,
      quantidade: 10,
      valorOferta: 4.5,
    });

    const mutation = `
      mutation RemoverProdutoOferta($ofertaProdutoId: ID!) {
        removerProdutoOferta(ofertaProdutoId: $ofertaProdutoId)
      }
    `;

    const context = APIGraphql.buildContext(session.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: { ofertaProdutoId: ofertaProduto.id },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.removerProdutoOferta).to.be.true;
  });

  it("admin user can migrar ofertas between ciclos", async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "admin-uuid";
      },
    });

    await usuarioService.create(
      {
        email: "admin@example.com",
        senha: "password123",
        phoneNumber: "11999887766",
      },
      {
        nome: "Admin User",
        perfis: ["admin"],
        status: "ativo",
      },
    );

    const session = await usuarioService.login(
      "admin@example.com",
      "password123",
    );

    const {
      PontoEntrega,
      Ciclo,
      Produto,
      Oferta,
      OfertaProdutos,
      PedidoConsumidores,
      PedidoConsumidoresProdutos,
    } = require("../models/index.js");

    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo à estação de metrô",
      status: "ativo",
    });

    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

    const cicloOrigem = await Ciclo.create({
      nome: "Ciclo Origem",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
      status: "finalizado",
    });

    const cicloDestino = await Ciclo.create({
      nome: "Ciclo Destino",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });

    const produto = await Produto.create({
      nome: "Tomate",
      medida: "kg",
      valorReferencia: 5.0,
      status: "ativo",
    });

    const { Usuario } = require("../models/index.js");
    const usuario = await Usuario.findOne({
      where: { email: "admin@example.com" },
    });

    const oferta = await Oferta.create({
      cicloId: cicloOrigem.id,
      usuarioId: usuario.id,
      status: "ativa",
    });

    await OfertaProdutos.create({
      ofertaId: oferta.id,
      produtoId: produto.id,
      quantidade: 100,
      valorOferta: 4.5,
    });

    const pedido = await PedidoConsumidores.create({
      cicloId: cicloOrigem.id,
      usuarioId: usuario.id,
      status: "confirmado",
    });

    await PedidoConsumidoresProdutos.create({
      pedidoConsumidorId: pedido.id,
      produtoId: produto.id,
      quantidade: 30,
      valorOferta: 4.5,
    });

    const mutation = `
      mutation MigrarOfertas($input: MigrarOfertasInput!) {
        migrarOfertas(input: $input) {
          id
          cicloId
          usuarioId
          status
          observacao
        }
      }
    `;

    const context = APIGraphql.buildContext(session.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: {
        input: {
          ciclosOrigemIds: [cicloOrigem.id],
          cicloDestinoId: cicloDestino.id,
          produtos: [
            {
              produtoId: produto.id,
              quantidade: 50,
              valorOferta: 4.5,
            },
          ],
        },
      },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.migrarOfertas).to.be.an("array");
    expect(result.data.migrarOfertas).to.have.lengthOf(1);
    expect(result.data.migrarOfertas[0].cicloId).to.equal(cicloDestino.id);
    expect(result.data.migrarOfertas[0].observacao).to.include(
      "Migrado de ciclos",
    );
  });
});

describe("PontoEntrega GraphQL", function () {
  let adminSession;

  beforeEach(async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "admin-token-pontoentrega";
      },
    });
    await usuarioService.create(
      { email: "admin@example.com", senha: "password" },
      { perfis: ["admin"] },
    );
    adminSession = await usuarioService.login("admin@example.com", "password");
  });

  it("admin user can create ponto de entrega", async function () {
    const mutation = `
      mutation CriarPontoEntrega($input: CriarPontoEntregaInput!) {
        criarPontoEntrega(input: $input) {
          id
          nome
          endereco
          bairro
          cidade
          estado
          cep
          pontoReferencia
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        input: {
          nome: "Centro - Praça Principal",
          endereco: "Rua das Flores, 123",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01310-100",
          pontoReferencia: "Próximo à praça central",
          status: "ativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarPontoEntrega.nome).to.equal(
      "Centro - Praça Principal",
    );
    expect(result.data.criarPontoEntrega.endereco).to.equal(
      "Rua das Flores, 123",
    );
    expect(result.data.criarPontoEntrega.bairro).to.equal("Centro");
    expect(result.data.criarPontoEntrega.cidade).to.equal("São Paulo");
    expect(result.data.criarPontoEntrega.estado).to.equal("SP");
    expect(result.data.criarPontoEntrega.cep).to.equal("01310-100");
    expect(result.data.criarPontoEntrega.pontoReferencia).to.equal(
      "Próximo à praça central",
    );
    expect(result.data.criarPontoEntrega.status).to.equal("ativo");
  });

  it("admin user can list all pontos de entrega", async function () {
    const { PontoEntrega } = require("../models/index.js");
    await PontoEntrega.create({
      nome: "Ponto A",
      endereco: "Endereço A",
      bairro: "Centro",
      cidade: "Cidade Teste",
      estado: "RS",
      cep: "90000-000",
      pontoReferencia: "Próximo ao mercado",
      status: "ativo",
    });
    await PontoEntrega.create({
      nome: "Ponto B",
      endereco: "Endereço B",
      bairro: "Centro",
      cidade: "Cidade Teste",
      estado: "RS",
      cep: "90000-000",
      pontoReferencia: "Próximo à praça",
      status: "inativo",
    });

    const query = `
      query ListarPontosEntrega {
        listarPontosEntrega {
          id
          nome
          endereco
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarPontosEntrega).to.have.lengthOf(2);
    const nomes = result.data.listarPontosEntrega.map((p) => p.nome).sort();
    expect(nomes).to.deep.equal(["Ponto A", "Ponto B"]);
  });

  it("admin user can list only active pontos de entrega", async function () {
    const { PontoEntrega } = require("../models/index.js");
    await PontoEntrega.create({
      nome: "Ponto Ativo",
      endereco: "Endereço A",
      bairro: "Centro",
      cidade: "Cidade Teste",
      estado: "RS",
      cep: "90000-000",
      pontoReferencia: "Próximo ao mercado",
      status: "ativo",
    });
    await PontoEntrega.create({
      nome: "Ponto Inativo",
      endereco: "Endereço B",
      bairro: "Centro",
      cidade: "Cidade Teste",
      estado: "RS",
      cep: "90000-000",
      pontoReferencia: "Próximo à praça",
      status: "inativo",
    });

    const query = `
      query ListarPontosEntregaAtivos {
        listarPontosEntregaAtivos {
          id
          nome
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarPontosEntregaAtivos).to.have.lengthOf(1);
    expect(result.data.listarPontosEntregaAtivos[0].nome).to.equal(
      "Ponto Ativo",
    );
    expect(result.data.listarPontosEntregaAtivos[0].status).to.equal("ativo");
  });

  it("admin user can find ponto de entrega by id", async function () {
    const { PontoEntrega } = require("../models/index.js");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Teste",
      endereco: "Rua Teste, 456",
      bairro: "Bairro Teste",
      cidade: "Cidade Teste",
      estado: "MG",
      cep: "30000-000",
      pontoReferencia: "Próximo ao terminal",
      status: "ativo",
    });

    const query = `
      query BuscarPontoEntrega($id: ID!) {
        buscarPontoEntrega(id: $id) {
          id
          nome
          endereco
          bairro
          cidade
          estado
          cep
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { id: pontoEntrega.id },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.buscarPontoEntrega.nome).to.equal("Ponto Teste");
    expect(result.data.buscarPontoEntrega.bairro).to.equal("Bairro Teste");
    expect(result.data.buscarPontoEntrega.cidade).to.equal("Cidade Teste");
  });

  it("error finding non-existent ponto de entrega", async function () {
    const query = `
      query BuscarPontoEntrega($id: ID!) {
        buscarPontoEntrega(id: $id) {
          id
          nome
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      variableValues: { id: 99999 },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.exist;
    expect(result.errors[0].message).to.match(/não encontrado|not found/i);
  });

  it("admin user can update ponto de entrega", async function () {
    const { PontoEntrega } = require("../models/index.js");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Original",
      endereco: "Endereço Original",
      bairro: "Bairro Original",
      cidade: "Cidade Original",
      estado: "RS",
      cep: "90000-000",
      pontoReferencia: "Referência Original",
      status: "ativo",
    });

    const mutation = `
      mutation AtualizarPontoEntrega($id: ID!, $input: AtualizarPontoEntregaInput!) {
        atualizarPontoEntrega(id: $id, input: $input) {
          id
          nome
          endereco
          bairro
          cidade
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: {
        id: pontoEntrega.id,
        input: {
          nome: "Ponto Atualizado",
          endereco: "Endereço Atualizado",
          bairro: "Bairro Novo",
          cidade: "Cidade Nova",
          status: "inativo",
        },
      },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarPontoEntrega.nome).to.equal("Ponto Atualizado");
    expect(result.data.atualizarPontoEntrega.endereco).to.equal(
      "Endereço Atualizado",
    );
    expect(result.data.atualizarPontoEntrega.bairro).to.equal("Bairro Novo");
    expect(result.data.atualizarPontoEntrega.cidade).to.equal("Cidade Nova");
    expect(result.data.atualizarPontoEntrega.status).to.equal("inativo");
  });

  it("admin user can delete ponto de entrega", async function () {
    const { PontoEntrega } = require("../models/index.js");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto a Deletar",
      endereco: "Endereço",
      bairro: "Centro",
      cidade: "Cidade Teste",
      estado: "RS",
      cep: "90000-000",
      pontoReferencia: "Próximo ao mercado",
      status: "ativo",
    });

    const mutation = `
      mutation DeletarPontoEntrega($id: ID!) {
        deletarPontoEntrega(id: $id)
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      variableValues: { id: pontoEntrega.id },
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarPontoEntrega).to.be.true;

    const deletedPonto = await PontoEntrega.findByPk(pontoEntrega.id);
    expect(deletedPonto).to.be.null;
  });

  it("non-admin user cannot list pontos de entrega", async function () {
    const usuarioService = new UsuarioService({
      uuid4() {
        return "fornecedor-token-pe";
      },
    });
    await usuarioService.create(
      { email: "fornecedor@example.com", senha: "password" },
      { perfis: ["fornecedor"] },
    );
    const fornecedorSession = await usuarioService.login(
      "fornecedor@example.com",
      "password",
    );

    const query = `
      query ListarPontosEntrega {
        listarPontosEntrega {
          id
          nome
        }
      }
    `;

    const context = APIGraphql.buildContext(fornecedorSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.exist;
    expect(result.errors[0].message).to.equal("Admin required");
  });

  it("non-admin user can list active pontos de entrega", async function () {
    const usuarioService = new UsuarioService({
      uuid4() {
        return "fornecedor-token-pe-ativos";
      },
    });
    await usuarioService.create(
      { email: "fornecedor2@example.com", senha: "password" },
      { perfis: ["fornecedor"] },
    );
    const fornecedorSession = await usuarioService.login(
      "fornecedor2@example.com",
      "password",
    );

    const { PontoEntrega } = require("../models/index.js");
    await PontoEntrega.create({
      nome: "Ponto Disponível",
      endereco: "Endereço",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo à praça central",
      status: "ativo",
    });

    const query = `
      query ListarPontosEntregaAtivos {
        listarPontosEntregaAtivos {
          id
          nome
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(fornecedorSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarPontosEntregaAtivos).to.have.lengthOf(1);
    expect(result.data.listarPontosEntregaAtivos[0].nome).to.equal(
      "Ponto Disponível",
    );
  });
});

describe("Mercado GraphQL", function () {
  let adminSession;

  beforeEach(async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "admin-token-mercado";
      },
    });
    await usuarioService.create(
      { email: "admin@example.com", senha: "password" },
      { perfis: ["admin"] },
    );
    adminSession = await usuarioService.login("admin@example.com", "password");
  });

  it("admin user can create mercado tipo cesta", async function () {
    const mutation = `
      mutation CriarMercado($input: CriarMercadoInput!) {
        criarMercado(input: $input) {
          id
          nome
          tipo
          responsavelId
          taxaAdministrativa
          valorMaximoCesta
          status
          pontosEntrega {
            id
            nome
            status
          }
        }
      }
    `;

    const variables = {
      input: {
        nome: "Mercado Central",
        tipo: "cesta",
        responsavelId: adminSession.usuarioId,
        taxaAdministrativa: 5.5,
        valorMaximoCesta: 150.0,
        status: "ativo",
        pontosEntrega: [
          {
            nome: "Centro",
            endereco: "Rua Central, 100",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01000-000",
            pontoReferencia: "Próximo ao mercado municipal",
            status: "ativo",
          },
          {
            nome: "Zona Norte",
            endereco: "Av. Norte, 500",
            bairro: "Zona Norte",
            cidade: "São Paulo",
            estado: "SP",
            cep: "02000-000",
            pontoReferencia: "Ao lado da estação de metrô",
            status: "ativo",
          },
        ],
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    if (result.errors) {
      console.log("GraphQL Errors:", JSON.stringify(result.errors, null, 2));
    }
    expect(result.errors).to.be.undefined;
    expect(result.data.criarMercado.nome).to.equal("Mercado Central");
    expect(result.data.criarMercado.tipo).to.equal("cesta");
    expect(result.data.criarMercado.valorMaximoCesta).to.equal(150.0);
    expect(result.data.criarMercado.pontosEntrega).to.have.lengthOf(2);
    expect(result.data.criarMercado.pontosEntrega[0].nome).to.equal("Centro");
  });

  it("admin user can create mercado tipo lote", async function () {
    const mutation = `
      mutation CriarMercado($input: CriarMercadoInput!) {
        criarMercado(input: $input) {
          id
          nome
          tipo
          status
        }
      }
    `;

    const variables = {
      input: {
        nome: "Mercado Lote 1",
        tipo: "lote",
        responsavelId: adminSession.usuarioId,
        taxaAdministrativa: 3.0,
        status: "ativo",
        pontosEntrega: [
          {
            nome: "Ponto Principal",
            endereco: "Rua Principal, 200",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01100-000",
            pontoReferencia: "Em frente à praça",
            status: "ativo",
          },
        ],
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarMercado.nome).to.equal("Mercado Lote 1");
    expect(result.data.criarMercado.tipo).to.equal("lote");
  });

  it("admin user can list mercados", async function () {
    const mutationCesta = `
      mutation CriarMercado($input: CriarMercadoInput!) {
        criarMercado(input: $input) {
          id
        }
      }
    `;

    await graphql({
      schema: APIGraphql.schema,
      source: mutationCesta,
      rootValue: APIGraphql.rootValue,
      contextValue: APIGraphql.buildContext(adminSession.token),
      variableValues: {
        input: {
          nome: "Mercado 1",
          tipo: "cesta",
          responsavelId: adminSession.usuarioId,
          valorMaximoCesta: 100,
          status: "ativo",
          pontosEntrega: [
            {
              nome: "Ponto 1",
              endereco: "Rua Teste, 100",
              bairro: "Centro",
              cidade: "São Paulo",
              estado: "SP",
              cep: "01000-000",
              pontoReferencia: "Próximo à praça",
              status: "ativo",
            },
          ],
        },
      },
    });

    await graphql({
      schema: APIGraphql.schema,
      source: mutationCesta,
      rootValue: APIGraphql.rootValue,
      contextValue: APIGraphql.buildContext(adminSession.token),
      variableValues: {
        input: {
          nome: "Mercado 2",
          tipo: "lote",
          responsavelId: adminSession.usuarioId,
          status: "ativo",
          pontosEntrega: [
            {
              nome: "Ponto 2",
              endereco: "Av. Teste, 200",
              bairro: "Zona Sul",
              cidade: "São Paulo",
              estado: "SP",
              cep: "02000-000",
              pontoReferencia: "Próximo ao shopping",
              status: "ativo",
            },
          ],
        },
      },
    });

    const query = `
      query {
        listarMercados {
          id
          nome
          tipo
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarMercados).to.have.lengthOf(2);
    const nomes = result.data.listarMercados.map((m) => m.nome).sort();
    expect(nomes).to.deep.equal(["Mercado 1", "Mercado 2"]);
  });

  it("admin user can find mercado by id", async function () {
    const mutation = `
      mutation CriarMercado($input: CriarMercadoInput!) {
        criarMercado(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: APIGraphql.buildContext(adminSession.token),
      variableValues: {
        input: {
          nome: "Mercado Teste",
          tipo: "cesta",
          responsavelId: adminSession.usuarioId,
          valorMaximoCesta: 200,
          status: "ativo",
          pontosEntrega: [
            {
              nome: "Centro",
              endereco: "Rua Central, 300",
              bairro: "Centro",
              cidade: "São Paulo",
              estado: "SP",
              cep: "01000-000",
              pontoReferencia: "Próximo à catedral",
              status: "ativo",
            },
          ],
        },
      },
    });

    const mercadoId = createResult.data.criarMercado.id;

    const query = `
      query BuscarMercado($id: ID!) {
        buscarMercado(id: $id) {
          id
          nome
          tipo
          valorMaximoCesta
          responsavel {
            id
            nome
          }
          pontosEntrega {
            nome
          }
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: { id: mercadoId },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.buscarMercado.nome).to.equal("Mercado Teste");
    expect(result.data.buscarMercado.valorMaximoCesta).to.equal(200);
    expect(result.data.buscarMercado.pontosEntrega).to.have.lengthOf(1);
  });

  it("admin user can update mercado", async function () {
    const mutation = `
      mutation CriarMercado($input: CriarMercadoInput!) {
        criarMercado(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: APIGraphql.buildContext(adminSession.token),
      variableValues: {
        input: {
          nome: "Mercado Original",
          tipo: "cesta",
          responsavelId: adminSession.usuarioId,
          valorMaximoCesta: 100,
          taxaAdministrativa: 5,
          status: "ativo",
          pontosEntrega: [
            {
              nome: "Ponto 1",
              endereco: "Rua Original, 400",
              bairro: "Centro",
              cidade: "São Paulo",
              estado: "SP",
              cep: "01000-000",
              pontoReferencia: "Ao lado do banco",
              status: "ativo",
            },
          ],
        },
      },
    });

    const mercadoId = createResult.data.criarMercado.id;

    const updateMutation = `
      mutation AtualizarMercado($id: ID!, $input: AtualizarMercadoInput!) {
        atualizarMercado(id: $id, input: $input) {
          id
          nome
          valorMaximoCesta
          taxaAdministrativa
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: updateMutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: {
        id: mercadoId,
        input: {
          nome: "Mercado Atualizado",
          valorMaximoCesta: 250,
          taxaAdministrativa: 7.5,
        },
      },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarMercado.nome).to.equal("Mercado Atualizado");
    expect(result.data.atualizarMercado.valorMaximoCesta).to.equal(250);
    expect(result.data.atualizarMercado.taxaAdministrativa).to.equal(7.5);
  });

  it("admin user can delete mercado", async function () {
    const mutation = `
      mutation CriarMercado($input: CriarMercadoInput!) {
        criarMercado(input: $input) {
          id
        }
      }
    `;

    const createResult = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: APIGraphql.buildContext(adminSession.token),
      variableValues: {
        input: {
          nome: "Mercado Para Deletar",
          tipo: "cesta",
          responsavelId: adminSession.usuarioId,
          valorMaximoCesta: 150,
          status: "ativo",
          pontosEntrega: [
            {
              nome: "Ponto 1",
              endereco: "Rua Delete, 500",
              bairro: "Centro",
              cidade: "São Paulo",
              estado: "SP",
              cep: "01000-000",
              pontoReferencia: "Próximo à escola",
              status: "ativo",
            },
          ],
        },
      },
    });

    const mercadoId = createResult.data.criarMercado.id;

    const deleteMutation = `
      mutation DeletarMercado($id: ID!) {
        deletarMercado(id: $id)
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: deleteMutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: { id: mercadoId },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarMercado).to.be.true;
  });

  it("admin user can list mercados ativos", async function () {
    const mutationAtivo = `
      mutation CriarMercado($input: CriarMercadoInput!) {
        criarMercado(input: $input) {
          id
        }
      }
    `;
    await graphql({
      schema: APIGraphql.schema,
      source: mutationAtivo,
      rootValue: APIGraphql.rootValue,
      contextValue: APIGraphql.buildContext(adminSession.token),
      variableValues: {
        input: {
          nome: "Ativo 1",
          tipo: "cesta",
          responsavelId: adminSession.usuarioId,
          valorMaximoCesta: 100,
          status: "ativo",
          pontosEntrega: [
            {
              nome: "P1",
              endereco: "Rua Ativo, 600",
              bairro: "Centro",
              cidade: "São Paulo",
              estado: "SP",
              cep: "01000-000",
              pontoReferencia: "Próximo ao parque",
              status: "ativo",
            },
          ],
        },
      },
    });

    await graphql({
      schema: APIGraphql.schema,
      source: mutationAtivo,
      rootValue: APIGraphql.rootValue,
      contextValue: APIGraphql.buildContext(adminSession.token),
      variableValues: {
        input: {
          nome: "Inativo 1",
          tipo: "lote",
          responsavelId: adminSession.usuarioId,
          status: "inativo",
          pontosEntrega: [
            {
              nome: "P2",
              endereco: "Rua Inativo, 700",
              bairro: "Zona Oeste",
              cidade: "São Paulo",
              estado: "SP",
              cep: "03000-000",
              pontoReferencia: "Próximo ao hospital",
              status: "ativo",
            },
          ],
        },
      },
    });

    const query = `
      query {
        listarMercadosAtivos {
          id
          nome
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarMercadosAtivos).to.have.lengthOf(1);
    expect(result.data.listarMercadosAtivos[0].nome).to.equal("Ativo 1");
    expect(result.data.listarMercadosAtivos[0].status).to.equal("ativo");
  });

  it("error when creating mercado tipo cesta without valorMaximoCesta", async function () {
    const mutation = `
      mutation CriarMercado($input: CriarMercadoInput!) {
        criarMercado(input: $input) {
          id
        }
      }
    `;

    const variables = {
      input: {
        nome: "Mercado Sem Valor",
        tipo: "cesta",
        responsavelId: adminSession.usuarioId,
        status: "ativo",
        pontosEntrega: [
          {
            nome: "Ponto 1",
            endereco: "Rua Sem Valor, 800",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01000-000",
            pontoReferencia: "Próximo à biblioteca",
            status: "ativo",
          },
        ],
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.not.be.undefined;
    expect(result.errors[0].message).to.match(
      /valorMaximoCesta é obrigatório/i,
    );
  });
});

describe("PrecoMercado GraphQL", function () {
  const {
    CategoriaProdutosService,
    ProdutoService,
    MercadoService,
    PrecoMercadoService,
  } = require("../src/services/services.js");

  let adminSession;
  let mercadoId;
  let produtoId;

  beforeEach(async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "admin-token-preco";
      },
    });
    await usuarioService.create(
      { email: "admin@example.com", senha: "password" },
      { perfis: ["admin"] },
    );
    adminSession = await usuarioService.login("admin@example.com", "password");

    const categoriaProdutosService = new CategoriaProdutosService();
    const categoria = await categoriaProdutosService.criarCategoria({
      nome: "Frutas",
      status: "ativo",
    });

    const produtoService = new ProdutoService();
    const produto = await produtoService.criarProduto({
      nome: "Banana",
      medida: "kg",
      pesoGrama: 1000,
      valorReferencia: 5.0,
      categoriaId: categoria.id,
      status: "ativo",
    });
    produtoId = produto.id;

    const mercadoService = new MercadoService();
    const mercado = await mercadoService.criarMercado({
      nome: "Mercado Teste",
      tipo: "cesta",
      responsavelId: adminSession.usuarioId,
      valorMaximoCesta: 100,
      status: "ativo",
    });
    mercadoId = mercado.id;
  });

  it("admin user can create preco for produto in mercado", async function () {
    const mutation = `
      mutation CriarPrecoMercado($input: CriarPrecoMercadoInput!) {
        criarPrecoMercado(input: $input) {
          id
          produtoId
          mercadoId
          preco
          status
        }
      }
    `;

    const variables = {
      input: {
        produtoId: produtoId,
        mercadoId: mercadoId,
        preco: 8.5,
        status: "ativo",
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarPrecoMercado.preco).to.equal(8.5);
    expect(result.data.criarPrecoMercado.produtoId).to.equal(produtoId);
    expect(result.data.criarPrecoMercado.mercadoId).to.equal(mercadoId);
  });

  it("admin user can list precos by mercado", async function () {
    const precoMercadoService = new PrecoMercadoService();
    await precoMercadoService.criarPreco({
      produtoId: produtoId,
      mercadoId: mercadoId,
      preco: 8.5,
      status: "ativo",
    });

    const query = `
      query ListarPrecosMercado($mercadoId: Int!) {
        listarPrecosMercado(mercadoId: $mercadoId) {
          id
          preco
          produto {
            nome
          }
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: { mercadoId },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarPrecosMercado).to.have.lengthOf(1);
    expect(result.data.listarPrecosMercado[0].preco).to.equal(8.5);
    expect(result.data.listarPrecosMercado[0].produto.nome).to.equal("Banana");
  });

  it("admin user can update preco", async function () {
    const precoMercadoService = new PrecoMercadoService();
    const preco = await precoMercadoService.criarPreco({
      produtoId: produtoId,
      mercadoId: mercadoId,
      preco: 8.5,
      status: "ativo",
    });

    const mutation = `
      mutation AtualizarPrecoMercado($id: ID!, $input: AtualizarPrecoMercadoInput!) {
        atualizarPrecoMercado(id: $id, input: $input) {
          id
          preco
          status
        }
      }
    `;

    const variables = {
      id: preco.id.toString(),
      input: {
        preco: 9.0,
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarPrecoMercado.preco).to.equal(9.0);
  });

  it("admin user can delete preco", async function () {
    const precoMercadoService = new PrecoMercadoService();
    const preco = await precoMercadoService.criarPreco({
      produtoId: produtoId,
      mercadoId: mercadoId,
      preco: 8.5,
      status: "ativo",
    });

    const mutation = `
      mutation DeletarPrecoMercado($id: ID!) {
        deletarPrecoMercado(id: $id)
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: { id: preco.id.toString() },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarPrecoMercado).to.be.true;

    const precoDeleted = await precoMercadoService.buscarPreco(preco.id);
    expect(precoDeleted).to.be.null;
  });

  it("error when creating duplicate preco for same produto and mercado", async function () {
    const precoMercadoService = new PrecoMercadoService();
    await precoMercadoService.criarPreco({
      produtoId: produtoId,
      mercadoId: mercadoId,
      preco: 8.5,
      status: "ativo",
    });

    const mutation = `
      mutation CriarPrecoMercado($input: CriarPrecoMercadoInput!) {
        criarPrecoMercado(input: $input) {
          id
        }
      }
    `;

    const variables = {
      input: {
        produtoId: produtoId,
        mercadoId: mercadoId,
        preco: 10.0,
        status: "ativo",
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.not.be.undefined;
    expect(result.errors[0].message).to.match(/Já existe um preço cadastrado/i);
  });
});

describe("Pagamento GraphQL", function () {
  const {
    CicloService,
    MercadoService,
    PagamentoService,
  } = require("../src/services/services.js");

  let adminSession;
  let fornecedorSession;
  let consumidorSession;
  let cicloId;
  let mercadoId;

  beforeEach(async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "admin-token-pagamento";
      },
    });
    await usuarioService.create(
      { email: "admin@example.com", senha: "password" },
      { perfis: ["admin"] },
    );
    adminSession = await usuarioService.login("admin@example.com", "password");

    usuarioService.uuid = () => "fornecedor-token";
    await usuarioService.create(
      { email: "fornecedor@example.com", senha: "password" },
      { perfis: ["fornecedor"] },
    );
    fornecedorSession = await usuarioService.login(
      "fornecedor@example.com",
      "password",
    );

    usuarioService.uuid = () => "consumidor-token";
    await usuarioService.create(
      { email: "consumidor@example.com", senha: "password" },
      { perfis: ["consumidor"] },
    );
    consumidorSession = await usuarioService.login(
      "consumidor@example.com",
      "password",
    );

    const { PontoEntrega } = require("../models/index.js");
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Test",
      endereco: "Rua Principal, 100",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo à rodoviária",
      status: "ativo",
    });

    const cicloService = new CicloService();
    const ciclo = await cicloService.criarCiclo({
      nome: "Ciclo Teste",
      ofertaInicio: "2025-01-01",
      ofertaFim: "2025-01-15",
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });
    cicloId = ciclo.id;

    const mercadoService = new MercadoService();
    const mercado = await mercadoService.criarMercado({
      nome: "Mercado Teste",
      tipo: "cesta",
      responsavelId: adminSession.usuarioId,
      valorMaximoCesta: 100,
      status: "ativo",
    });
    mercadoId = mercado.id;
  });

  it("admin user can create pagamento for fornecedor", async function () {
    const mutation = `
      mutation CriarPagamento($input: CriarPagamentoInput!) {
        criarPagamento(input: $input) {
          id
          tipo
          valorTotal
          status
          cicloId
          mercadoId
          usuarioId
        }
      }
    `;

    const variables = {
      input: {
        tipo: "fornecedor",
        valorTotal: 500.0,
        status: "pendente",
        cicloId: cicloId,
        mercadoId: mercadoId,
        usuarioId: fornecedorSession.usuarioId,
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarPagamento.tipo).to.equal("fornecedor");
    expect(result.data.criarPagamento.valorTotal).to.equal(500.0);
    expect(result.data.criarPagamento.status).to.equal("pendente");
  });

  it("admin user can create pagamento for consumidor", async function () {
    const mutation = `
      mutation CriarPagamento($input: CriarPagamentoInput!) {
        criarPagamento(input: $input) {
          id
          tipo
          valorTotal
          status
        }
      }
    `;

    const variables = {
      input: {
        tipo: "consumidor",
        valorTotal: 250.0,
        status: "pendente",
        cicloId: cicloId,
        mercadoId: mercadoId,
        usuarioId: consumidorSession.usuarioId,
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.criarPagamento.tipo).to.equal("consumidor");
    expect(result.data.criarPagamento.valorTotal).to.equal(250.0);
  });

  it("admin user can list pagamentos", async function () {
    const pagamentoService = new PagamentoService();
    await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 500.0,
      status: "pendente",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: fornecedorSession.usuarioId,
    });

    await pagamentoService.criarPagamento({
      tipo: "consumidor",
      valorTotal: 250.0,
      status: "pendente",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: consumidorSession.usuarioId,
    });

    const query = `
      query {
        listarPagamentos {
          id
          tipo
          valorTotal
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarPagamentos).to.have.lengthOf(2);
  });

  it("admin user can find pagamento by id", async function () {
    const pagamentoService = new PagamentoService();
    const pagamento = await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 500.0,
      status: "pendente",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: fornecedorSession.usuarioId,
    });

    const query = `
      query BuscarPagamento($id: ID!) {
        buscarPagamento(id: $id) {
          id
          tipo
          valorTotal
          status
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: { id: pagamento.id },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.buscarPagamento.id).to.equal(pagamento.id.toString());
    expect(result.data.buscarPagamento.valorTotal).to.equal(500.0);
  });

  it("admin user can update pagamento", async function () {
    const pagamentoService = new PagamentoService();
    const pagamento = await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 500.0,
      status: "pendente",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: fornecedorSession.usuarioId,
    });

    const mutation = `
      mutation AtualizarPagamento($id: ID!, $input: AtualizarPagamentoInput!) {
        atualizarPagamento(id: $id, input: $input) {
          id
          valorTotal
        }
      }
    `;

    const variables = {
      id: pagamento.id,
      input: {
        valorTotal: 600.0,
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarPagamento.valorTotal).to.equal(600.0);
  });

  it("admin user can mark pagamento as pago", async function () {
    const pagamentoService = new PagamentoService();
    const pagamento = await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 500.0,
      status: "pendente",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: fornecedorSession.usuarioId,
    });

    const mutation = `
      mutation MarcarPagamentoComoPago($id: ID!, $dataPagamento: String, $observacao: String) {
        marcarPagamentoComoPago(id: $id, dataPagamento: $dataPagamento, observacao: $observacao) {
          id
          status
          dataPagamento
        }
      }
    `;

    const variables = {
      id: pagamento.id,
      dataPagamento: "2025-01-20",
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.marcarPagamentoComoPago.status).to.equal("pago");
    expect(result.data.marcarPagamentoComoPago.dataPagamento).to.equal(
      "2025-01-20",
    );
  });

  it("admin user can cancel pagamento", async function () {
    const pagamentoService = new PagamentoService();
    const pagamento = await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 500.0,
      status: "pendente",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: fornecedorSession.usuarioId,
    });

    const mutation = `
      mutation CancelarPagamento($id: ID!, $observacao: String) {
        cancelarPagamento(id: $id, observacao: $observacao) {
          id
          status
        }
      }
    `;

    const variables = {
      id: pagamento.id,
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.cancelarPagamento.status).to.equal("cancelado");
  });

  it("admin user can delete pagamento", async function () {
    const pagamentoService = new PagamentoService();
    const pagamento = await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 500.0,
      status: "pendente",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: fornecedorSession.usuarioId,
    });

    const mutation = `
      mutation DeletarPagamento($id: ID!) {
        deletarPagamento(id: $id)
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: { id: pagamento.id },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.deletarPagamento).to.be.true;
  });

  it("admin user can calculate total by ciclo", async function () {
    const pagamentoService = new PagamentoService();
    await pagamentoService.criarPagamento({
      tipo: "fornecedor",
      valorTotal: 1000.0,
      status: "a_receber",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: fornecedorSession.usuarioId,
    });

    await pagamentoService.criarPagamento({
      tipo: "consumidor",
      valorTotal: 1500.0,
      status: "a_pagar",
      cicloId: cicloId,
      mercadoId: mercadoId,
      usuarioId: consumidorSession.usuarioId,
    });

    const query = `
      query CalcularTotalPorCiclo($cicloId: Int!) {
        calcularTotalPorCiclo(cicloId: $cicloId) {
          totalReceber
          totalPagar
          saldo
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: { cicloId: cicloId },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.calcularTotalPorCiclo.totalReceber).to.equal(1000.0);
    expect(result.data.calcularTotalPorCiclo.totalPagar).to.equal(1500.0);
    expect(result.data.calcularTotalPorCiclo.saldo).to.equal(500.0);
  });
});

describe("CicloMercados GraphQL", function () {
  this.timeout(10000);
  let adminSession;
  let cicloId;
  let mercadoId;
  let pontoEntregaId;

  beforeEach(async function () {
    await sequelize.sync({ force: true });
    const usuarioService = new UsuarioService({
      uuid4() {
        return "admin-token-ciclomercados";
      },
    });
    await usuarioService.create(
      { email: "admin@example.com", senha: "password" },
      { perfis: ["admin"] },
    );
    adminSession = await usuarioService.login("admin@example.com", "password");

    // Criar ponto de entrega
    const pontoEntregaService = new PontoEntregaService();
    const pontoEntrega = await pontoEntregaService.criarPontoEntrega({
      nome: "Ponto Teste",
      endereco: "Rua Teste",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo ao mercado",
      status: "ativo",
    });
    pontoEntregaId = pontoEntrega.id;

    // Criar ciclo
    const cicloService = new CicloService();
    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
    const ciclo = await cicloService.criarCiclo({
      nome: "Ciclo Teste",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntregaId,
    });
    cicloId = ciclo.id;

    // Criar mercado
    const mercadoService = new MercadoService();
    const mercado = await mercadoService.criarMercado({
      nome: "Mercado Teste",
      tipo: "cesta",
      responsavelId: adminSession.usuarioId,
      valorMaximoCesta: 150.0,
      taxaAdministrativa: 5.0,
      status: "ativo",
      pontosEntrega: [{ nome: "Ponto Mercado", status: "ativo" }],
    });
    mercadoId = mercado.id;
  });

  it("admin user can add mercado tipo cesta to ciclo", async function () {
    const mutation = `
      mutation AdicionarMercadoCiclo($input: CriarCicloMercadosInput!) {
        adicionarMercadoCiclo(input: $input) {
          id
          cicloId
          mercadoId
          tipoVenda
          ordemAtendimento
          quantidadeCestas
          valorAlvoCesta
          status
        }
      }
    `;

    const variables = {
      input: {
        cicloId: cicloId,
        mercadoId: mercadoId,
        tipoVenda: "cesta",
        ordemAtendimento: 1,
        quantidadeCestas: 50,
        valorAlvoCesta: 80.0,
        pontoEntregaId: pontoEntregaId,
        status: "ativo",
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    if (result.errors) {
      console.log("GraphQL Errors:", JSON.stringify(result.errors, null, 2));
    }
    expect(result.errors).to.be.undefined;
    expect(result.data.adicionarMercadoCiclo.cicloId).to.equal(cicloId);
    expect(result.data.adicionarMercadoCiclo.mercadoId).to.equal(mercadoId);
    expect(result.data.adicionarMercadoCiclo.tipoVenda).to.equal("cesta");
    expect(result.data.adicionarMercadoCiclo.quantidadeCestas).to.equal(50);
    expect(result.data.adicionarMercadoCiclo.valorAlvoCesta).to.equal(80.0);
  });

  it("admin user can add mercado tipo lote to ciclo", async function () {
    const mutation = `
      mutation AdicionarMercadoCiclo($input: CriarCicloMercadosInput!) {
        adicionarMercadoCiclo(input: $input) {
          id
          cicloId
          mercadoId
          tipoVenda
          valorAlvoLote
          status
        }
      }
    `;

    const variables = {
      input: {
        cicloId: cicloId,
        mercadoId: mercadoId,
        tipoVenda: "lote",
        ordemAtendimento: 1,
        valorAlvoLote: 500.0,
        pontoEntregaId: pontoEntregaId,
        status: "ativo",
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.adicionarMercadoCiclo.tipoVenda).to.equal("lote");
    expect(result.data.adicionarMercadoCiclo.valorAlvoLote).to.equal(500.0);
  });

  it("admin user can list mercados by ciclo", async function () {
    // Adicionar mercado ao ciclo primeiro
    const cicloMercadoService = new CicloMercadoService();
    await cicloMercadoService.adicionarMercadoCiclo({
      cicloId: cicloId,
      mercadoId: mercadoId,
      tipoVenda: "cesta",
      ordemAtendimento: 1,
      quantidadeCestas: 50,
      valorAlvoCesta: 80.0,
      pontoEntregaId: pontoEntregaId,
      status: "ativo",
    });

    const query = `
      query ListarMercadosPorCiclo($cicloId: Int!) {
        listarMercadosPorCiclo(cicloId: $cicloId) {
          id
          cicloId
          mercadoId
          tipoVenda
          ordemAtendimento
        }
      }
    `;

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: { cicloId: cicloId },
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarMercadosPorCiclo).to.have.lengthOf(1);
    expect(result.data.listarMercadosPorCiclo[0].cicloId).to.equal(cicloId);
    expect(result.data.listarMercadosPorCiclo[0].mercadoId).to.equal(mercadoId);
  });

  it("admin user can update mercado ciclo", async function () {
    // Adicionar mercado ao ciclo primeiro
    const cicloMercadoService = new CicloMercadoService();
    const cicloMercado = await cicloMercadoService.adicionarMercadoCiclo({
      cicloId: cicloId,
      mercadoId: mercadoId,
      tipoVenda: "cesta",
      ordemAtendimento: 1,
      quantidadeCestas: 50,
      valorAlvoCesta: 80.0,
      pontoEntregaId: pontoEntregaId,
      status: "ativo",
    });

    const mutation = `
      mutation AtualizarMercadoCiclo($id: ID!, $input: AtualizarCicloMercadosInput!) {
        atualizarMercadoCiclo(id: $id, input: $input) {
          id
          ordemAtendimento
          quantidadeCestas
          valorAlvoCesta
        }
      }
    `;

    const variables = {
      id: cicloMercado.id.toString(),
      input: {
        ordemAtendimento: 2,
        quantidadeCestas: 100,
        valorAlvoCesta: 90.0,
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.atualizarMercadoCiclo.ordemAtendimento).to.equal(2);
    expect(result.data.atualizarMercadoCiclo.quantidadeCestas).to.equal(100);
    expect(result.data.atualizarMercadoCiclo.valorAlvoCesta).to.equal(90.0);
  });

  it("admin user can remove mercado from ciclo", async function () {
    // Adicionar mercado ao ciclo primeiro
    const cicloMercadoService = new CicloMercadoService();
    const cicloMercado = await cicloMercadoService.adicionarMercadoCiclo({
      cicloId: cicloId,
      mercadoId: mercadoId,
      tipoVenda: "cesta",
      ordemAtendimento: 1,
      quantidadeCestas: 50,
      valorAlvoCesta: 80.0,
      pontoEntregaId: pontoEntregaId,
      status: "ativo",
    });

    const mutation = `
      mutation RemoverMercadoCiclo($id: ID!) {
        removerMercadoCiclo(id: $id)
      }
    `;

    const variables = {
      id: cicloMercado.id.toString(),
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.removerMercadoCiclo).to.be.true;
  });

  it("error when adding mercado tipo cesta without quantidadeCestas", async function () {
    const mutation = `
      mutation AdicionarMercadoCiclo($input: CriarCicloMercadosInput!) {
        adicionarMercadoCiclo(input: $input) {
          id
        }
      }
    `;

    const variables = {
      input: {
        cicloId: cicloId,
        mercadoId: mercadoId,
        tipoVenda: "cesta",
        ordemAtendimento: 1,
        pontoEntregaId: pontoEntregaId,
        // Falta quantidadeCestas e valorAlvoCesta
      },
    };

    const context = APIGraphql.buildContext(adminSession.token);
    const result = await graphql({
      schema: APIGraphql.schema,
      source: mutation,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.not.be.undefined;
    expect(result.errors[0].message).to.match(/obrigat/i);
  });
});

describe("EntregasFornecedores GraphQL", function () {
  this.timeout(10000);
  let adminSession;
  let fornecedorSession;
  let cicloId;
  let fornecedorId;

  const {
    PontoEntrega,
    Ciclo,
    CategoriaProdutos,
    Produto,
    Oferta,
    OfertaProdutos,
  } = require("../models");

  beforeEach(async function () {
    await sequelize.sync({ force: true });

    const usuarioService = new UsuarioService({
      uuid4() {
        return "admin-token-entregas";
      },
    });

    // Criar admin usando usuarioService
    await usuarioService.create(
      { email: "admin@test.com", senha: "password" },
      { perfis: ["admin"] },
    );
    adminSession = await usuarioService.login("admin@test.com", "password");

    // Criar fornecedor usando usuarioService
    usuarioService.uuid = () => "fornecedor-token-entregas";
    await usuarioService.create(
      {
        email: "fornecedor@test.com",
        senha: "password",
      },
      { perfis: ["fornecedor"], nome: "João Fornecedor" },
    );
    fornecedorSession = await usuarioService.login(
      "fornecedor@test.com",
      "password",
    );

    // Pegar o ID do fornecedor
    const fornecedor = await Usuario.findOne({
      where: { email: "fornecedor@test.com" },
    });
    fornecedorId = fornecedor.id;

    // Criar ponto de entrega
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Central",
      endereco: "Rua A",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      pontoReferencia: "Próximo ao centro comunitário",
      status: "ativo",
    });

    // Criar ciclo
    const ciclo = await Ciclo.create({
      nome: "Ciclo Test",
      ofertaInicio: "2025-01-01",
      ofertaFim: "2025-01-31",
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });
    cicloId = ciclo.id;

    // Criar categoria e produto
    const categoria = await CategoriaProdutos.create({
      nome: "Verduras",
      status: "ativo",
    });

    const produto = await Produto.create({
      nome: "Tomate",
      categoriaId: categoria.id,
      status: "ativo",
    });

    // Criar oferta
    const oferta = await Oferta.create({
      cicloId: ciclo.id,
      usuarioId: fornecedor.id,
      status: "ativo",
    });

    // Adicionar produto à oferta
    await OfertaProdutos.create({
      ofertaId: oferta.id,
      produtoId: produto.id,
      quantidade: 50,
      valorReferencia: 5.5,
      valorOferta: 5.0,
    });
  });

  it("authenticated user can list entregas by ciclo", async function () {
    const query = `
      query ListarEntregas($cicloId: Int!) {
        listarEntregasFornecedoresPorCiclo(cicloId: $cicloId) {
          id
          fornecedor
          fornecedorId
          produto
          produtoId
          unidadeMedida
          valorUnitario
          quantidadeOfertada
          quantidadeEntregue
          valorTotal
        }
      }
    `;

    const variables = { cicloId };
    const context = APIGraphql.buildContext(adminSession.token);

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarEntregasFornecedoresPorCiclo).to.be.an("array");
    expect(result.data.listarEntregasFornecedoresPorCiclo).to.have.lengthOf(1);

    const entrega = result.data.listarEntregasFornecedoresPorCiclo[0];
    expect(entrega.fornecedor).to.equal("João Fornecedor");
    expect(entrega.produto).to.equal("Tomate");
    expect(entrega.quantidadeOfertada).to.equal(50);
    expect(entrega.valorUnitario).to.equal(5.0);
  });

  it("fornecedor can list only their entregas", async function () {
    const query = `
      query ListarEntregas($cicloId: Int!, $fornecedorId: Int) {
        listarEntregasFornecedoresPorCiclo(
          cicloId: $cicloId
          fornecedorId: $fornecedorId
        ) {
          id
          fornecedor
          produto
        }
      }
    `;

    const variables = { cicloId, fornecedorId };
    const context = APIGraphql.buildContext(fornecedorSession.token);

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarEntregasFornecedoresPorCiclo).to.be.an("array");
    expect(result.data.listarEntregasFornecedoresPorCiclo).to.have.lengthOf(1);
  });

  it("returns empty array for ciclo without ofertas", async function () {
    // Criar ciclo vazio
    const pontoEntrega = await PontoEntrega.create({
      nome: "Ponto Vazio",
      endereco: "Rua B",
      bairro: "Bairro Novo",
      cidade: "São Paulo",
      estado: "SP",
      cep: "02000-000",
      pontoReferencia: "Próximo ao parque",
      status: "ativo",
    });

    const cicloVazio = await Ciclo.create({
      nome: "Ciclo Vazio",
      ofertaInicio: "2025-02-01",
      ofertaFim: "2025-02-28",
      pontoEntregaId: pontoEntrega.id,
      status: "oferta",
    });

    const query = `
      query ListarEntregas($cicloId: Int!) {
        listarEntregasFornecedoresPorCiclo(cicloId: $cicloId) {
          id
          fornecedor
        }
      }
    `;

    const variables = { cicloId: cicloVazio.id };
    const context = APIGraphql.buildContext(adminSession.token);

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.be.undefined;
    expect(result.data.listarEntregasFornecedoresPorCiclo).to.be.an("array");
    expect(result.data.listarEntregasFornecedoresPorCiclo).to.have.lengthOf(0);
  });

  it("error when not authenticated", async function () {
    const query = `
      query ListarEntregas($cicloId: Int!) {
        listarEntregasFornecedoresPorCiclo(cicloId: $cicloId) {
          id
        }
      }
    `;

    const variables = { cicloId };
    const context = APIGraphql.buildContext(null);

    const result = await graphql({
      schema: APIGraphql.schema,
      source: query,
      rootValue: APIGraphql.rootValue,
      contextValue: context,
      variableValues: variables,
    });

    expect(result.errors).to.not.be.undefined;
    expect(result.errors[0].message).to.equal("Unauthorized");
  });
});
