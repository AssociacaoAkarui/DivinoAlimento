const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");
const { Session, Usuario } = require("../models");

const {
  UsuarioService,
  CryptoUUIDService,
  CategoriaProdutosService,
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
      perfis: session.perfis,
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
  criarUsuario: async (args, context) => {
    try {
      const { input } = args;
      const usuario = await context.usuarioService.create(
        {
          email: input.email,
          senha: input.senha,
          phoneNumber: input.celular || "",
        },
        {
          nome: input.nome,
          perfis: input.perfis,
          status: input.status || "ativo",
        },
      );
      return usuario;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  atualizarUsuario: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const usuario = await context.usuarioService.atualizarUsuario(id, input);
    return usuario;
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
  buscarUsuario: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const usuario = await context.usuarioService.buscarPorId(args.id);
    return usuario;
  },

  listarCategorias: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const categorias =
      await context.categoriaProdutosService.listarCategorias();
    return categorias;
  },

  buscarCategoria: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const categoria = await context.categoriaProdutosService.buscarPorId(
      args.id,
    );
    return categoria;
  },

  criarCategoria: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { input } = args;
    const categoria =
      await context.categoriaProdutosService.criarCategoria(input);
    return categoria;
  },

  atualizarCategoria: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const categoria = await context.categoriaProdutosService.atualizarCategoria(
      id,
      input,
    );
    return categoria;
  },

  deletarCategoria: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const result = await context.categoriaProdutosService.deletarCategoria(
      args.id,
    );
    return result;
  },
};

const schemaSDL = fs.readFileSync(path.join(__dirname, "api.graphql"), "utf8");

const schema = buildSchema(schemaSDL);

const uuid4Service = new CryptoUUIDService();
const usuarioService = new UsuarioService(uuid4Service);
const categoriaProdutosService = new CategoriaProdutosService();

const API = {
  rootValue,
  schema,
  context: {
    usuarioService,
    categoriaProdutosService,
  },
  buildContext(sessionToken) {
    return {
      usuarioService,
      categoriaProdutosService,
      sessionToken,
    };
  },
};

module.exports = { default: API };
