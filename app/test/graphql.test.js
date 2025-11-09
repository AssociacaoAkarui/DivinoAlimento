import { UsuarioService } from "../src/services/services.js";
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
});
