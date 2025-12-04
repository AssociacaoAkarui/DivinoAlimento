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

      if (dados.pontosEntrega && Array.isArray(dados.pontosEntrega)) {
        for (const ponto of dados.pontosEntrega) {
          await PontoEntrega.create(
            {
              nome: ponto.nome || ponto,
              endereco: ponto.endereco || "A definir",
              bairro: ponto.bairro || "A definir",
              cidade: ponto.cidade || "A definir",
              estado: ponto.estado || "RS",
              cep: ponto.cep || "00000-000",
              pontoReferencia: ponto.pontoReferencia || "A definir",
              status: ponto.status || "ativo",
              mercadoId: mercado.id,
            },
            { transaction },
          );
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
