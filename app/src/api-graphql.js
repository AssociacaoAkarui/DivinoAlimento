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
  MercadoService,
  PrecoMercadoService,
  ComposicaoService,
  CestaService,
  PedidoConsumidoresService,
  PagamentoService,
  CicloMercadoService,
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

  // Mercado resolvers
  listarMercados: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const mercados = await context.mercadoService.listarMercados();
    return mercados;
  },

  buscarMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const mercado = await context.mercadoService.buscarPorId(args.id);
    return mercado;
  },

  listarMercadosAtivos: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const mercados = await context.mercadoService.listarMercadosAtivos();
    return mercados;
  },

  listarMercadosPorResponsavel: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const mercados = await context.mercadoService.listarMercadosPorResponsavel(
      args.responsavelId,
    );
    return mercados;
  },

  criarMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { input } = args;
    const mercado = await context.mercadoService.criarMercado(input);
    return mercado;
  },

  atualizarMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const mercado = await context.mercadoService.atualizarMercado(id, input);
    return mercado;
  },

  deletarMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const result = await context.mercadoService.deletarMercado(args.id);
    return result;
  },

  listarPrecosMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const precos = await context.precoMercadoService.listarPrecosPorMercado(
      args.mercadoId,
    );
    return precos;
  },

  listarPrecosProduto: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const precos = await context.precoMercadoService.listarPrecosPorProduto(
      args.produtoId,
    );
    return precos;
  },

  buscarPrecoMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const preco = await context.precoMercadoService.buscarPreco(args.id);
    return preco;
  },

  buscarPrecoProdutoMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const preco = await context.precoMercadoService.buscarPrecoProdutoMercado(
      args.produtoId,
      args.mercadoId,
    );
    return preco;
  },

  buscarComposicao: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const composicao = await context.composicaoService.buscarComposicaoPorId(
      args.id,
    );
    return composicao;
  },

  listarComposicoesPorCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const composicoes =
      await context.composicaoService.listarComposicoesPorCiclo(args.cicloId);
    return composicoes;
  },

  listarCestas: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const cestas = await context.cestaService.listarCestasAtivas();
    return cestas;
  },

  buscarPedidoConsumidores: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pedido =
      await context.pedidoConsumidoresService.buscarPedidoPorIdComProdutos(
        args.id,
      );
    return pedido;
  },

  listarPedidosPorCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pedidos =
      await context.pedidoConsumidoresService.listarPedidosPorCiclo(
        args.cicloId,
      );
    return pedidos;
  },

  listarPedidosPorUsuario: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pedidos =
      await context.pedidoConsumidoresService.listarPedidosPorUsuario(
        args.usuarioId,
      );
    return pedidos;
  },

  criarPrecoMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const preco = await context.precoMercadoService.criarPreco(args.input);
    return preco;
  },

  atualizarPrecoMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const preco = await context.precoMercadoService.atualizarPreco(
      args.id,
      args.input,
    );
    return preco;
  },

  deletarPrecoMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    await context.precoMercadoService.deletarPreco(args.id);
    return true;
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

  migrarOfertas: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const ofertas = await context.ofertaService.migrarOfertas(
      args.input.ciclosOrigemIds,
      args.input.cicloDestinoId,
      args.input.produtos,
      context.session.usuarioId,
    );
    return ofertas;
  },

  criarComposicao: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const composicao = await context.composicaoService.criarComposicao(
      args.input,
    );
    return composicao;
  },

  sincronizarProdutosComposicao: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    await context.composicaoService.sincronizarProdutos(
      args.composicaoId,
      args.produtos,
    );
    return true;
  },

  criarPedidoConsumidores: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pedido = await context.pedidoConsumidoresService.criarPedido(
      args.input,
    );
    return pedido;
  },

  adicionarProdutoPedido: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const { pedidoId, input } = args;
    const pedidoProduto =
      await context.pedidoConsumidoresService.adicionarProduto(
        pedidoId,
        input.produtoId,
        input.quantidade,
      );
    return pedidoProduto;
  },

  atualizarQuantidadeProdutoPedido: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const { pedidoProdutoId, input } = args;
    const pedidoProduto =
      await context.pedidoConsumidoresService.atualizarQuantidadeProduto(
        pedidoProdutoId,
        input.quantidade,
      );
    return pedidoProduto;
  },

  removerProdutoPedido: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await context.pedidoConsumidoresService.atualizarQuantidadeProduto(
      args.pedidoProdutoId,
      0,
    );
    return true;
  },

  atualizarStatusPedido: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pedido = await context.pedidoConsumidoresService.atualizarStatus(
      args.pedidoId,
      args.input.status,
    );
    return pedido;
  },

  // Pagamento queries
  listarPagamentos: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const filtros = args.filtros || {};
    const pagamentos = await context.pagamentoService.listarPagamentos(filtros);
    return pagamentos;
  },

  buscarPagamento: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pagamento = await context.pagamentoService.buscarPorId(args.id);
    return pagamento;
  },

  calcularTotalPorCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const total = await context.pagamentoService.calcularTotalPorCiclo(
      args.cicloId,
    );
    return total;
  },

  // Pagamento mutations
  criarPagamento: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pagamento = await context.pagamentoService.criarPagamento(args.input);
    return pagamento;
  },

  atualizarPagamento: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pagamento = await context.pagamentoService.atualizarPagamento(
      args.id,
      args.input,
    );
    return pagamento;
  },

  deletarPagamento: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await context.pagamentoService.deletarPagamento(args.id);
    return true;
  },

  marcarPagamentoComoPago: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pagamento = await context.pagamentoService.marcarComoPago(
      args.id,
      args.dataPagamento,
      args.observacao,
    );
    return pagamento;
  },

  cancelarPagamento: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pagamento = await context.pagamentoService.cancelarPagamento(
      args.id,
      args.observacao,
    );
    return pagamento;
  },

  gerarPagamentosPorCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const pagamentos = await context.pagamentoService.gerarPagamentosPorCiclo(
      args.cicloId,
    );
    return pagamentos;
  },

  // CicloMercados resolvers
  adicionarMercadoCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { input } = args;
    const cicloMercado =
      await context.cicloMercadoService.adicionarMercadoCiclo(input);
    return cicloMercado;
  },

  atualizarMercadoCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const { id, input } = args;
    const cicloMercado =
      await context.cicloMercadoService.atualizarMercadoCiclo(id, input);
    return cicloMercado;
  },

  removerMercadoCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    await requiredAdmin(context);
    const result = await context.cicloMercadoService.removerMercadoCiclo(
      args.id,
    );
    return result;
  },

  listarMercadosPorCiclo: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const cicloMercados =
      await context.cicloMercadoService.listarMercadosPorCiclo(args.cicloId);
    return cicloMercados;
  },

  buscarCicloMercado: async (args, context) => {
    await requiredAuthenticated(context);
    await setupSession(context);
    const cicloMercado = await context.cicloMercadoService.buscarPorId(args.id);
    return cicloMercado;
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
const mercadoService = new MercadoService();
const cicloMercadoService = new CicloMercadoService();
const precoMercadoService = new PrecoMercadoService();
const composicaoService = new ComposicaoService();
const cestaService = new CestaService();
const pedidoConsumidoresService = new PedidoConsumidoresService();
const pagamentoService = new PagamentoService();

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
    mercadoService,
    cicloMercadoService,
    precoMercadoService,
    composicaoService,
    cestaService,
    pedidoConsumidoresService,
    pagamentoService,
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
      mercadoService,
      cicloMercadoService,
      precoMercadoService,
      composicaoService,
      cestaService,
      pedidoConsumidoresService,
      pagamentoService,
      sessionToken,
    };
  },
};

module.exports = { default: API };
