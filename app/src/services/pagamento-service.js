const { filterPayload } = require("../utils/modelUtils");
const ServiceError = require("../utils/ServiceError");
const {
  Pagamento,
  Ciclo,
  Mercado,
  Usuario,
  Oferta,
  OfertaProdutos,
  PedidoConsumidores,
  PedidoConsumidoresProdutos,
  sequelize,
} = require("../../models");

class PagamentoService {
  async listarPagamentos(filtros = {}) {
    try {
      const where = {};

      if (filtros.tipo) {
        where.tipo = filtros.tipo;
      }

      if (filtros.status) {
        where.status = filtros.status;
      }

      if (filtros.cicloId) {
        where.cicloId = filtros.cicloId;
      }

      if (filtros.mercadoId) {
        where.mercadoId = filtros.mercadoId;
      }

      if (filtros.usuarioId) {
        where.usuarioId = filtros.usuarioId;
      }

      return await Pagamento.findAll({
        where,
        include: [
          { model: Ciclo, as: "ciclo" },
          { model: Mercado, as: "mercado" },
          { model: Usuario, as: "usuario" },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      throw new ServiceError("Falha ao listar pagamentos.", { cause: error });
    }
  }

  async buscarPorId(id) {
    try {
      const pagamento = await Pagamento.findByPk(id, {
        include: [
          { model: Ciclo, as: "ciclo" },
          { model: Mercado, as: "mercado" },
          { model: Usuario, as: "usuario" },
        ],
      });

      if (!pagamento) {
        throw new ServiceError(`Pagamento com ID ${id} não encontrado`);
      }

      return pagamento;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao buscar pagamento por ID.", {
        cause: error,
      });
    }
  }

  async criarPagamento(dados) {
    try {
      // Validar existência do ciclo
      if (!dados.cicloId) {
        throw new ServiceError("O cicloId é obrigatório.");
      }
      const ciclo = await Ciclo.findByPk(dados.cicloId);
      if (!ciclo) {
        throw new ServiceError(`Ciclo com ID ${dados.cicloId} não encontrado`);
      }

      // Validar existência do mercado
      if (!dados.mercadoId) {
        throw new ServiceError("O mercadoId é obrigatório.");
      }
      const mercado = await Mercado.findByPk(dados.mercadoId);
      if (!mercado) {
        throw new ServiceError(
          `Mercado com ID ${dados.mercadoId} não encontrado`,
        );
      }

      // Validar existência do usuário
      if (!dados.usuarioId) {
        throw new ServiceError("O usuarioId é obrigatório.");
      }
      const usuario = await Usuario.findByPk(dados.usuarioId);
      if (!usuario) {
        throw new ServiceError(
          `Usuário com ID ${dados.usuarioId} não encontrado`,
        );
      }

      const allowedFields = [
        "tipo",
        "valorTotal",
        "status",
        "dataPagamento",
        "observacao",
        "cicloId",
        "mercadoId",
        "usuarioId",
      ];

      const payloadSeguro = filterPayload(Pagamento, dados, allowedFields);

      // Validar valor total
      if (
        payloadSeguro.valorTotal === undefined ||
        payloadSeguro.valorTotal < 0
      ) {
        throw new ServiceError("O valorTotal deve ser maior ou igual a zero.");
      }

      const pagamento = await Pagamento.create(payloadSeguro);

      return await this.buscarPorId(pagamento.id);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao criar pagamento.", { cause: error });
    }
  }

  async atualizarPagamento(id, dados) {
    try {
      const pagamento = await this.buscarPorId(id);

      // Validar existência do ciclo se fornecido
      if (dados.cicloId) {
        const ciclo = await Ciclo.findByPk(dados.cicloId);
        if (!ciclo) {
          throw new ServiceError(
            `Ciclo com ID ${dados.cicloId} não encontrado`,
          );
        }
      }

      // Validar existência do mercado se fornecido
      if (dados.mercadoId) {
        const mercado = await Mercado.findByPk(dados.mercadoId);
        if (!mercado) {
          throw new ServiceError(
            `Mercado com ID ${dados.mercadoId} não encontrado`,
          );
        }
      }

      // Validar existência do usuário se fornecido
      if (dados.usuarioId) {
        const usuario = await Usuario.findByPk(dados.usuarioId);
        if (!usuario) {
          throw new ServiceError(
            `Usuário com ID ${dados.usuarioId} não encontrado`,
          );
        }
      }

      const allowedFields = [
        "tipo",
        "valorTotal",
        "status",
        "dataPagamento",
        "observacao",
        "cicloId",
        "mercadoId",
        "usuarioId",
      ];

      const payloadSeguro = filterPayload(Pagamento, dados, allowedFields);

      // Validar valor total se fornecido
      if (
        payloadSeguro.valorTotal !== undefined &&
        payloadSeguro.valorTotal < 0
      ) {
        throw new ServiceError("O valorTotal deve ser maior ou igual a zero.");
      }

      await pagamento.update(payloadSeguro);

      return await this.buscarPorId(id);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao atualizar pagamento.", {
        cause: error,
      });
    }
  }

  async deletarPagamento(id) {
    try {
      const pagamento = await this.buscarPorId(id);
      await pagamento.destroy();
      return true;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao deletar pagamento.", { cause: error });
    }
  }

  async marcarComoPago(id, dataPagamento = null, observacao = null) {
    try {
      const pagamento = await this.buscarPorId(id);

      const dados = {
        status: "pago",
        dataPagamento: dataPagamento || new Date().toISOString().split("T")[0],
      };

      if (observacao) {
        dados.observacao = observacao;
      }

      await pagamento.update(dados);

      return await this.buscarPorId(id);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao marcar pagamento como pago.", {
        cause: error,
      });
    }
  }

  async cancelarPagamento(id, observacao = null) {
    try {
      const pagamento = await this.buscarPorId(id);

      const dados = {
        status: "cancelado",
      };

      if (observacao) {
        dados.observacao = observacao;
      }

      await pagamento.update(dados);

      return await this.buscarPorId(id);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao cancelar pagamento.", { cause: error });
    }
  }

  async gerarPagamentosPorCiclo(cicloId) {
    const transaction = await sequelize.transaction();
    try {
      // Validar existência do ciclo
      const ciclo = await Ciclo.findByPk(cicloId);
      if (!ciclo) {
        throw new ServiceError(`Ciclo com ID ${cicloId} não encontrado`);
      }

      // Verificar se o ciclo está finalizado
      if (ciclo.status !== "finalizado") {
        throw new ServiceError(
          "Só é possível gerar pagamentos para ciclos finalizados.",
        );
      }

      // Buscar ofertas do ciclo (pagamentos para fornecedores)
      const ofertas = await Oferta.findAll({
        where: { cicloId },
        include: [
          {
            model: OfertaProdutos,
            as: "ofertaProdutos",
          },
          {
            model: Usuario,
            as: "usuario",
          },
        ],
      });

      // Buscar pedidos do ciclo (pagamentos de consumidores)
      const pedidos = await PedidoConsumidores.findAll({
        where: { cicloId },
        include: [
          {
            model: PedidoConsumidoresProdutos,
            as: "pedidoConsumidoresProdutos",
          },
          {
            model: Usuario,
            as: "usuario",
          },
        ],
      });

      const pagamentosCriados = [];

      const mercado = await Mercado.findOne();
      if (!mercado) {
        throw new ServiceError("Nenhum mercado encontrado");
      }

      for (const oferta of ofertas) {
        const valorTotal = oferta.ofertaProdutos.reduce((sum, produto) => {
          return sum + parseFloat(produto.valorOferta || 0);
        }, 0);

        if (valorTotal > 0) {
          const pagamento = await Pagamento.create(
            {
              tipo: "fornecedor",
              valorTotal,
              status: "a_receber",
              cicloId,
              mercadoId: mercado.id,
              usuarioId: oferta.usuarioId,
            },
            { transaction },
          );
          pagamentosCriados.push(pagamento);
        }
      }

      // Gerar pagamentos para consumidores
      for (const pedido of pedidos) {
        const valorTotal = pedido.pedidoConsumidoresProdutos.reduce(
          (sum, produto) => {
            return sum + parseFloat(produto.valorCompra || 0);
          },
          0,
        );

        if (valorTotal > 0) {
          const pagamento = await Pagamento.create(
            {
              tipo: "consumidor",
              valorTotal,
              status: "a_pagar",
              cicloId,
              mercadoId: mercado.id,
              usuarioId: pedido.usuarioId,
            },
            { transaction },
          );
          pagamentosCriados.push(pagamento);
        }
      }

      await transaction.commit();

      return pagamentosCriados;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao gerar pagamentos por ciclo.", {
        cause: error,
      });
    }
  }

  async calcularTotalPorCiclo(cicloId) {
    try {
      const pagamentos = await this.listarPagamentos({ cicloId });

      const totalReceber = pagamentos
        .filter((p) => p.tipo === "fornecedor")
        .reduce((sum, p) => sum + parseFloat(p.valorTotal), 0);

      const totalPagar = pagamentos
        .filter((p) => p.tipo === "consumidor")
        .reduce((sum, p) => sum + parseFloat(p.valorTotal), 0);

      return {
        totalReceber,
        totalPagar,
        saldo: totalPagar - totalReceber,
      };
    } catch (error) {
      throw new ServiceError("Falha ao calcular total por ciclo.", {
        cause: error,
      });
    }
  }
}

module.exports = PagamentoService;
