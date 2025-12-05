const { Mercado, Usuario, PontoEntrega, sequelize } = require("../../models");
const ServiceError = require("../utils/ServiceError");
const { filterPayload } = require("../utils/modelUtils");

class MercadoService {
  async listarMercados() {
    try {
      return await Mercado.findAll({
        include: [
          { model: Usuario, as: "responsavel" },
          { model: PontoEntrega, as: "pontosEntrega" },
        ],
        order: [["nome", "ASC"]],
      });
    } catch (error) {
      throw new ServiceError("Falha ao listar mercados.", { cause: error });
    }
  }

  async buscarPorId(id) {
    try {
      const mercado = await Mercado.findByPk(id, {
        include: [
          { model: Usuario, as: "responsavel" },
          { model: PontoEntrega, as: "pontosEntrega" },
        ],
      });
      if (!mercado) {
        throw new ServiceError(`Mercado com ID ${id} não encontrado`);
      }
      return mercado;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao buscar mercado por ID.", {
        cause: error,
      });
    }
  }

  async criarMercado(dados) {
    const transaction = await sequelize.transaction();
    try {
      if (!dados.responsavelId) {
        throw new ServiceError("O responsavelId é obrigatório.");
      }

      const responsavel = await Usuario.findByPk(dados.responsavelId);
      if (!responsavel) {
        throw new ServiceError(
          `Usuário com ID ${dados.responsavelId} não encontrado`,
        );
      }

      const allowedFields = [
        "nome",
        "tipo",
        "responsavelId",
        "taxaAdministrativa",
        "valorMaximoCesta",
        "status",
      ];
      const payloadSeguro = filterPayload(Mercado, dados, allowedFields);

      if (payloadSeguro.tipo === "cesta" && !payloadSeguro.valorMaximoCesta) {
        throw new ServiceError(
          "O valorMaximoCesta é obrigatório para mercados do tipo cesta.",
        );
      }

      const mercado = await Mercado.create(payloadSeguro, { transaction });

      // Criar novos pontos de entrega se fornecidos como objetos
      if (dados.pontosEntrega && Array.isArray(dados.pontosEntrega)) {
        for (const pontoData of dados.pontosEntrega) {
          // Se é um objeto com dados para criar novo ponto
          if (typeof pontoData === "object" && pontoData.nome) {
            await PontoEntrega.create(
              {
                nome: pontoData.nome,
                status: pontoData.status || "ativo",
                mercadoId: mercado.id,
                endereco: pontoData.endereco,
                bairro: pontoData.bairro,
                cidade: pontoData.cidade,
                estado: pontoData.estado,
                cep: pontoData.cep,
                pontoReferencia: pontoData.pontoReferencia,
              },
              { transaction },
            );
          }
        }
      }

      // Associar pontos de entrega existentes ao mercado
      if (dados.pontoEntregaIds && Array.isArray(dados.pontoEntregaIds)) {
        for (const pontoId of dados.pontoEntregaIds) {
          const ponto = await PontoEntrega.findByPk(pontoId, { transaction });
          if (!ponto) {
            throw new ServiceError(
              `Ponto de entrega com ID ${pontoId} não encontrado`,
            );
          }
          await ponto.update({ mercadoId: mercado.id }, { transaction });
        }
      }

      await transaction.commit();

      return await this.buscarPorId(mercado.id);
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao criar mercado.", { cause: error });
    }
  }

  async atualizarMercado(id, dados) {
    try {
      const mercado = await this.buscarPorId(id);

      if (dados.responsavelId) {
        const responsavel = await Usuario.findByPk(dados.responsavelId);
        if (!responsavel) {
          throw new ServiceError(
            `Usuário com ID ${dados.responsavelId} não encontrado`,
          );
        }
      }

      const allowedFields = [
        "nome",
        "tipo",
        "responsavelId",
        "taxaAdministrativa",
        "valorMaximoCesta",
        "status",
      ];
      const payloadSeguro = filterPayload(Mercado, dados, allowedFields);

      const tipoFinal = payloadSeguro.tipo || mercado.tipo;
      if (
        tipoFinal === "cesta" &&
        payloadSeguro.valorMaximoCesta === undefined &&
        !mercado.valorMaximoCesta
      ) {
        throw new ServiceError(
          "O valorMaximoCesta é obrigatório para mercados do tipo cesta.",
        );
      }

      await mercado.update(payloadSeguro);

      // Atualizar pontos de entrega associados se fornecidos
      if (dados.pontoEntregaIds && Array.isArray(dados.pontoEntregaIds)) {
        // Primeiro, remover associação dos pontos atuais
        await PontoEntrega.update(
          { mercadoId: null },
          { where: { mercadoId: id } },
        );

        // Depois, associar os novos pontos
        for (const pontoId of dados.pontoEntregaIds) {
          const ponto = await PontoEntrega.findByPk(pontoId);
          if (!ponto) {
            throw new ServiceError(
              `Ponto de entrega com ID ${pontoId} não encontrado`,
            );
          }
          await ponto.update({ mercadoId: id });
        }
      }

      return await this.buscarPorId(id);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao atualizar mercado.", { cause: error });
    }
  }

  async deletarMercado(id) {
    try {
      const mercado = await this.buscarPorId(id);
      await mercado.destroy();
      return true;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao deletar mercado.", { cause: error });
    }
  }

  async listarMercadosAtivos() {
    try {
      return await Mercado.findAll({
        where: { status: "ativo" },
        include: [
          { model: Usuario, as: "responsavel" },
          { model: PontoEntrega, as: "pontosEntrega" },
        ],
        order: [["nome", "ASC"]],
      });
    } catch (error) {
      throw new ServiceError("Falha ao listar mercados ativos.", {
        cause: error,
      });
    }
  }

  async listarMercadosPorResponsavel(responsavelId) {
    try {
      const responsavel = await Usuario.findByPk(responsavelId);
      if (!responsavel) {
        throw new ServiceError(
          `Usuário com ID ${responsavelId} não encontrado`,
        );
      }

      return await Mercado.findAll({
        where: { responsavelId },
        include: [
          { model: Usuario, as: "responsavel" },
          { model: PontoEntrega, as: "pontosEntrega" },
        ],
        order: [["nome", "ASC"]],
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao listar mercados por responsável.", {
        cause: error,
      });
    }
  }
}

module.exports = MercadoService;
