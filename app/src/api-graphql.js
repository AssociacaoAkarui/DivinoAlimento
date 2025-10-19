const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");
const { Session } = require("../models");

const {
  UsuarioService,
  CryptoUUIDService,
} = require("../src/services/services.js");

async function setupSession(context) {
  if (!context.sessionToken) {
    throw new Error("Unauthorized");
  }
  const session = await Session.findOne({
    where: { token: context.sessionToken },
  });

  if (session == null) {
    throw new Error("Session not found");
  }

  context.session = session;
}

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
  sessionLogout: async (args, context) => {
    await setupSession(context);
    const session = await context.usuarioService.logout(context.session.token);

    return {
      success: session.success,
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
