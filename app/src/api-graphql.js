const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");
const { Session, Usuario } = require("../models");

const {
  UsuarioService,
  CryptoUUIDService,
} = require("../src/services/services.js");

async function requiredAuthenticated(context) {
  if (!context.sessionToken) {
    throw new Error("Unauthorized");
  }
}

async function requiredAdmin(context) {
  const usuario = await Usuario.findByPk(context.session.usuarioId);

  if (!usuario) {
    throw new Error("User not found");
  }

  if (!usuario.perfis.includes("admin")) {
    throw new Error("Admin required");
  }
}

async function setupSession(context) {
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
      perfis: ["admin"],
    };
  },
  sessionLogout: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);

    const session = await context.usuarioService.logout(context.session.token);

    return {
      success: session.success,
    };
  },
  systemInformation: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);

    // llamar servicio
    //
    return {
      version: "1.0.0",
    };
  },
  listarUsuarios: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const usuarios = await context.usuarioService.listarTodos();
    return usuarios;
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
  buildContext(sessionToken) {
    return {
      usuarioService,
      sessionToken,
    };
  },
};

module.exports = { default: API };
