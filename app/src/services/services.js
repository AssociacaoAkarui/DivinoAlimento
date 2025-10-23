const { Op } = require("sequelize");
const { filterPayload, normalizePayload } = require("../utils/modelUtils");
const {
  Ciclo,
  PontoEntrega,
  Cesta,
  CicloEntregas,
  CicloCestas,
  CicloProdutos,
  Produto,
  CategoriaProdutos,
  Composicoes,
  ComposicaoOfertaProdutos,
  Oferta,
  OfertaProdutos,
  PedidoConsumidores,
  PedidoConsumidoresProdutos,
  sequelize,
} = require("../../models");

const CicloModel = require("../model/Ciclo");
const PontoEntregaModel = require("../model/PontoEntrega");

const CestaModel = require("../model/Cesta");

const ServiceError = require("../utils/ServiceError");

class CicloService {
  async prepararDadosCriacaoCiclo() {
    try {
      await CestaModel.verificaCriaCestasInternas();
      const pontosEntrega = await PontoEntregaModel.get();
      const tiposCesta = await CestaModel.getCestasAtivas();
      return { pontosEntrega, tiposCesta };
    } catch (error) {
      throw new ServiceError("Falha ao preparar dados para criação de ciclo.", {
        cause: error,
      });
    }
  }

  async criarCiclo(dados, options = {}) {
    const transaction = options.transaction || (await sequelize.transaction());
    try {
      const dadosNormalizados = normalizePayload(Ciclo, dados);
      const allowedFields = [
        "nome",
        "ofertaInicio",
        "ofertaFim",
        "pontoEntregaId",
        "itensAdicionaisInicio",
        "itensAdicionaisFim",
        "retiradaConsumidorInicio",
        "retiradaConsumidorFim",
        "observacao",
      ];
      const payloadSeguro = filterPayload(
        Ciclo,
        dadosNormalizados,
        allowedFields,
      );
      const novoCiclo = await Ciclo.create(payloadSeguro, { transaction });

      await this._criarEntregasCiclo(novoCiclo.id, dados, transaction);
      await this._criarCestasCiclo(novoCiclo.id, dados, transaction);
      await this._criarProdutosCiclo(novoCiclo.id, dados, transaction);

      if (!options.transaction) {
        await transaction.commit();
      }
      return await this.buscarCicloPorId(novoCiclo.id);
    } catch (error) {
      if (!options.transaction) {
        await transaction.rollback();
      }
      throw new ServiceError("Falha ao criar o ciclo no serviço.", {
        cause: error,
      });
    }
  }

  async atualizarCiclo(cicloId, dadosAtualizacao, options = {}) {
    const transaction = options.transaction || (await sequelize.transaction());
    try {
      const cicloExistente = await Ciclo.findByPk(cicloId);
      if (!cicloExistente) {
        throw new Error(`Ciclo com ID ${cicloId} não encontrado`);
      }

      const dadosNormalizados = normalizePayload(Ciclo, dadosAtualizacao);
      const allowedFields = [
        "nome",
        "ofertaInicio",
        "ofertaFim",
        "pontoEntregaId",
        "itensAdicionaisInicio",
        "itensAdicionaisFim",
        "retiradaConsumidorInicio",
        "retiradaConsumidorFim",
        "observacao",
        "status",
      ];
      const payloadSeguro = filterPayload(
        Ciclo,
        dadosNormalizados,
        allowedFields,
      );
      await cicloExistente.update(payloadSeguro, { transaction });

      if (this._temDadosEntrega(dadosNormalizados)) {
        await this._atualizarEntregasCiclo(
          cicloId,
          dadosNormalizados,
          transaction,
        );
      }
      if (this._temDadosCesta(dadosNormalizados)) {
        await this._atualizarCestasCiclo(
          cicloId,
          dadosNormalizados,
          transaction,
        );
      }
      if (this._temDadosProduto(dadosNormalizados)) {
        await this._atualizarProdutosCiclo(
          cicloId,
          dadosNormalizados,
          transaction,
        );
      }

      if (!options.transaction) {
        await transaction.commit();
      }
      return await this.buscarCicloPorId(cicloId);
    } catch (error) {
      if (!options.transaction) {
        await transaction.rollback();
      }
      throw new ServiceError("Falha ao atualizar o ciclo no serviço.", {
        cause: error,
      });
    }
  }

  async buscarCicloPorId(cicloId) {
    const ciclo = await Ciclo.findByPk(cicloId, {
      include: [
        { model: PontoEntrega, as: "pontoEntrega" },
        { model: CicloEntregas, as: "cicloEntregas" },
        {
          model: CicloCestas,
          as: "CicloCestas",
          include: [{ model: Cesta, as: "cesta" }],
        },
        { model: CicloProdutos, as: "cicloProdutos" },
      ],
    });
    if (!ciclo) {
      throw new Error(`Ciclo com ID ${cicloId} não encontrado`);
    }
    const pontosEntrega = await PontoEntrega.findAll({
      where: { status: "ativo" },
    });
    const tiposCesta = await Cesta.findAll({ where: { status: "ativo" } });
    return { ...ciclo.toJSON(), pontosEntrega, tiposCesta };
  }

  async listarCiclos(limite = 10, cursor = null) {
    const where = {};
    if (cursor) {
      where.createdAt = { [Op.lt]: new Date(cursor) };
    }
    const { count, rows } = await Ciclo.findAndCountAll({
      where,
      limit: limite,
      include: [{ model: PontoEntrega, as: "pontoEntrega" }],
      order: [["createdAt", "DESC"]],
    });
    const nextCursor = rows.length > 0 ? rows[rows.length - 1].createdAt : null;
    return { total: count, ciclos: rows, limite, nextCursor };
  }

  async deletarCiclo(cicloId, options = {}) {
    const transaction = options.transaction || (await sequelize.transaction());
    try {
      const ciclo = await Ciclo.findByPk(cicloId);
      if (!ciclo) {
        throw new Error(`Ciclo com ID ${cicloId} não encontrado`);
      }
      await ciclo.destroy({ transaction });
      if (!options.transaction) {
        await transaction.commit();
      }
      return true;
    } catch (error) {
      if (!options.transaction) {
        await transaction.rollback();
      }
      throw new ServiceError(`Falha ao deletar o ciclo.`, { cause: error });
    }
  }

  _extrairEntregas(dados) {
    const entregas = [];
    Object.keys(dados).forEach((key) => {
      if (key.startsWith("entregaFornecedorInicio")) {
        const index = key.replace("entregaFornecedorInicio", "");
        const fimKey = `entregaFornecedorFim${index}`;
        if (dados[key] && dados[fimKey]) {
          entregas.push({ inicio: dados[key], fim: dados[fimKey] });
        }
      }
    });
    return entregas;
  }

  _extrairCestas(dados) {
    const cestas = [];
    Object.keys(dados).forEach((key) => {
      if (key.startsWith("cestaId")) {
        const index = key.replace("cestaId", "");
        const qtdKey = `quantidadeCestas${index}`;
        if (dados[key] && dados[qtdKey] > 0) {
          cestas.push({ id: dados[key], quantidade: parseInt(dados[qtdKey]) });
        }
      }
    });
    return cestas;
  }

  _extrairProdutos(dados) {
    const produtos = [];
    Object.keys(dados).forEach((key) => {
      if (key.startsWith("produtoId")) {
        const index = key.replace("produtoId", "");
        const qtdKey = `quantidadeProdutos${index}`;
        if (dados[key] && dados[qtdKey] > 0) {
          produtos.push({
            id: dados[key],
            quantidade: parseInt(dados[qtdKey]),
          });
        }
      }
    });
    return produtos;
  }

  async _criarEntregasCiclo(cicloId, dados, transaction) {
    const entregas = this._extrairEntregas(dados);
    for (const entrega of entregas) {
      await CicloEntregas.create(
        {
          cicloId,
          entregaFornecedorInicio: entrega.inicio,
          entregaFornecedorFim: entrega.fim,
        },
        { transaction },
      );
    }
  }

  async _criarCestasCiclo(cicloId, dados, transaction) {
    const cestas = this._extrairCestas(dados);
    for (const cesta of cestas) {
      await CicloCestas.create(
        { cicloId, cestaId: cesta.id, quantidadeCestas: cesta.quantidade },
        { transaction },
      );
    }
  }

  async _criarProdutosCiclo(cicloId, dados, transaction) {
    const produtos = this._extrairProdutos(dados);
    for (const produto of produtos) {
      await CicloProdutos.create(
        { cicloId, produtoId: produto.id, quantidade: produto.quantidade },
        { transaction },
      );
    }
  }

  async _atualizarEntregasCiclo(cicloId, dados, transaction) {
    await CicloEntregas.destroy({ where: { cicloId }, transaction });
    await this._criarEntregasCiclo(cicloId, dados, transaction);
  }

  async _atualizarCestasCiclo(cicloId, dados, transaction) {
    await CicloCestas.destroy({ where: { cicloId }, transaction });
    await this._criarCestasCiclo(cicloId, dados, transaction);
  }

  async _atualizarProdutosCiclo(cicloId, dados, transaction) {
    await CicloProdutos.destroy({ where: { cicloId }, transaction });
    await this._criarProdutosCiclo(cicloId, dados, transaction);
  }

  _temDadosEntrega(dados) {
    return Object.keys(dados).some((k) =>
      k.startsWith("entregaFornecedorInicio"),
    );
  }
  _temDadosCesta(dados) {
    return Object.keys(dados).some((k) => k.startsWith("cestaId"));
  }
  _temDadosProduto(dados) {
    return Object.keys(dados).some((k) => k.startsWith("produtoId"));
  }
}

class ProdutoService {
  async criarProduto(dadosProduto) {
    try {
      if (!dadosProduto || !dadosProduto.nome) {
        throw new ServiceError("O nome do produto é obrigatório.");
      }
      const allowedFields = [
        "nome",
        "medida",
        "pesoGrama",
        "valorReferencia",
        "status",
        "descritivo",
        "categoriaId",
      ];
      const payloadSeguro = filterPayload(Produto, dadosProduto, allowedFields);
      return await Produto.create(payloadSeguro);
    } catch (error) {
      throw new ServiceError("Falha ao criar produto.", { cause: error });
    }
  }

  async buscarProdutoPorId(id) {
    try {
      const produto = await Produto.findByPk(id, {
        include: [{ model: CategoriaProdutos, as: "categoria" }],
      });
      if (!produto) {
        throw new ServiceError(`Produto com ID ${id} não encontrado`);
      }
      return produto;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao buscar produto por ID.", {
        cause: error,
      });
    }
  }

  async atualizarProduto(id, dadosParaAtualizar) {
    try {
      const produto = await this.buscarProdutoPorId(id);
      const allowedFields = [
        "nome",
        "medida",
        "pesoGrama",
        "valorReferencia",
        "status",
        "descritivo",
        "categoriaId",
      ];
      const payloadSeguro = filterPayload(
        Produto,
        dadosParaAtualizar,
        allowedFields,
      );
      await produto.update(payloadSeguro);
      return produto;
    } catch (error) {
      throw new ServiceError("Falha ao atualizar produto.", { cause: error });
    }
  }

  async deletarProduto(id) {
    try {
      const produto = await this.buscarProdutoPorId(id);
      await produto.destroy();
      return true;
    } catch (error) {
      throw new ServiceError("Falha ao deletar produto.", { cause: error });
    }
  }
}

class CestaService {
  async criarCesta(dadosCesta) {
    try {
      const allowedFields = ["nome", "valormaximo", "status"];
      const payloadSeguro = filterPayload(Cesta, dadosCesta, allowedFields);
      return await Cesta.create(payloadSeguro);
    } catch (error) {
      throw new ServiceError("Falha ao criar cesta.", { cause: error });
    }
  }

  async buscarCestaPorId(id) {
    try {
      const cesta = await Cesta.findByPk(id);
      if (!cesta) {
        throw new ServiceError(`Cesta com ID ${id} não encontrada`);
      }
      return cesta;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao buscar cesta por ID.", {
        cause: error,
      });
    }
  }

  async atualizarCesta(id, dadosParaAtualizar) {
    try {
      const cesta = await this.buscarCestaPorId(id);
      const allowedFields = ["nome", "valormaximo", "status"];
      const payloadSeguro = filterPayload(
        Cesta,
        dadosParaAtualizar,
        allowedFields,
      );
      await cesta.update(payloadSeguro);
      return cesta;
    } catch (error) {
      throw new ServiceError("Falha ao atualizar cesta.", { cause: error });
    }
  }

  async deletarCesta(id) {
    try {
      const cesta = await this.buscarCestaPorId(id);
      await cesta.destroy();
      return true;
    } catch (error) {
      throw new ServiceError("Falha ao deletar cesta.", { cause: error });
    }
  }

  async listarCestasAtivas() {
    try {
      return await Cesta.findAll({ where: { status: "ativo" } });
    } catch (error) {
      throw new ServiceError("Falha ao listar cestas ativas.", {
        cause: error,
      });
    }
  }
}

class ComposicaoService {
  async criarComposicao(dados) {
    try {
      const cicloCesta = await CicloCestas.create({
        cicloId: dados.cicloId,
        cestaId: dados.cestaId,
        quantidadeCestas: dados.quantidadeCestas || 1,
      });

      const novaComposicao = await Composicoes.create({
        cicloCestaId: cicloCesta.id,
      });

      return novaComposicao;
    } catch (error) {
      throw new ServiceError("Falha ao criar composição.", { cause: error });
    }
  }

  async buscarComposicaoPorId(id) {
    try {
      const composicao = await Composicoes.findByPk(id, {
        include: [
          {
            model: CicloCestas,
            as: "cicloCesta",
            include: ["ciclo", "cesta"],
          },
          {
            model: ComposicaoOfertaProdutos,
            as: "composicaoOfertaProdutos",
            include: ["produto"],
          },
        ],
      });

      if (!composicao) {
        throw new ServiceError(`Composição com ID ${id} não encontrada`);
      }
      return composicao;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao buscar composição por ID.", {
        cause: error,
      });
    }
  }

  async sincronizarProdutos(composicaoId, produtos) {
    const transaction = await sequelize.transaction();
    try {
      await ComposicaoOfertaProdutos.destroy({
        where: { composicaoId: composicaoId },
        transaction,
      });

      if (produtos && produtos.length > 0) {
        const produtosParaCriar = produtos
          .filter((p) => p.quantidade > 0)
          .map((p) => ({
            composicaoId: composicaoId,
            produtoId: p.produtoId,
            quantidade: p.quantidade,
            ofertaProdutoId: p.ofertaProdutoId,
          }));

        if (produtosParaCriar.length > 0) {
          await ComposicaoOfertaProdutos.bulkCreate(produtosParaCriar, {
            transaction,
          });
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new ServiceError("Falha ao sincronizar produtos da composição.", {
        cause: error,
      });
    }
  }

  async calcularQuantidadePorCesta(composicaoId, produtoId) {
    try {
      const composicao = await Composicoes.findByPk(composicaoId, {
        include: [
          {
            model: CicloCestas,
            as: "cicloCesta",
          },
          {
            model: ComposicaoOfertaProdutos,
            as: "composicaoOfertaProdutos",
            where: { produtoId: produtoId },
          },
        ],
      });

      if (
        !composicao ||
        !composicao.cicloCesta ||
        !composicao.composicaoOfertaProdutos.length
      ) {
        throw new ServiceError(
          "Dados da composição ou produto não encontrados.",
        );
      }

      const numeroCestas = composicao.cicloCesta.quantidadeCestas;
      const quantidadeTotal = composicao.composicaoOfertaProdutos[0].quantidade;

      if (numeroCestas === 0) {
        return 0;
      }

      return quantidadeTotal / numeroCestas;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao calcular a quantidade por cesta.", {
        cause: error,
      });
    }
  }

  async validarDisponibilidade(quantidadeDisponivel, quantidadeNecessaria) {
    if (quantidadeDisponivel < quantidadeNecessaria) {
      const falta = quantidadeNecessaria - quantidadeDisponivel;
      return {
        mensagem: `Quantidade insuficiente. Faltam ${falta} unidades.`,
        necessaria: quantidadeNecessaria,
        disponivel: quantidadeDisponivel,
        falta: falta,
      };
    }
    return null;
  }

  async listarComposicoesPorCiclo(cicloId) {
    try {
      return await CicloCestas.findAll({
        where: { cicloId: cicloId },
        include: [
          { model: Ciclo, as: "ciclo" },
          { model: Cesta, as: "cesta" },
          {
            model: Composicoes,
            as: "composicoes",
            include: [
              {
                model: ComposicaoOfertaProdutos,
                as: "composicaoOfertaProdutos",
                include: ["produto"],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new ServiceError("Falha ao listar composições por ciclo.", {
        cause: error,
      });
    }
  }

  async obterDadosComposicao(cicloId, cestaId) {}
}

class PontoEntregaService {
  async criarPontoEntrega(dados) {
    try {
      const allowedFields = ["nome", "endereco", "status"];
      const payloadSeguro = filterPayload(PontoEntrega, dados, allowedFields);
      return await PontoEntrega.create(payloadSeguro);
    } catch (error) {
      throw new ServiceError("Falha ao criar ponto de entrega.", {
        cause: error,
      });
    }
  }

  async buscarPontoEntregaPorId(id) {
    try {
      const pontoEntrega = await PontoEntrega.findByPk(id);
      if (!pontoEntrega) {
        throw new ServiceError(`Ponto de entrega com ID ${id} não encontrado`);
      }
      return pontoEntrega;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao buscar ponto de entrega por ID.", {
        cause: error,
      });
    }
  }

  async atualizarPontoEntrega(id, dados) {
    try {
      const pontoEntrega = await this.buscarPontoEntregaPorId(id);
      const allowedFields = ["nome", "endereco", "status"];
      const payloadSeguro = filterPayload(PontoEntrega, dados, allowedFields);
      await pontoEntrega.update(payloadSeguro);
      return pontoEntrega;
    } catch (error) {
      throw new ServiceError("Falha ao atualizar ponto de entrega.", {
        cause: error,
      });
    }
  }

  async deletarPontoEntrega(id) {
    try {
      const pontoEntrega = await this.buscarPontoEntregaPorId(id);
      await pontoEntrega.destroy();
      return true;
    } catch (error) {
      throw new ServiceError("Falha ao deletar ponto de entrega.", {
        cause: error,
      });
    }
  }

  async listarPontosDeEntregaAtivos() {
    try {
      return await PontoEntrega.findAll({ where: { status: "ativo" } });
    } catch (error) {
      throw new ServiceError("Falha ao listar pontos de entrega ativos.", {
        cause: error,
      });
    }
  }
}

class OfertaService {
  async criarOferta(dados) {
    try {
      const allowedFields = ["cicloId", "usuarioId"];
      const payloadSeguro = filterPayload(Oferta, dados, allowedFields);
      return await Oferta.create(payloadSeguro);
    } catch (error) {
      throw new ServiceError("Falha ao criar oferta.", { cause: error });
    }
  }

  async adicionarProduto(ofertaId, produtoId, quantidade) {
    try {
      if (quantidade <= 0) {
        throw new ServiceError("A quantidade deve ser maior que zero.");
      }
      const [ofertaProduto, created] = await OfertaProdutos.findOrCreate({
        where: { ofertaId, produtoId },
        defaults: { quantidade },
      });

      if (!created) {
        await ofertaProduto.update({ quantidade });
      }

      return ofertaProduto;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao adicionar produto à oferta.", {
        cause: error,
      });
    }
  }

  async buscarOfertaPorIdComProdutos(id) {
    try {
      const oferta = await Oferta.findByPk(id, {
        include: [
          {
            model: OfertaProdutos,
            as: "ofertaProdutos",
            include: ["produto"],
          },
        ],
      });
      if (!oferta) {
        throw new ServiceError(`Oferta com ID ${id} não encontrada`);
      }
      return oferta;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao buscar oferta por ID.", {
        cause: error,
      });
    }
  }

  async atualizarQuantidadeProduto(ofertaProdutoId, novaQuantidade) {
    try {
      const ofertaProduto = await OfertaProdutos.findByPk(ofertaProdutoId);
      if (!ofertaProduto) {
        throw new ServiceError(
          `Produto da oferta com ID ${ofertaProdutoId} não encontrado`,
        );
      }
      if (novaQuantidade <= 0) {
        throw new ServiceError("A quantidade deve ser maior que zero.");
      }
      await ofertaProduto.update({ quantidade: novaQuantidade });
      return ofertaProduto;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao atualizar a quantidade do produto.", {
        cause: error,
      });
    }
  }

  async removerProduto(ofertaProdutoId) {
    try {
      const ofertaProduto = await OfertaProdutos.findByPk(ofertaProdutoId);
      if (!ofertaProduto) {
        throw new ServiceError(
          `Produto da oferta com ID ${ofertaProdutoId} não encontrado`,
        );
      }
      await ofertaProduto.destroy();
      return true;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao remover o produto da oferta.", {
        cause: error,
      });
    }
  }

  async calcularDisponibilidadeProduto(ofertaProdutoId) {
    try {
      const ofertaProduto = await OfertaProdutos.findByPk(ofertaProdutoId);
      if (!ofertaProduto) {
        throw new ServiceError(
          `Produto da oferta com ID ${ofertaProdutoId} não encontrado`,
        );
      }

      const composicoes = await ofertaProduto.getComposicaoOfertaProdutos();

      const quantidadeEmComposicoes = composicoes.reduce(
        (total, comp) => total + comp.quantidade,
        0,
      );

      return ofertaProduto.quantidade - quantidadeEmComposicoes;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        "Falha ao calcular a disponibilidade do produto.",
        {
          cause: error,
        },
      );
    }
  }
}

class PedidoConsumidoresService {
  async criarPedido(dados) {
    try {
      const allowedFields = ["cicloId", "usuarioId", "status"];
      const payloadSeguro = filterPayload(
        PedidoConsumidores,
        dados,
        allowedFields,
      );
      return await PedidoConsumidores.create(payloadSeguro);
    } catch (error) {
      throw new ServiceError("Falha ao criar pedido de consumidor.", {
        cause: error,
      });
    }
  }

  async buscarPedidoPorId(id) {
    try {
      const pedido = await PedidoConsumidores.findByPk(id, {
        include: ["ciclo", "usuario"],
      });
      if (!pedido) {
        throw new ServiceError(`Pedido com ID ${id} não encontrado`);
      }
      return pedido;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao buscar pedido de consumidor por ID.", {
        cause: error,
      });
    }
  }

  async adicionarProduto(pedidoId, produtoId, quantidade) {
    try {
      if (quantidade <= 0) {
        throw new ServiceError("A quantidade deve ser maior que zero.");
      }
      const [pedidoProduto, created] =
        await PedidoConsumidoresProdutos.findOrCreate({
          where: { pedidoConsumidorId: pedidoId, produtoId },
          defaults: { quantidade },
        });

      if (!created) {
        await pedidoProduto.update({ quantidade });
      }

      return pedidoProduto;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao adicionar produto ao pedido.", {
        cause: error,
      });
    }
  }

  async buscarPedidoPorIdComProdutos(id) {
    try {
      const pedido = await PedidoConsumidores.findByPk(id, {
        include: [
          {
            model: PedidoConsumidoresProdutos,
            as: "pedidoConsumidoresProdutos",
            include: ["produto"],
          },
        ],
      });
      if (!pedido) {
        throw new ServiceError(`Pedido com ID ${id} não encontrado`);
      }
      return pedido;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao buscar pedido com produtos.", {
        cause: error,
      });
    }
  }

  async atualizarQuantidadeProduto(pedidoProdutoId, novaQuantidade) {
    try {
      const pedidoProduto =
        await PedidoConsumidoresProdutos.findByPk(pedidoProdutoId);
      if (!pedidoProduto) {
        throw new ServiceError(
          `Produto do pedido com ID ${pedidoProdutoId} não encontrado`,
        );
      }
      if (novaQuantidade <= 0) {
        await pedidoProduto.destroy();
        return null;
      }
      await pedidoProduto.update({ quantidade: novaQuantidade });
      return pedidoProduto;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        "Falha ao atualizar a quantidade do produto no pedido.",
        {
          cause: error,
        },
      );
    }
  }

  async calcularValorTotal(pedidoId) {
    try {
      const pedido = await this.buscarPedidoPorIdComProdutos(pedidoId);
      if (!pedido || !pedido.pedidoConsumidoresProdutos) {
        return 0;
      }

      const valorTotal = pedido.pedidoConsumidoresProdutos.reduce(
        (total, produto) => {
          const valor = produto.valorCompra || 0;
          return total + produto.quantidade * valor;
        },
        0,
      );

      return valorTotal;
    } catch (error) {
      throw new ServiceError("Falha ao calcular o valor total do pedido.", {
        cause: error,
      });
    }
  }

  async atualizarStatus(pedidoId, novoStatus) {
    try {
      const pedido = await PedidoConsumidores.findByPk(pedidoId);
      if (!pedido) {
        throw new ServiceError(`Pedido com ID ${pedidoId} não encontrado`);
      }
      await pedido.update({ status: novoStatus });
      return pedido;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao atualizar o status do pedido.", {
        cause: error,
      });
    }
  }

  async listarPedidosPorCiclo(cicloId) {
    try {
      const pedidos = await PedidoConsumidores.findAll({
        where: { cicloId },
        include: ["usuario"],
      });
      return pedidos;
    } catch (error) {
      throw new ServiceError("Falha ao listar pedidos por ciclo.", {
        cause: error,
      });
    }
  }
}

module.exports = {
  CicloService,
  ProdutoService,
  CestaService,
  ComposicaoService,
  PontoEntregaService,
  OfertaService,
  PedidoConsumidoresService,
};
