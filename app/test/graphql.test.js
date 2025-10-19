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

    expect(currentUsuario.perfis).to.equal(dbUsuario.perfis);
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

    // TODO
    expect(resultLogin).to.not.deep.equal({
      data: {
        sessionLogin: {
          usuarioId: `${currentUsuario.id}`,
          token: "1234567890",
        },
      },
    });
  });
});
