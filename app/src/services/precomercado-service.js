const { PrecoMercado, Produto, Mercado, sequelize } = require("../../models");
const ServiceError = require("../utils/ServiceError");
const { filterPayload } = require("../utils/modelUtils");

class PrecoMercadoService {
  async criarPreco(dados) {
    const transaction = await sequelize.transaction();
    try {
      const produto = await Produto.findByPk(dados.produtoId);
      if (!produto) {
        throw new ServiceError(
          `Produto com ID ${dados.produtoId} não encontrado`,
        );
      }

      const mercado = await Mercado.findByPk(dados.mercadoId);
      if (!mercado) {
        throw new ServiceError(
          `Mercado com ID ${dados.mercadoId} não encontrado`,
        );
      }

      const precoExistente = await PrecoMercado.findOne({
        where: {
          produtoId: dados.produtoId,
          mercadoId: dados.mercadoId,
        },
      });

      if (precoExistente) {
        throw new ServiceError(
          "Já existe um preço cadastrado para este produto neste mercado",
        );
      }

      const payload = filterPayload(PrecoMercado, dados, [
        "produtoId",
        "mercadoId",
        "preco",
        "status",
      ]);
      const preco = await PrecoMercado.create(payload, { transaction });
      await transaction.commit();

      return await this.buscarPreco(preco.id);
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao criar preço.", { cause: error });
    }
  }

  async buscarPreco(id) {
    try {
      const preco = await PrecoMercado.findByPk(id, {
        include: [
          { model: Produto, as: "produto" },
          { model: Mercado, as: "mercado" },
        ],
      });
      return preco;
    } catch (error) {
      throw new ServiceError("Falha ao buscar preço.", { cause: error });
    }
  }

  async listarPrecosPorMercado(mercadoId) {
    try {
      return await PrecoMercado.findAll({
        where: { mercadoId },
        include: [
          { model: Produto, as: "produto" },
          { model: Mercado, as: "mercado" },
        ],
        order: [["id", "ASC"]],
      });
    } catch (error) {
      throw new ServiceError("Falha ao listar preços do mercado.", {
        cause: error,
      });
    }
  }

  async listarPrecosPorProduto(produtoId) {
    try {
      return await PrecoMercado.findAll({
        where: { produtoId },
        include: [
          { model: Produto, as: "produto" },
          { model: Mercado, as: "mercado" },
        ],
        order: [["id", "ASC"]],
      });
    } catch (error) {
      throw new ServiceError("Falha ao listar preços do produto.", {
        cause: error,
      });
    }
  }

  async atualizarPreco(id, dados) {
    const transaction = await sequelize.transaction();
    try {
      const preco = await PrecoMercado.findByPk(id);
      if (!preco) {
        throw new ServiceError(`Preço com ID ${id} não encontrado`);
      }

      const payload = filterPayload(PrecoMercado, dados, ["preco", "status"]);
      await preco.update(payload, { transaction });
      await transaction.commit();

      return await this.buscarPreco(id);
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao atualizar preço.", { cause: error });
    }
  }

  async deletarPreco(id) {
    const transaction = await sequelize.transaction();
    try {
      const preco = await PrecoMercado.findByPk(id);
      if (!preco) {
        throw new ServiceError(`Preço com ID ${id} não encontrado`);
      }

      await preco.destroy({ transaction });
      await transaction.commit();

      return { success: true, message: "Preço deletado com sucesso" };
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao deletar preço.", { cause: error });
    }
  }

  async buscarPrecoProdutoMercado(produtoId, mercadoId) {
    try {
      const preco = await PrecoMercado.findOne({
        where: { produtoId, mercadoId },
        include: [
          { model: Produto, as: "produto" },
          { model: Mercado, as: "mercado" },
        ],
      });
      return preco;
    } catch (error) {
      throw new ServiceError("Falha ao buscar preço do produto no mercado.", {
        cause: error,
      });
    }
  }
}

module.exports = PrecoMercadoService;
