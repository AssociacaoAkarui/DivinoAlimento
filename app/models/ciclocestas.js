"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CicloCestas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      CicloCestas.belongsTo(models.Ciclo, {
        foreignKey: "cicloId",
        as: "ciclo",
      });

      CicloCestas.belongsTo(models.Cesta, {
        foreignKey: "cestaId",
        as: "cesta",
      });

      CicloCestas.hasMany(models.Composicoes, {
        foreignKey: "cicloCestaId",
        as: "composicoes",
      });
    }
  }
  CicloCestas.init(
    {
      quantidadeCestas: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CicloCestas",
    },
  );
  return CicloCestas;
};
