const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");
const {
  UsuarioService,
  CryptoUUIDService,
} = require("../src/services/services.js");

const rootValue = {
  healthcheck: async () => {
    return {
      status: "ok",
    };
  },
  sessionLogin: async (args, context) => {
    const session = await context.usuarioService.login(
      args.input.email,
      args.input.senha,
    );

    return {
      usuarioId: session.usuarioId,
      token: session.token,
    };
  },
};

const schemaSDL = fs.readFileSync(path.join(__dirname, "api.graphql"), "utf8");

const schema = buildSchema(schemaSDL);

const uuid4Service = new CryptoUUIDService();
const usuarioService = new UsuarioService(uuid4Service);

const API = {
  rootValue,
  schema,
  context: {
    usuarioService,
  },
};

module.exports = { default: API };
