const { CicloMercados, Ciclo, Mercado, PontoEntrega } = require("../../models");
const ServiceError = require("../utils/ServiceError");

class CicloMercadoService {
  async adicionarMercadoCiclo(dados) {
    try {
      // Validações básicas
      if (!dados.cicloId) {
        throw new ServiceError("O cicloId é obrigatório.");
      }
      if (!dados.mercadoId) {
        throw new ServiceError("O mercadoId é obrigatório.");
      }
      if (!dados.tipoVenda) {
        throw new ServiceError("O tipo de venda é obrigatório.");
      }

      // Verificar se ciclo existe
      const ciclo = await Ciclo.findByPk(dados.cicloId);
      if (!ciclo) {
        throw new ServiceError(`Ciclo com ID ${dados.cicloId} não encontrado`);
      }

      // Verificar se mercado existe
      const mercado = await Mercado.findByPk(dados.mercadoId);
      if (!mercado) {
        throw new ServiceError(
          `Mercado com ID ${dados.mercadoId} não encontrado`,
        );
      }

      // Verificar se o mercado já está associado ao ciclo
      const existente = await CicloMercados.findOne({
        where: {
          cicloId: dados.cicloId,
          mercadoId: dados.mercadoId,
        },
      });
      if (existente) {
        throw new ServiceError("Este mercado já está associado a este ciclo.");
      }

      // Verificar se ponto de entrega existe (se fornecido)
      if (dados.pontoEntregaId) {
        const pontoEntrega = await PontoEntrega.findByPk(dados.pontoEntregaId);
        if (!pontoEntrega) {
          throw new ServiceError(
            `Ponto de entrega com ID ${dados.pontoEntregaId} não encontrado`,
          );
        }
      }

      // Validações específicas por tipo de venda
      if (dados.tipoVenda === "cesta") {
        if (!dados.quantidadeCestas || dados.quantidadeCestas <= 0) {
          throw new ServiceError(
            "Quantidade de cestas é obrigatória e deve ser maior que zero para tipo CESTA.",
          );
        }
        if (!dados.valorAlvoCesta || dados.valorAlvoCesta <= 0) {
          throw new ServiceError(
            "Valor alvo da cesta é obrigatório e deve ser maior que zero para tipo CESTA.",
          );
        }
      } else if (dados.tipoVenda === "lote") {
        if (!dados.valorAlvoLote || dados.valorAlvoLote <= 0) {
          throw new ServiceError(
            "Valor alvo do lote é obrigatório e deve ser maior que zero para tipo LOTE.",
          );
        }
      }

      // Criar associação
      const cicloMercado = await CicloMercados.create({
        cicloId: dados.cicloId,
        mercadoId: dados.mercadoId,
        tipoVenda: dados.tipoVenda,
        ordemAtendimento: dados.ordemAtendimento || 1,
        quantidadeCestas: dados.quantidadeCestas || null,
        valorAlvoCesta: dados.valorAlvoCesta || null,
        valorAlvoLote: dados.valorAlvoLote || null,
        pontoEntregaId: dados.pontoEntregaId || null,
        periodoEntregaFornecedorInicio:
          dados.periodoEntregaFornecedorInicio || null,
        periodoEntregaFornecedorFim: dados.periodoEntregaFornecedorFim || null,
        periodoRetiradaInicio: dados.periodoRetiradaInicio || null,
        periodoRetiradaFim: dados.periodoRetiradaFim || null,
        periodoComprasInicio: dados.periodoComprasInicio || null,
        periodoComprasFim: dados.periodoComprasFim || null,
        status: dados.status || "ativo",
      });

      return await this.buscarPorId(cicloMercado.id);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      // Tratar erro de chave duplicada (unique constraint)
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new ServiceError("Este mercado já está associado a este ciclo.");
      }
      throw new ServiceError("Falha ao adicionar mercado ao ciclo.", {
        cause: error,
      });
    }
  }

  async buscarPorId(id) {
    try {
      const cicloMercado = await CicloMercados.findByPk(id, {
        include: [
          { model: Ciclo, as: "ciclo" },
          { model: Mercado, as: "mercado" },
          { model: PontoEntrega, as: "pontoEntrega" },
        ],
      });

      if (!cicloMercado) {
        throw new ServiceError(
          `Associação ciclo-mercado com ID ${id} não encontrada`,
        );
      }

      return cicloMercado;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        "Falha ao buscar associação ciclo-mercado por ID.",
        { cause: error },
      );
    }
  }

  async listarMercadosPorCiclo(cicloId) {
    try {
      const cicloMercados = await CicloMercados.findAll({
        where: { cicloId },
        include: [
          { model: Mercado, as: "mercado" },
          { model: PontoEntrega, as: "pontoEntrega" },
        ],
        order: [["ordemAtendimento", "ASC"]],
      });

      return cicloMercados;
    } catch (error) {
      throw new ServiceError("Falha ao listar mercados do ciclo.", {
        cause: error,
      });
    }
  }

  async atualizarMercadoCiclo(id, dadosParaAtualizar) {
    try {
      const cicloMercado = await this.buscarPorId(id);

      // Se está atualizando o tipo de venda, validar campos obrigatórios
      const novoTipoVenda =
        dadosParaAtualizar.tipoVenda || cicloMercado.tipoVenda;

      if (novoTipoVenda === "cesta") {
        const quantidadeCestas =
          dadosParaAtualizar.quantidadeCestas !== undefined
            ? dadosParaAtualizar.quantidadeCestas
            : cicloMercado.quantidadeCestas;
        const valorAlvoCesta =
          dadosParaAtualizar.valorAlvoCesta !== undefined
            ? dadosParaAtualizar.valorAlvoCesta
            : cicloMercado.valorAlvoCesta;

        if (!quantidadeCestas || quantidadeCestas <= 0) {
          throw new ServiceError(
            "Quantidade de cestas é obrigatória para tipo CESTA.",
          );
        }
        if (!valorAlvoCesta || valorAlvoCesta <= 0) {
          throw new ServiceError(
            "Valor alvo da cesta é obrigatório para tipo CESTA.",
          );
        }
      } else if (novoTipoVenda === "lote") {
        const valorAlvoLote =
          dadosParaAtualizar.valorAlvoLote !== undefined
            ? dadosParaAtualizar.valorAlvoLote
            : cicloMercado.valorAlvoLote;

        if (!valorAlvoLote || valorAlvoLote <= 0) {
          throw new ServiceError(
            "Valor alvo do lote é obrigatório para tipo LOTE.",
          );
        }
      }

      // Verificar se ponto de entrega existe (se está sendo atualizado)
      if (dadosParaAtualizar.pontoEntregaId) {
        const pontoEntrega = await PontoEntrega.findByPk(
          dadosParaAtualizar.pontoEntregaId,
        );
        if (!pontoEntrega) {
          throw new ServiceError(
            `Ponto de entrega com ID ${dadosParaAtualizar.pontoEntregaId} não encontrado`,
          );
        }
      }

      await cicloMercado.update(dadosParaAtualizar);
      return await this.buscarPorId(id);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao atualizar mercado do ciclo.", {
        cause: error,
      });
    }
  }

  async removerMercadoCiclo(id) {
    try {
      const cicloMercado = await this.buscarPorId(id);
      await cicloMercado.destroy();
      return true;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError("Falha ao remover mercado do ciclo.", {
        cause: error,
      });
    }
  }

  async reordenarMercados(cicloId, novaOrdem) {
    try {
      // novaOrdem deve ser um array de objetos: [{ id: 1, ordemAtendimento: 1 }, ...]
      for (const item of novaOrdem) {
        await CicloMercados.update(
          { ordemAtendimento: item.ordemAtendimento },
          {
            where: {
              id: item.id,
              cicloId: cicloId,
            },
          },
        );
      }

      return await this.listarMercadosPorCiclo(cicloId);
    } catch (error) {
      throw new ServiceError("Falha ao reordenar mercados do ciclo.", {
        cause: error,
      });
    }
  }
}

module.exports = CicloMercadoService;
