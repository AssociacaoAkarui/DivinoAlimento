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
      nome: DataTypes.STRING,
      endereco: DataTypes.STRING,
      bairro: DataTypes.STRING,
      cidade: DataTypes.STRING,
      estado: DataTypes.STRING,
      cep: DataTypes.STRING,
      status: DataTypes.STRING,
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
