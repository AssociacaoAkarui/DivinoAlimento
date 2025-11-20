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
      // define association here
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
    },
    {
      sequelize,
      modelName: "PontoEntrega",
    },
  );
  return PontoEntrega;
};
