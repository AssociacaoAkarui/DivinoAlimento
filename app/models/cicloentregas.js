"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CicloEntregas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CicloEntregas.init(
    {
      entregaFornecedorInicio: DataTypes.DATE,
      entregaFornecedorFim: DataTypes.DATE,
      cicloId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CicloEntregas",
    },
  );
  return CicloEntregas;
};
