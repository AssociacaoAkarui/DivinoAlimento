"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PontoEntrega extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PontoEntrega.belongsTo(models.Mercado, {
        foreignKey: "mercadoId",
        as: "mercado",
      });
    }
  }
  PontoEntrega.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O nome do ponto de entrega é obrigatório",
          },
        },
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O endereço é obrigatório",
          },
        },
      },
      bairro: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O bairro é obrigatório",
          },
        },
      },
      cidade: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "A cidade é obrigatória",
          },
        },
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O estado é obrigatório",
          },
        },
      },
      cep: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O CEP é obrigatório",
          },
        },
      },
      pontoReferencia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ativo",
        validate: {
          isIn: {
            args: [["ativo", "inativo"]],
            msg: "Status deve ser 'ativo' ou 'inativo'",
          },
        },
      },
      mercadoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PontoEntrega",
    },
  );
  return PontoEntrega;
};
