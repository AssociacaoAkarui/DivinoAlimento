const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");
const { Session, Usuario } = require("../models");

const {
  UsuarioService,
  CryptoUUIDService,
  CategoriaProdutosService,
  ProdutoService,
  ProdutoComercializavelService,
  SubmissaoProdutoService,
  CicloService,
  OfertaService,
  PontoEntregaService,
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
  listarProdutos: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const produtos = await context.produtoService.listarProdutos();
    return produtos;
  },
  buscarProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const produto = await context.produtoService.buscarProdutoPorId(args.id);
    return produto;
  },
  criarProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { input } = args;
    const produto = await context.produtoService.criarProduto(input);
    return produto;
  },
  atualizarProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const produto = await context.produtoService.atualizarProduto(id, input);
    return produto;
  },
  deletarProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const result = await context.produtoService.deletarProduto(args.id);
    return result;
  },

  // ProdutoComercializavel resolvers
  listarProdutosComercializaveis: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const produtosComercializaveis =
      await context.produtoComercializavelService.listarTodos();
    return produtosComercializaveis;
  },

  buscarProdutoComercializavel: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const produtoComercializavel =
      await context.produtoComercializavelService.buscarPorId(args.id);
    return produtoComercializavel;
  },

  listarProdutosComercializaveisPorProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const produtosComercializaveis =
      await context.produtoComercializavelService.listarPorProdutoId(
        args.produtoId,
      );
    return produtosComercializaveis;
  },

  criarProdutoComercializavel: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { input } = args;
    const produtoComercializavel =
      await context.produtoComercializavelService.criarProdutoComercializavel(
        input,
      );
    return produtoComercializavel;
  },

  atualizarProdutoComercializavel: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const produtoComercializavel =
      await context.produtoComercializavelService.atualizarProdutoComercializavel(
        id,
        input,
      );
    return produtoComercializavel;
  },

  deletarProdutoComercializavel: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const result =
      await context.produtoComercializavelService.deletarProdutoComercializavel(
        args.id,
      );
    return result;
  },

  // SubmissaoProduto resolvers
  listarSubmissoesProdutos: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const submissoes = await context.submissaoProdutoService.listarTodas();
    return submissoes;
  },

  buscarSubmissaoProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const submissao = await context.submissaoProdutoService.buscarPorId(
      args.id,
    );
    return submissao;
  },

  listarSubmissoesPorStatus: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const submissoes = await context.submissaoProdutoService.listarPorStatus(
      args.status,
    );
    return submissoes;
  },

  listarSubmissoesPorFornecedor: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const submissoes =
      await context.submissaoProdutoService.listarPorFornecedor(
        args.fornecedorId,
      );
    return submissoes;
  },

  criarSubmissaoProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const { input } = args;
    const submissao =
      await context.submissaoProdutoService.criarSubmissao(input);
    return submissao;
  },

  aprovarSubmissaoProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const submissao = await context.submissaoProdutoService.aprovarSubmissao(
      id,
      input || {},
    );
    return submissao;
  },

  reprovarSubmissaoProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, motivoReprovacao } = args;
    const submissao = await context.submissaoProdutoService.reprovarSubmissao(
      id,
      motivoReprovacao,
    );
    return submissao;
  },

  deletarSubmissaoProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const result = await context.submissaoProdutoService.deletarSubmissao(
      args.id,
    );
    return result;
  },

  // Ciclo resolvers
  listarCiclos: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const { limite, cursor } = args;
    const result = await context.cicloService.listarCiclos(
      limite || 10,
      cursor,
    );
    return result;
  },

  buscarCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const ciclo = await context.cicloService.buscarCicloPorId(args.id);
    return ciclo;
  },

  criarCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { input } = args;
    const ciclo = await context.cicloService.criarCiclo(input);
    return ciclo;
  },

  atualizarCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const ciclo = await context.cicloService.atualizarCiclo(id, input);
    return ciclo;
  },

  deletarCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const result = await context.cicloService.deletarCiclo(args.id);
    return result;
  },

  // PontoEntrega resolvers
  listarPontosEntrega: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const pontosEntrega = await context.pontoEntregaService.listarTodos();
    return pontosEntrega;
  },

  listarPontosEntregaAtivos: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pontosEntrega =
      await context.pontoEntregaService.listarPontosDeEntregaAtivos();
    return pontosEntrega;
  },

  buscarPontoEntrega: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const pontoEntrega =
      await context.pontoEntregaService.buscarPontoEntregaPorId(args.id);
    return pontoEntrega;
  },

  criarPontoEntrega: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { input } = args;
    const pontoEntrega =
      await context.pontoEntregaService.criarPontoEntrega(input);
    return pontoEntrega;
  },

  atualizarPontoEntrega: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const pontoEntrega =
      await context.pontoEntregaService.atualizarPontoEntrega(id, input);
    return pontoEntrega;
  },

  deletarPontoEntrega: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const result = await context.pontoEntregaService.deletarPontoEntrega(
      args.id,
    );
    return result;
  },

  // Oferta resolvers
  buscarOferta: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const oferta = await context.ofertaService.buscarOfertaPorIdComProdutos(
      args.id,
    );
    return oferta;
  },

  listarOfertasPorCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const ofertas = await context.ofertaService.listarOfertasPorCiclo(
      args.cicloId,
    );
    return ofertas;
  },

  listarOfertasPorUsuario: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const ofertas = await context.ofertaService.listarOfertasPorUsuario(
      args.usuarioId,
    );
    return ofertas;
  },

  criarOferta: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const { input } = args;
    const oferta = await context.ofertaService.criarOferta(input);
    return oferta;
  },

  adicionarProdutoOferta: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const { ofertaId, input } = args;
    const ofertaProduto = await context.ofertaService.adicionarProduto(
      ofertaId,
      input.produtoId,
      input.quantidade,
      input.valorReferencia,
      input.valorOferta,
    );
    return ofertaProduto;
  },

  atualizarQuantidadeProdutoOferta: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const { ofertaProdutoId, input } = args;
    const ofertaProduto =
      await context.ofertaService.atualizarQuantidadeProduto(
        ofertaProdutoId,
        input.quantidade,
        input.valorOferta,
      );
    return ofertaProduto;
  },

  removerProdutoOferta: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const result = await context.ofertaService.removerProduto(
      args.ofertaProdutoId,
    );
    return result;
  },
};

const schemaSDL = fs.readFileSync(path.join(__dirname, "api.graphql"), "utf8");

const schema = buildSchema(schemaSDL);

const uuid4Service = new CryptoUUIDService();
const usuarioService = new UsuarioService(uuid4Service);
const categoriaProdutosService = new CategoriaProdutosService();
const produtoService = new ProdutoService();
const produtoComercializavelService = new ProdutoComercializavelService();
const submissaoProdutoService = new SubmissaoProdutoService();
const cicloService = new CicloService();
const ofertaService = new OfertaService();
const pontoEntregaService = new PontoEntregaService();

const API = {
  rootValue,
  schema,
  context: {
    usuarioService,
    categoriaProdutosService,
    produtoService,
    produtoComercializavelService,
    submissaoProdutoService,
    cicloService,
    ofertaService,
    pontoEntregaService,
  },
  buildContext(sessionToken) {
    return {
      usuarioService,
      categoriaProdutosService,
      produtoService,
      produtoComercializavelService,
      submissaoProdutoService,
      cicloService,
      ofertaService,
      pontoEntregaService,
      sessionToken,
    };
  },
};

module.exports = { default: API };
