const { Op } = require("sequelize");
const { sanitizePayload, normalizePayload } = require("../utils/modelUtils");
const {
  Ciclo,
  PontoEntrega,
  Cesta,
  CicloEntregas,
  CicloCestas,
  CicloProdutos,
  Produto,
  CategoriaProdutos,
  sequelize,
} = require("../../models");

const CicloModel = require("../model/Ciclo");
const PontoEntregaModel = require("../model/PontoEntrega");
const CestaModel = require("../model/Cesta");

class CicloService {
  async prepararDadosCriacaoCiclo() {
    try {
      await CestaModel.verificaCriaCestasInternas();
      const pontosEntrega = await PontoEntregaModel.get();
      const tiposCesta = await CestaModel.getCestasAtivas();
      return { pontosEntrega, tiposCesta };
    } catch (error) {
      error.message = `Erro ao preparar dados para criação de ciclo: ${error.message}`;
      throw error;
    }
  }

  async criarCiclo(dados, options = {}) {
    const transaction = options.transaction || (await sequelize.transaction());
    try {
      const dadosNormalizados = normalizePayload(Ciclo, dados);
      const payloadSeguro = sanitizePayload(dadosNormalizados);
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
      throw error;
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
      await cicloExistente.update(dadosNormalizados, { transaction });

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
      throw error;
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
      throw new Error(`Erro ao deletar ciclo: ${error.message}`);
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
        throw new Error("O nome do produto é obrigatório.");
      }
      return await Produto.create(dadosProduto);
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  async buscarProdutoPorId(id) {
    const produto = await Produto.findByPk(id, {
      include: [{ model: CategoriaProdutos, as: "categoria" }],
    });
    if (!produto) {
      throw new Error(`Produto com ID ${id} não encontrado`);
    }
    return produto;
  }

  async atualizarProduto(id, dadosParaAtualizar) {
    try {
      const produto = await this.buscarProdutoPorId(id);
      await produto.update(dadosParaAtualizar);
      return produto;
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  async deletarProduto(id) {
    try {
      const produto = await this.buscarProdutoPorId(id);
      await produto.destroy();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }
}

module.exports = { CicloService, ProdutoService };
