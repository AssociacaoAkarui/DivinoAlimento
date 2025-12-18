const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pagamento extends Model {
    static associate(models) {
      Pagamento.belongsTo(models.Ciclo, {
        foreignKey: "cicloId",
        as: "ciclo",
      });
      Pagamento.belongsTo(models.Mercado, {
        foreignKey: "mercadoId",
        as: "mercado",
      });
      Pagamento.belongsTo(models.Usuario, {
        foreignKey: "usuarioId",
        as: "usuario",
      });
    }
  }

  Pagamento.init(
    {
      tipo: {
        type: DataTypes.ENUM("fornecedor", "consumidor"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["fornecedor", "consumidor"]],
            msg: "Tipo inválido. Use: fornecedor ou consumidor.",
          },
        },
      },
      valorTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "Valor total não pode ser negativo.",
          },
        },
      },
      status: {
        type: DataTypes.ENUM(
          "pendente",
          "pago",
          "cancelado",
          "a_receber",
          "a_pagar"
        ),
        allowNull: false,
        defaultValue: "pendente",
        validate: {
          isIn: {
            args: [
              ["pendente", "pago", "cancelado", "a_receber", "a_pagar"],
            ],
            msg: "Status inválido.",
          },
        },
      },
      dataPagamento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      observacao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cicloId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Ciclos",
          key: "id",
        },
      },
      mercadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Mercados",
          key: "id",
        },
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Pagamento",
    }
  );

  return Pagamento;
};
