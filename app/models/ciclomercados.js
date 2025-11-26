const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CicloMercados extends Model {
    static associate(models) {
      CicloMercados.belongsTo(models.Ciclo, {
        foreignKey: "cicloId",
        as: "ciclo",
      });
      CicloMercados.belongsTo(models.Mercado, {
        foreignKey: "mercadoId",
        as: "mercado",
      });
      CicloMercados.belongsTo(models.PontoEntrega, {
        foreignKey: "pontoEntregaId",
        as: "pontoEntrega",
      });
    }
  }

  CicloMercados.init(
    {
      cicloId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "O ciclo é obrigatório.",
          },
        },
      },
      mercadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "O mercado é obrigatório.",
          },
        },
      },
      tipoVenda: {
        type: DataTypes.ENUM("cesta", "lote", "venda_direta"),
        allowNull: false,
        validate: {
          notNull: {
            msg: "O tipo de venda é obrigatório.",
          },
          isIn: {
            args: [["cesta", "lote", "venda_direta"]],
            msg: "Tipo de venda inválido. Use: cesta, lote ou venda_direta.",
          },
        },
      },
      ordemAtendimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: {
            args: [1],
            msg: "A ordem de atendimento deve ser no mínimo 1.",
          },
        },
      },
      quantidadeCestas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [1],
            msg: "A quantidade de cestas deve ser no mínimo 1.",
          },
          validarCesta(value) {
            if (this.tipoVenda === "cesta" && !value) {
              throw new Error(
                "Quantidade de cestas é obrigatória para tipo CESTA."
              );
            }
          },
        },
      },
      valorAlvoCesta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: "O valor alvo da cesta deve ser positivo.",
          },
          validarCesta(value) {
            if (this.tipoVenda === "cesta" && !value) {
              throw new Error(
                "Valor alvo da cesta é obrigatório para tipo CESTA."
              );
            }
          },
        },
      },
      valorAlvoLote: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg: "O valor alvo do lote deve ser positivo.",
          },
          validarLote(value) {
            if (this.tipoVenda === "lote" && !value) {
              throw new Error("Valor alvo do lote é obrigatório para tipo LOTE.");
            }
          },
        },
      },
      pontoEntregaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      periodoEntregaFornecedorInicio: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      periodoEntregaFornecedorFim: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          validarPeriodoFornecedor(value) {
            if (
              this.periodoEntregaFornecedorInicio &&
              value &&
              new Date(value) <= new Date(this.periodoEntregaFornecedorInicio)
            ) {
              throw new Error(
                "O fim do período de entrega do fornecedor deve ser posterior ao início."
              );
            }
          },
        },
      },
      periodoRetiradaInicio: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      periodoRetiradaFim: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          validarPeriodoRetirada(value) {
            if (
              this.periodoRetiradaInicio &&
              value &&
              new Date(value) <= new Date(this.periodoRetiradaInicio)
            ) {
              throw new Error(
                "O fim do período de retirada deve ser posterior ao início."
              );
            }
          },
        },
      },
      periodoComprasInicio: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      periodoComprasFim: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          validarPeriodoCompras(value) {
            if (
              this.periodoComprasInicio &&
              value &&
              new Date(value) <= new Date(this.periodoComprasInicio)
            ) {
              throw new Error(
                "O fim do período de compras deve ser posterior ao início."
              );
            }
          },
        },
      },
      status: {
        type: DataTypes.ENUM("ativo", "inativo"),
        allowNull: false,
        defaultValue: "ativo",
        validate: {
          isIn: {
            args: [["ativo", "inativo"]],
            msg: "Status inválido. Use: ativo ou inativo.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "CicloMercados",
    }
  );

  return CicloMercados;
};
