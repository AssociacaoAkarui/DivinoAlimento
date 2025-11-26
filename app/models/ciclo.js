"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ciclo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Ciclo.belongsTo(models.PontoEntrega, {
        foreignKey: "pontoEntregaId",
        as: "pontoEntrega",
      });

      Ciclo.hasMany(models.CicloEntregas, {
        foreignKey: "cicloId",
        as: "cicloEntregas",
        onDelete: "CASCADE",
      });

      Ciclo.hasMany(models.CicloCestas, {
        foreignKey: "cicloId",
        as: "CicloCestas",
        onDelete: "CASCADE",
      });

      Ciclo.hasMany(models.CicloProdutos, {
        foreignKey: "cicloId",
        as: "cicloProdutos",
        onDelete: "CASCADE",
      });

      Ciclo.hasMany(models.Oferta, {
        foreignKey: "cicloId",
        as: "Oferta",
        onDelete: "CASCADE",
      });

      Ciclo.hasMany(models.PedidoConsumidores, {
        foreignKey: "cicloId",
        as: "PedidoConsumidores",
        onDelete: "CASCADE",
      });
      Ciclo.hasMany(models.CicloMercados, {
        foreignKey: "cicloId",
        as: "cicloMercados",
        onDelete: "CASCADE",
      });
    }
  }
  Ciclo.init(
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O nome do ciclo não pode ser vazio.",
          },
          notNull: {
            msg: "O nome do ciclo é obrigatório.",
          },
        },
      },
      ofertaInicio: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "A data de início da oferta não pode ser vazia.",
          },
          notNull: {
            msg: "A data de início da oferta é obrigatória.",
          },
        },
      },
      ofertaFim: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "A data de fim da oferta não pode ser vazia.",
          },
          notNull: {
            msg: "A data de fim da oferta é obrigatória.",
          },
        },
      },
      pontoEntregaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O ponto de entrega não pode ser vazio.",
          },
          notNull: {
            msg: "O ponto de entrega é obrigatório.",
          },
        },
      },
      itensAdicionaisInicio: DataTypes.DATE,
      itensAdicionaisFim: DataTypes.DATE,
      retiradaConsumidorInicio: DataTypes.DATE,
      retiradaConsumidorFim: DataTypes.DATE,
      observacao: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "oferta",
        validate: {
          isIn: {
            args: [["oferta", "composicao", "atribuicao", "finalizado"]],
            msg: "O status do ciclo deve ser 'oferta', 'composicao', 'atribuicao' ou 'finalizado'.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Ciclo",
    },
  );
  return Ciclo;
};
