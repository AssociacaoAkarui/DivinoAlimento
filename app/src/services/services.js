const {
  Ciclo,
  PontoEntrega,
  Cesta,
  CicloEntregas,
  CicloCestas,
  CicloProdutos,
  sequelize,
} = require("../../models");

const CicloModel = require("../model/Ciclo");

class CicloService {
  /**
   * Cria um novo ciclo com suas associações
   * @param {Object} dados - Dados do ciclo a ser criado
   * @returns {Promise<Object>} Ciclo criado com pontos de entrega e cestas
   */
  async criarCiclo(dados) {
    const transaction = await sequelize.transaction();

    try {
      // Validar dados obrigatórios
      this._validarDadosCiclo(dados);

      // Criar o ciclo principal
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
        { transaction }
      );

      // Criar entregas do ciclo
      await this._criarEntregasCiclo(novoCiclo.id, dados, transaction);

      // Criar cestas do ciclo
      await this._criarCestasCiclo(novoCiclo.id, dados, transaction);

      // Criar produtos do ciclo se fornecidos
      await this._criarProdutosCiclo(novoCiclo.id, dados, transaction);

      await transaction.commit();

      // Buscar dados completos do ciclo criado
      const cicloCriado = await this.buscarCicloPorId(novoCiclo.id);

      return cicloCriado;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Erro ao criar ciclo: ${error.message}`);
    }
  }

  /**
   * Atualiza um ciclo existente
   * @param {Number} cicloId - ID do ciclo a ser atualizado
   * @param {Object} dadosAtualizacao - Dados para atualização
   * @returns {Promise<Object>} Ciclo atualizado
   */
  async atualizarCiclo(cicloId, dadosAtualizacao) {
    const transaction = await sequelize.transaction();

    try {
      // Verificar se o ciclo existe
      const cicloExistente = await Ciclo.findByPk(cicloId);
      if (!cicloExistente) {
        throw new Error(`Ciclo com ID ${cicloId} não encontrado`);
      }

      // Atualizar dados básicos do ciclo
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
        { transaction }
      );

      // Atualizar entregas se fornecidas
      if (this._temDadosEntrega(dadosAtualizacao)) {
        await this._atualizarEntregasCiclo(
          cicloId,
          dadosAtualizacao,
          transaction
        );
      }

      // Atualizar cestas se fornecidas
      if (this._temDadosCesta(dadosAtualizacao)) {
        await this._atualizarCestasCiclo(
          cicloId,
          dadosAtualizacao,
          transaction
        );
      }

      // Atualizar produtos se fornecidos
      if (this._temDadosProduto(dadosAtualizacao)) {
        await this._atualizarProdutosCiclo(
          cicloId,
          dadosAtualizacao,
          transaction
        );
      }

      await transaction.commit();

      // Buscar e retornar o ciclo atualizado com todas as associações
      const cicloAtualizado = await this.buscarCicloPorId(cicloId);

      return cicloAtualizado;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Erro ao atualizar ciclo: ${error.message}`);
    }
  }

  /**
   * Busca um ciclo por ID com todas as suas associações
   * @param {Number} cicloId - ID do ciclo
   * @returns {Promise<Object>} Ciclo com suas associações
   */
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

    // Buscar pontos de entrega e cestas ativos para compatibilidade
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

  /**
   * Lista todos os ciclos com paginação
   * @param {Number} limite - Limite de registros
   * @param {Number} offset - Offset para paginação
   * @returns {Promise<Object>} Lista de ciclos e metadados
   */
  async listarCiclos(limite = 10, offset = 0) {
    const { count, rows } = await Ciclo.findAndCountAll({
      limit: limite,
      offset: offset,
      include: [
        {
          model: PontoEntrega,
          as: "pontoEntrega",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      ciclos: rows,
      limite,
      offset,
    };
  }

  /**
   * Deleta um ciclo e suas associações
   * @param {Number} cicloId - ID do ciclo a ser deletado
   * @returns {Promise<Boolean>} true se deletado com sucesso
   */
  async deletarCiclo(cicloId) {
    const transaction = await sequelize.transaction();

    try {
      const ciclo = await Ciclo.findByPk(cicloId);

      if (!ciclo) {
        throw new Error(`Ciclo com ID ${cicloId} não encontrado`);
      }

      // As associações serão deletadas automaticamente devido ao CASCADE
      await ciclo.destroy({ transaction });

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Erro ao deletar ciclo: ${error.message}`);
    }
  }

  // Métodos privados auxiliares

  _validarDadosCiclo(dados) {
    const camposObrigatorios = ["nome"];

    for (const campo of camposObrigatorios) {
      if (!dados[campo]) {
        throw new Error(`Campo obrigatório ausente: ${campo}`);
      }
    }

    // Validar datas se fornecidas
    if (dados.ofertaInicio && dados.ofertaFim) {
      if (new Date(dados.ofertaInicio) > new Date(dados.ofertaFim)) {
        throw new Error(
          "Data de início da oferta não pode ser posterior à data de fim"
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
        { transaction }
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
        { transaction }
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
        { transaction }
      );
    }
  }

  async _atualizarEntregasCiclo(cicloId, dados, transaction) {
    // Deletar entregas existentes
    await CicloEntregas.destroy({
      where: { cicloId },
      transaction,
    });

    // Criar novas entregas
    await this._criarEntregasCiclo(cicloId, dados, transaction);
  }

  async _atualizarCestasCiclo(cicloId, dados, transaction) {
    // Deletar cestas existentes
    await CicloCestas.destroy({
      where: { cicloId },
      transaction,
    });

    // Criar novas cestas
    await this._criarCestasCiclo(cicloId, dados, transaction);
  }

  async _atualizarProdutosCiclo(cicloId, dados, transaction) {
    // Deletar produtos existentes
    await CicloProdutos.destroy({
      where: { cicloId },
      transaction,
    });

    // Criar novos produtos
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

    // Suportar formato alternativo com '1' no final
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

    // Suportar formato alternativo
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

module.exports = { CicloService };
