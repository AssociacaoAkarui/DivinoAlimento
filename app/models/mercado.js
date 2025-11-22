const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Mercado extends Model {
    static associate(models) {
      Mercado.belongsTo(models.Usuario, {
        foreignKey: "responsavelId",
        as: "responsavel",
      });

      Mercado.hasMany(models.PontoEntrega, {
        foreignKey: "mercadoId",
        as: "pontosEntrega",
      });
    }
  }

  Mercado.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O nome do mercado não pode ser vazio.",
          },
        },
      },
      tipo: {
        type: DataTypes.ENUM("cesta", "lote", "venda_direta"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["cesta", "lote", "venda_direta"]],
            msg: "Tipo inválido. Use: cesta, lote ou venda_direta.",
          },
        },
      },
      responsavelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      taxaAdministrativa: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
          min: 0,
          max: 100,
        },
      },
      valorMaximoCesta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ativo", "inativo"),
        allowNull: false,
        defaultValue: "ativo",
      },
    },
    {
      sequelize,
      modelName: "Mercado",
    }
  );

  return Mercado;
};
