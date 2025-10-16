const { Op } = require("sequelize");
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
      this._validarDadosCiclo(dados);

      const novoCiclo = await Ciclo.create(
        {
          nome: dados.nome,
          pontoEntregaId: dados.pontoEntregaId || null,
          ofertaInicio: dados.ofertaInicio,
          ofertaFim: dados.ofertaFim,
          itensAdicionaisInicio: dados.itensAdicionaisInicio,
          itensAdicionaisFim: dados.itensAdicionaisFim,
          retiradaConsumidorInicio: dados.retiradaConsumidorInicio,
          retiradaConsumidorFim: dados.retiradaConsumidorFim,
          observacao: dados.observacao || null,
          status: dados.status || "ativo",
        },
        { transaction },
      );

      await this._criarEntregasCiclo(novoCiclo.id, dados, transaction);

      await this._criarCestasCiclo(novoCiclo.id, dados, transaction);

      await this._criarProdutosCiclo(novoCiclo.id, dados, transaction);

      if (!options.transaction) {
        await transaction.commit();
      }

      const cicloCriado = await this.buscarCicloPorId(novoCiclo.id);

      return cicloCriado;
    } catch (error) {
      if (!options.transaction) {
        await transaction.rollback();
      }
      error.message = `Erro ao criar ciclo: ${error.message}`;
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

      await cicloExistente.update(
        {
          nome: dadosAtualizacao.nome || cicloExistente.nome,
          pontoEntregaId:
            dadosAtualizacao.pontoEntregaId !== undefined
              ? dadosAtualizacao.pontoEntregaId
              : cicloExistente.pontoEntregaId,
          ofertaInicio:
            dadosAtualizacao.ofertaInicio || cicloExistente.ofertaInicio,
          ofertaFim: dadosAtualizacao.ofertaFim || cicloExistente.ofertaFim,
          itensAdicionaisInicio:
            dadosAtualizacao.itensAdicionaisInicio ||
            cicloExistente.itensAdicionaisInicio,
          itensAdicionaisFim:
            dadosAtualizacao.itensAdicionaisFim ||
            cicloExistente.itensAdicionaisFim,
          retiradaConsumidorInicio:
            dadosAtualizacao.retiradaConsumidorInicio ||
            cicloExistente.retiradaConsumidorInicio,
          retiradaConsumidorFim:
            dadosAtualizacao.retiradaConsumidorFim ||
            cicloExistente.retiradaConsumidorFim,
          observacao:
            dadosAtualizacao.observacao !== undefined
              ? dadosAtualizacao.observacao
              : cicloExistente.observacao,
          status: dadosAtualizacao.status || cicloExistente.status,
        },
        { transaction },
      );

      if (this._temDadosEntrega(dadosAtualizacao)) {
        await this._atualizarEntregasCiclo(
          cicloId,
          dadosAtualizacao,
          transaction,
        );
      }

      if (this._temDadosCesta(dadosAtualizacao)) {
        await this._atualizarCestasCiclo(
          cicloId,
          dadosAtualizacao,
          transaction,
        );
      }

      if (this._temDadosProduto(dadosAtualizacao)) {
        await this._atualizarProdutosCiclo(
          cicloId,
          dadosAtualizacao,
          transaction,
        );
      }

      if (!options.transaction) {
        await transaction.commit();
      }

      const cicloAtualizado = await this.buscarCicloPorId(cicloId);

      return cicloAtualizado;
    } catch (error) {
      if (!options.transaction) {
        await transaction.rollback();
      }
      error.message = `Erro ao atualizar ciclo: ${error.message}`;
      throw error;
    }
  }

  async buscarCicloPorId(cicloId) {
    const ciclo = await Ciclo.findByPk(cicloId, {
      include: [
        {
          model: PontoEntrega,
          as: "pontoEntrega",
        },
        {
          model: CicloEntregas,
          as: "cicloEntregas",
        },
        {
          model: CicloCestas,
          as: "CicloCestas",
          include: [
            {
              model: Cesta,
              as: "cesta",
            },
          ],
        },
        {
          model: CicloProdutos,
          as: "cicloProdutos",
        },
      ],
    });

    if (!ciclo) {
      throw new Error(`Ciclo com ID ${cicloId} não encontrado`);
    }

    const pontosEntrega = await PontoEntrega.findAll({
      where: { status: "ativo" },
    });

    const tiposCesta = await Cesta.findAll({
      where: { status: "ativo" },
    });

    return {
      ...ciclo.toJSON(),
      pontosEntrega,
      tiposCesta,
    };
  }

  async listarCiclos(limite = 10, cursor = null) {
    const where = {};
    if (cursor) {
      where.createdAt = {
        [Op.lt]: new Date(cursor),
      };
    }

    const { count, rows } = await Ciclo.findAndCountAll({
      where,
      limit: limite,
      include: [
        {
          model: PontoEntrega,
          as: "pontoEntrega",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const nextCursor = rows.length > 0 ? rows[rows.length - 1].createdAt : null;

    return {
      total: count,
      ciclos: rows,
      limite,
      nextCursor,
    };
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
      error.message = `Erro ao deletar ciclo: ${error.message}`;
      throw error;
    }
  }

  _validarDadosCiclo(dados) {
    const camposObrigatorios = ["nome"];

    for (const campo of camposObrigatorios) {
      if (!dados[campo]) {
        throw new Error(`Campo obrigatório ausente: ${campo}`);
      }
    }

    if (dados.ofertaInicio && dados.ofertaFim) {
      if (new Date(dados.ofertaInicio) > new Date(dados.ofertaFim)) {
        throw new Error(
          "Data de início da oferta não pode ser posterior à data de fim",
        );
      }
    }
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
        {
          cicloId,
          cestaId: cesta.id,
          quantidadeCestas: cesta.quantidade,
        },
        { transaction },
      );
    }
  }

  async _criarProdutosCiclo(cicloId, dados, transaction) {
    const produtos = this._extrairProdutos(dados);

    for (const produto of produtos) {
      await CicloProdutos.create(
        {
          cicloId,
          produtoId: produto.id,
          quantidade: produto.quantidade,
        },
        { transaction },
      );
    }
  }

  async _atualizarEntregasCiclo(cicloId, dados, transaction) {
    await CicloEntregas.destroy({
      where: { cicloId },
      transaction,
    });

    await this._criarEntregasCiclo(cicloId, dados, transaction);
  }

  async _atualizarCestasCiclo(cicloId, dados, transaction) {
    await CicloCestas.destroy({
      where: { cicloId },
      transaction,
    });

    await this._criarCestasCiclo(cicloId, dados, transaction);
  }

  async _atualizarProdutosCiclo(cicloId, dados, transaction) {
    await CicloProdutos.destroy({
      where: { cicloId },
      transaction,
    });

    await this._criarProdutosCiclo(cicloId, dados, transaction);
  }

  _extrairEntregas(dados) {
    const entregas = [];
    let contador = 1;

    while (dados[`entregaFornecedorInicio${contador}`]) {
      const inicio = dados[`entregaFornecedorInicio${contador}`];
      const fim = dados[`entregaFornecedorFim${contador}`];

      if (inicio && fim) {
        entregas.push({ inicio, fim });
      }

      contador++;
    }

    if (entregas.length === 0 && dados.entregaFornecedorInicio1) {
      let contador = 1;
      while (dados[`entregaFornecedorInicio${contador}`]) {
        const inicio = dados[`entregaFornecedorInicio${contador}`];
        const fim = dados[`entregaFornecedorFim${contador}`];

        if (inicio && fim) {
          entregas.push({ inicio, fim });
        }

        contador++;
      }
    }

    return entregas;
  }

  _extrairCestas(dados) {
    const cestas = [];
    let contador = 1;

    while (dados[`cestaId${contador}`]) {
      const id = dados[`cestaId${contador}`];
      const quantidade = dados[`quantidadeCestas${contador}`];

      if (id && quantidade && quantidade > 0) {
        cestas.push({ id, quantidade: parseInt(quantidade) });
      }

      contador++;
    }

    if (cestas.length === 0 && dados.cestaId1) {
      let contador = 1;
      while (dados[`cestaId${contador}`]) {
        const id = dados[`cestaId${contador}`];
        const quantidade = dados[`quantidadeCestas${contador}`];

        if (id && quantidade && quantidade > 0) {
          cestas.push({ id, quantidade: parseInt(quantidade) });
        }

        contador++;
      }
    }

    return cestas;
  }

  _extrairProdutos(dados) {
    const produtos = [];
    let contador = 1;

    while (dados[`produtoId${contador}`]) {
      const id = dados[`produtoId${contador}`];
      const quantidade = dados[`quantidadeProdutos${contador}`];

      if (id && quantidade && quantidade > 0) {
        produtos.push({ id, quantidade: parseInt(quantidade) });
      }

      contador++;
    }

    return produtos;
  }

  _temDadosEntrega(dados) {
    return dados.entregaFornecedorInicio1 || dados.entregaFornecedorInicio1;
  }

  _temDadosCesta(dados) {
    return dados.cestaId1 || dados.cestaId1;
  }

  _temDadosProduto(dados) {
    return dados.produtoId1 || dados.produtoId1;
  }
}

class ProdutoService {
  async criarProduto(dadosProduto) {
    try {
      if (!dadosProduto || !dadosProduto.nome) {
        throw new Error("O nome do produto é obrigatório.");
      }

      const produto = await Produto.create(dadosProduto);
      return produto;
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  async buscarProdutoPorId(id) {
    const produto = await Produto.findByPk(id, {
      include: [
        {
          model: CategoriaProdutos,
          as: "categoria",
        },
      ],
    });

    if (!produto) {
      throw new Error(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async atualizarProduto(id, dadosParaAtualizar) {
    try {
      const produto = await Produto.findByPk(id);

      if (!produto) {
        throw new Error(`Produto com ID ${id} não encontrado`);
      }

      await produto.update(dadosParaAtualizar);

      return produto;
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  async deletarProduto(id) {
    try {
      const produto = await Produto.findByPk(id);

      if (!produto) {
        throw new Error(`Produto com ID ${id} não encontrado`);
      }

      await produto.destroy();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }
}

module.exports = { CicloService, ProdutoService };
