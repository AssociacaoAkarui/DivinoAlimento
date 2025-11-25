const { Op } = require("sequelize");
const { filterPayload, normalizePayload } = require("../utils/modelUtils");
const {
  Ciclo,
  PontoEntrega,
  Cesta,
  Mercado,
  CicloEntregas,
  CicloCestas,
  CicloProdutos,
  Produto,
  ProdutoComercializavel,
  SubmissaoProduto,
  CategoriaProdutos,
  Composicoes,
  ComposicaoOfertaProdutos,
  Oferta,
  OfertaProdutos,
  PedidoConsumidores,
  PedidoConsumidoresProdutos,
  Usuario,
  Session,
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
    const ciclos = rows.map((ciclo) => {
      const json = ciclo.toJSON();
      return {
        ...json,
        ofertaInicio: json.ofertaInicio
          ? new Date(json.ofertaInicio).toISOString()
          : null,
        ofertaFim: json.ofertaFim
          ? new Date(json.ofertaFim).toISOString()
          : null,
        itensAdicionaisInicio: json.itensAdicionaisInicio
          ? new Date(json.itensAdicionaisInicio).toISOString()
          : null,
        itensAdicionaisFim: json.itensAdicionaisFim
          ? new Date(json.itensAdicionaisFim).toISOString()
          : null,
        retiradaConsumidorInicio: json.retiradaConsumidorInicio
          ? new Date(json.retiradaConsumidorInicio).toISOString()
          : null,
        retiradaConsumidorFim: json.retiradaConsumidorFim
          ? new Date(json.retiradaConsumidorFim).toISOString()
          : null,
        createdAt: json.createdAt
          ? new Date(json.createdAt).toISOString()
          : null,
        updatedAt: json.updatedAt
          ? new Date(json.updatedAt).toISOString()
          : null,
      };
    });
    return { total: count, ciclos, limite, nextCursor };
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

  async listarProdutos() {
    try {
      const produtos = await Produto.findAll({
        include: [{ model: CategoriaProdutos, as: "categoria" }],
        order: [["nome", "ASC"]],
      });
      return produtos;
    } catch (error) {
      throw new ServiceError("Falha ao listar produtos.", { cause: error });
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
      const allowedFields = [
        "nome",
        "endereco",
        "bairro",
        "cidade",
        "estado",
        "cep",
        "status",
      ];
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
      const allowedFields = [
        "nome",
        "endereco",
        "bairro",
        "cidade",
        "estado",
        "cep",
        "status",
      ];
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

      const ciclosAssociados = await Ciclo.count({
        where: { pontoEntregaId: id },
      });

      if (ciclosAssociados > 0) {
        throw new ServiceError(
          `Ponto de entrega possui ${ciclosAssociados} ciclo(s) associado(s). Remova as associações antes de excluir.`,
        );
      }

      await pontoEntrega.destroy();
      return true;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao deletar ponto de entrega.", {
        cause: error,
      });
    }
  }

  async listarTodos() {
    try {
      return await PontoEntrega.findAll({
        order: [["nome", "ASC"]],
      });
    } catch (error) {
      throw new ServiceError("Falha ao listar pontos de entrega.", {
        cause: error,
      });
    }
  }

  async listarPontosDeEntregaAtivos() {
    try {
      return await PontoEntrega.findAll({
        where: { status: "ativo" },
        order: [["nome", "ASC"]],
      });
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
      const allowedFields = ["cicloId", "usuarioId", "observacao"];
      const payloadSeguro = filterPayload(Oferta, dados, allowedFields);
      payloadSeguro.status = "ativo";
      return await Oferta.create(payloadSeguro);
    } catch (error) {
      throw new ServiceError("Falha ao criar oferta.", { cause: error });
    }
  }

  async adicionarProduto(
    ofertaId,
    produtoId,
    quantidade,
    valorReferencia = null,
    valorOferta = null,
  ) {
    try {
      if (quantidade <= 0) {
        throw new ServiceError("A quantidade deve ser maior que zero.");
      }
      const defaults = { quantidade };
      if (valorReferencia !== null) defaults.valorReferencia = valorReferencia;
      if (valorOferta !== null) defaults.valorOferta = valorOferta;

      const [ofertaProduto, created] = await OfertaProdutos.findOrCreate({
        where: { ofertaId, produtoId },
        defaults,
      });

      if (!created) {
        const updateData = { quantidade };
        if (valorReferencia !== null)
          updateData.valorReferencia = valorReferencia;
        if (valorOferta !== null) updateData.valorOferta = valorOferta;
        await ofertaProduto.update(updateData);
      }

      return await OfertaProdutos.findByPk(ofertaProduto.id, {
        include: ["produto"],
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao adicionar produto à oferta.", {
        cause: error,
      });
    }
  }

  async listarOfertasPorCiclo(cicloId) {
    try {
      const ofertas = await Oferta.findAll({
        where: { cicloId },
        include: [
          {
            model: OfertaProdutos,
            as: "ofertaProdutos",
            include: ["produto"],
          },
          "ciclo",
          "usuario",
        ],
      });
      return ofertas;
    } catch (error) {
      throw new ServiceError("Falha ao listar ofertas por ciclo.", {
        cause: error,
      });
    }
  }

  async listarOfertasPorUsuario(usuarioId) {
    try {
      const ofertas = await Oferta.findAll({
        where: { usuarioId },
        include: [
          {
            model: OfertaProdutos,
            as: "ofertaProdutos",
            include: ["produto"],
          },
          "ciclo",
          "usuario",
        ],
      });
      return ofertas;
    } catch (error) {
      throw new ServiceError("Falha ao listar ofertas por usuário.", {
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
          "ciclo",
          "usuario",
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

  async atualizarQuantidadeProduto(
    ofertaProdutoId,
    novaQuantidade,
    valorOferta = null,
  ) {
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
      const updateData = { quantidade: novaQuantidade };
      if (valorOferta !== null) updateData.valorOferta = valorOferta;
      await ofertaProduto.update(updateData);
      return await OfertaProdutos.findByPk(ofertaProdutoId, {
        include: ["produto"],
      });
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

  async migrarOfertas(
    ciclosOrigemIds,
    cicloDestinoId,
    produtosMigrar,
    usuarioId,
  ) {
    const transaction = await sequelize.transaction();
    try {
      // Validar ciclo destino
      const cicloDestino = await Ciclo.findByPk(cicloDestinoId);
      if (!cicloDestino) {
        throw new ServiceError(
          `Ciclo de destino com ID ${cicloDestinoId} não encontrado`,
        );
      }

      if (cicloDestino.status !== "oferta" && cicloDestino.status !== "ativo") {
        throw new ServiceError(
          "Ciclo de destino precisa estar ativo ou em período de ofertas",
        );
      }

      // Buscar ofertas dos ciclos origem
      const ofertas = await Oferta.findAll({
        where: { cicloId: ciclosOrigemIds },
        include: [
          {
            model: OfertaProdutos,
            as: "ofertaProdutos",
            include: ["produto"],
          },
        ],
      });

      // Buscar pedidos dos ciclos origem para calcular sobras
      const pedidos = await PedidoConsumidores.findAll({
        where: { cicloId: ciclosOrigemIds },
        include: [
          {
            model: PedidoConsumidoresProdutos,
            as: "pedidoConsumidoresProdutos",
          },
        ],
      });

      // Calcular sobras por produto
      const sobras = new Map();

      ofertas.forEach((oferta) => {
        oferta.ofertaProdutos?.forEach((op) => {
          const key = `${op.produtoId}`;
          if (!sobras.has(key)) {
            sobras.set(key, {
              produtoId: op.produtoId,
              quantidade: 0,
              valorOferta: op.valorOferta,
            });
          }
          sobras.get(key).quantidade += op.quantidade;
        });
      });

      pedidos.forEach((pedido) => {
        pedido.pedidoConsumidoresProdutos?.forEach((pcp) => {
          const key = `${pcp.produtoId}`;
          if (sobras.has(key)) {
            sobras.get(key).quantidade -= pcp.quantidade;
          }
        });
      });

      // Criar ofertas no ciclo destino agrupadas por fornecedor
      const ofertasPorFornecedor = new Map();

      produtosMigrar.forEach((pm) => {
        const sobra = sobras.get(`${pm.produtoId}`);
        if (!sobra || sobra.quantidade <= 0) return;

        const quantidade = Math.min(pm.quantidade, sobra.quantidade);
        if (quantidade <= 0) return;

        const fornecedorId = pm.fornecedorId || usuarioId;
        if (!ofertasPorFornecedor.has(fornecedorId)) {
          ofertasPorFornecedor.set(fornecedorId, []);
        }

        ofertasPorFornecedor.get(fornecedorId).push({
          produtoId: pm.produtoId,
          quantidade,
          valorOferta: pm.valorOferta || sobra.valorOferta,
        });
      });

      const ofertasCriadas = [];

      for (const [fornecedorId, produtos] of ofertasPorFornecedor) {
        const oferta = await Oferta.create(
          {
            cicloId: cicloDestinoId,
            usuarioId: fornecedorId,
            status: "ativa",
            observacao: `Migrado de ciclos: ${ciclosOrigemIds.join(", ")}`,
          },
          { transaction },
        );

        for (const produto of produtos) {
          await OfertaProdutos.create(
            {
              ofertaId: oferta.id,
              produtoId: produto.produtoId,
              quantidade: produto.quantidade,
              valorOferta: produto.valorOferta,
            },
            { transaction },
          );
        }

        ofertasCriadas.push(oferta);
      }

      await transaction.commit();
      return ofertasCriadas;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ServiceError) throw error;
      throw new ServiceError("Falha ao migrar ofertas.", {
        cause: error,
      });
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

  async listarPedidosPorUsuario(usuarioId) {
    try {
      const pedidos = await PedidoConsumidores.findAll({
        where: { usuarioId },
        include: [
          "ciclo",
          {
            model: PedidoConsumidoresProdutos,
            as: "pedidoConsumidoresProdutos",
            include: ["produto"],
          },
        ],
      });
      return pedidos;
    } catch (error) {
      throw new ServiceError("Falha ao listar pedidos por usuário.", {
        cause: error,
      });
    }
  }
}

class CryptoUUIDService {
  constructor() {
    this.crypto = require("crypto");
  }

  uuid4() {
    return this.crypto.randomUUID();
  }
}

class UsuarioService {
  constructor(uuid_service) {
    this.uuid_service = uuid_service;
  }

  async create(requiredParams, optionalParams = {}) {
    const { email, senha, phoneNumber } = requiredParams;

    const {
      nome = email.split("@")[0],
      nomeoficial,
      celular,
      perfis = ["admin"],
      status = "ativo",
      banco,
      agencia,
      conta,
      chavePix,
      cientepolitica,
    } = optionalParams;

    const user = await Usuario.create({
      nome: nome,
      nomeoficial: nomeoficial,
      celular: celular || phoneNumber,
      email: email,
      perfis: perfis,
      status: status,
      banco: banco,
      agencia: agencia,
      conta: conta,
      chavePix: chavePix,
      cientepolitica: cientepolitica,
      senha: senha,
    });
    return user.toJSON();
  }

  async login(email, senha) {
    const user = await Usuario.findOne({
      where: {
        email: email,
        senha: senha,
        status: "ativo",
      },
      attributes: ["id", "email", "perfis"],
    });

    if (!user) {
      throw new Error("User not found or inactive");
    }

    const session = await Session.create({
      usuarioId: user.id,
      token: this.uuid_service.uuid4(),
    });

    await this.cleanupExpiredSessions();

    return {
      sessionId: session.id,
      usuarioId: user.id,
      email: user.email,
      perfis: user.perfis,
      loggedIn: true,
      token: session.token,
    };
  }

  async logout(token) {
    const session = await Session.findOne({ where: { token } });
    if (session) {
      await session.destroy();
      return { success: true, message: "Logged out successfully" };
    } else if (!session) {
      return { success: false, message: "Session not found" };
    }
  }

  async cleanupExpiredSessions() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Session.destroy({
      where: {
        createdAt: {
          [require("sequelize").Op.lt]: twentyFourHoursAgo,
        },
      },
    });
  }

  async listarTodos() {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "nome", "email", "status", "perfis"],
      order: [["nome", "ASC"]],
    });
    return usuarios.map((u) => u.toJSON());
  }

  async buscarPorId(id) {
    const usuario = await Usuario.findByPk(id, {
      attributes: [
        "id",
        "nome",
        "nomeoficial",
        "email",
        "celular",
        "banco",
        "agencia",
        "conta",
        "chavePix",
        "cientepolitica",
        "status",
        "perfis",
      ],
    });
    if (!usuario) {
      throw new ServiceError("Usuario not found");
    }
    return usuario.toJSON();
  }

  async atualizarUsuario(id, dadosParaAtualizar) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        throw new Error("Usuario not found");
      }

      const allowedFields = [
        "nome",
        "nomeoficial",
        "celular",
        "email",
        "banco",
        "agencia",
        "conta",
        "chavePix",
        "cientepolitica",
        "perfis",
        "status",
      ];

      const payloadSeguro = filterPayload(
        Usuario,
        dadosParaAtualizar,
        allowedFields,
      );

      await usuario.update(payloadSeguro);
      return usuario;
    } catch (error) {
      throw new ServiceError("Falha ao atualizar usuario.", { cause: error });
    }
  }
}

class CategoriaProdutosService {
  async listarCategorias() {
    try {
      const categorias = await CategoriaProdutos.findAll({
        order: [["nome", "ASC"]],
        attributes: ["id", "nome", "status", "observacao"],
      });
      return categorias.map((c) => c.toJSON());
    } catch (error) {
      throw new ServiceError("Falha ao listar categorias.", { cause: error });
    }
  }

  async buscarPorId(id) {
    const categoria = await CategoriaProdutos.findByPk(id, {
      attributes: ["id", "nome", "status", "observacao"],
    });

    if (!categoria) {
      throw new ServiceError("Categoria not found");
    }

    return categoria.toJSON();
  }

  async criarCategoria(dados) {
    try {
      const allowedFields = ["nome", "status", "observacao"];
      const payloadSeguro = filterPayload(
        CategoriaProdutos,
        dados,
        allowedFields,
      );

      const novaCategoria = await CategoriaProdutos.create(payloadSeguro);
      return novaCategoria.toJSON();
    } catch (error) {
      throw new ServiceError("Falha ao criar categoria.", { cause: error });
    }
  }

  async atualizarCategoria(id, dadosParaAtualizar) {
    try {
      const categoria = await CategoriaProdutos.findByPk(id);
      if (!categoria) {
        throw new Error("Categoria not found");
      }

      const allowedFields = ["nome", "status", "observacao"];
      const payloadSeguro = filterPayload(
        CategoriaProdutos,
        dadosParaAtualizar,
        allowedFields,
      );

      await categoria.update(payloadSeguro);
      return categoria.toJSON();
    } catch (error) {
      throw new ServiceError("Falha ao atualizar categoria.", { cause: error });
    }
  }

  async deletarCategoria(id) {
    try {
      const categoria = await CategoriaProdutos.findByPk(id);
      if (!categoria) {
        throw new ServiceError("Categoria not found");
      }

      const produtosAssociados = await Produto.count({
        where: { categoriaId: id },
      });

      if (produtosAssociados > 0) {
        throw new ServiceError(
          `Categoria possui ${produtosAssociados} produto(s) associado(s)`,
        );
      }

      await categoria.destroy();
      return { success: true, message: "Categoria deletada com sucesso" };
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao deletar categoria.", { cause: error });
    }
  }
}

class ProdutoComercializavelService {
  async criarProdutoComercializavel(dados) {
    try {
      if (!dados || !dados.produtoId) {
        throw new ServiceError("O produtoId é obrigatório.");
      }
      if (!dados.medida) {
        throw new ServiceError("A medida é obrigatória.");
      }
      if (dados.pesoKg === undefined || dados.pesoKg === null) {
        throw new ServiceError("O peso em kg é obrigatório.");
      }
      if (dados.precoBase === undefined || dados.precoBase === null) {
        throw new ServiceError("O preço base é obrigatório.");
      }

      // Verificar se o produto base existe
      const produto = await Produto.findByPk(dados.produtoId);
      if (!produto) {
        throw new ServiceError(
          `Produto com ID ${dados.produtoId} não encontrado`,
        );
      }

      const allowedFields = [
        "produtoId",
        "medida",
        "pesoKg",
        "precoBase",
        "status",
      ];
      const payloadSeguro = filterPayload(
        ProdutoComercializavel,
        dados,
        allowedFields,
      );
      return await ProdutoComercializavel.create(payloadSeguro);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao criar produto comercializável.", {
        cause: error,
      });
    }
  }

  async buscarPorId(id) {
    try {
      const produtoComercializavel = await ProdutoComercializavel.findByPk(id, {
        include: [{ model: Produto, as: "produto" }],
      });
      if (!produtoComercializavel) {
        throw new ServiceError(
          `Produto comercializável com ID ${id} não encontrado`,
        );
      }
      return produtoComercializavel;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Falha ao buscar produto comercializável por ID.",
        {
          cause: error,
        },
      );
    }
  }

  async atualizarProdutoComercializavel(id, dadosParaAtualizar) {
    try {
      const produtoComercializavel = await this.buscarPorId(id);

      // Se está atualizando o produtoId, verificar se existe
      if (dadosParaAtualizar.produtoId) {
        const produto = await Produto.findByPk(dadosParaAtualizar.produtoId);
        if (!produto) {
          throw new ServiceError(
            `Produto com ID ${dadosParaAtualizar.produtoId} não encontrado`,
          );
        }
      }

      const allowedFields = [
        "produtoId",
        "medida",
        "pesoKg",
        "precoBase",
        "status",
      ];
      const payloadSeguro = filterPayload(
        ProdutoComercializavel,
        dadosParaAtualizar,
        allowedFields,
      );
      await produtoComercializavel.update(payloadSeguro);
      return produtoComercializavel;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao atualizar produto comercializável.", {
        cause: error,
      });
    }
  }

  async deletarProdutoComercializavel(id) {
    try {
      const produtoComercializavel = await this.buscarPorId(id);
      await produtoComercializavel.destroy();
      return true;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao deletar produto comercializável.", {
        cause: error,
      });
    }
  }

  async listarTodos() {
    try {
      const produtosComercializaveis = await ProdutoComercializavel.findAll({
        include: [{ model: Produto, as: "produto" }],
        order: [["createdAt", "DESC"]],
      });
      return produtosComercializaveis;
    } catch (error) {
      throw new ServiceError("Falha ao listar produtos comercializáveis.", {
        cause: error,
      });
    }
  }

  async listarPorProdutoId(produtoId) {
    try {
      const produtosComercializaveis = await ProdutoComercializavel.findAll({
        where: { produtoId },
        include: [{ model: Produto, as: "produto" }],
        order: [["medida", "ASC"]],
      });
      return produtosComercializaveis;
    } catch (error) {
      throw new ServiceError(
        "Falha ao listar produtos comercializáveis por produto.",
        { cause: error },
      );
    }
  }
}

class SubmissaoProdutoService {
  async criarSubmissao(dados) {
    try {
      if (!dados || !dados.fornecedorId) {
        throw new ServiceError("O fornecedorId é obrigatório.");
      }
      if (!dados.nomeProduto) {
        throw new ServiceError("O nome do produto é obrigatório.");
      }
      if (dados.precoUnidade === undefined || dados.precoUnidade === null) {
        throw new ServiceError("O preço por unidade é obrigatório.");
      }
      if (!dados.medida) {
        throw new ServiceError("A medida é obrigatória.");
      }

      // Verificar se o fornecedor existe
      const fornecedor = await Usuario.findByPk(dados.fornecedorId);
      if (!fornecedor) {
        throw new ServiceError(
          `Fornecedor com ID ${dados.fornecedorId} não encontrado`,
        );
      }

      const allowedFields = [
        "fornecedorId",
        "nomeProduto",
        "descricao",
        "imagemUrl",
        "precoUnidade",
        "medida",
        "status",
      ];
      const payloadSeguro = filterPayload(
        SubmissaoProduto,
        dados,
        allowedFields,
      );
      return await SubmissaoProduto.create(payloadSeguro);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao criar submissão de produto.", {
        cause: error,
      });
    }
  }

  async buscarPorId(id) {
    try {
      const submissao = await SubmissaoProduto.findByPk(id, {
        include: [{ model: Usuario, as: "fornecedor" }],
      });
      if (!submissao) {
        throw new ServiceError(`Submissão com ID ${id} não encontrada`);
      }
      return submissao;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao buscar submissão de produto.", {
        cause: error,
      });
    }
  }

  async aprovarSubmissao(id, dadosAtualizacao = {}) {
    try {
      const submissao = await this.buscarPorId(id);

      const allowedFields = ["descricao", "precoUnidade"];
      const payloadSeguro = filterPayload(
        SubmissaoProduto,
        dadosAtualizacao,
        allowedFields,
      );

      await submissao.update({
        ...payloadSeguro,
        status: "aprovado",
        motivoReprovacao: null,
      });
      return submissao;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao aprovar submissão de produto.", {
        cause: error,
      });
    }
  }

  async reprovarSubmissao(id, motivoReprovacao) {
    try {
      if (!motivoReprovacao || !motivoReprovacao.trim()) {
        throw new ServiceError("O motivo da reprovação é obrigatório.");
      }

      const submissao = await this.buscarPorId(id);
      await submissao.update({
        status: "reprovado",
        motivoReprovacao: motivoReprovacao.trim(),
      });
      return submissao;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao reprovar submissão de produto.", {
        cause: error,
      });
    }
  }

  async deletarSubmissao(id) {
    try {
      const submissao = await this.buscarPorId(id);
      await submissao.destroy();
      return true;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao deletar submissão de produto.", {
        cause: error,
      });
    }
  }

  async listarTodas() {
    try {
      const submissoes = await SubmissaoProduto.findAll({
        include: [{ model: Usuario, as: "fornecedor" }],
        order: [["createdAt", "DESC"]],
      });
      return submissoes;
    } catch (error) {
      throw new ServiceError("Falha ao listar submissões de produtos.", {
        cause: error,
      });
    }
  }

  async listarPorStatus(status) {
    try {
      const submissoes = await SubmissaoProduto.findAll({
        where: { status },
        include: [{ model: Usuario, as: "fornecedor" }],
        order: [["createdAt", "DESC"]],
      });
      return submissoes;
    } catch (error) {
      throw new ServiceError(
        "Falha ao listar submissões de produtos por status.",
        { cause: error },
      );
    }
  }

  async listarPorFornecedor(fornecedorId) {
    try {
      const submissoes = await SubmissaoProduto.findAll({
        where: { fornecedorId },
        include: [{ model: Usuario, as: "fornecedor" }],
        order: [["createdAt", "DESC"]],
      });
      return submissoes;
    } catch (error) {
      throw new ServiceError(
        "Falha ao listar submissões de produtos por fornecedor.",
        { cause: error },
      );
    }
  }
}

const MercadoService = require("./mercado-service");
const PrecoMercadoService = require("./precomercado-service");

module.exports = {
  CicloService,
  ProdutoService,
  ProdutoComercializavelService,
  SubmissaoProdutoService,
  CestaService,
  ComposicaoService,
  PontoEntregaService,
  OfertaService,
  PedidoConsumidoresService,
  UsuarioService,
  CryptoUUIDService,
  CategoriaProdutosService,
  MercadoService,
  PrecoMercadoService,
};
