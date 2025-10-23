"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ComposicaoOfertaProdutos extends Model {
    static associate(models) {
      ComposicaoOfertaProdutos.belongsTo(models.Composicoes, {
        foreignKey: "composicaoId",
        as: "composicao",
      });
      ComposicaoOfertaProdutos.belongsTo(models.Produto, {
        foreignKey: "produtoId",
        as: "produto",
      });
    }
  }
  ComposicaoOfertaProdutos.init(
    {
      quantidade: DataTypes.INTEGER,
      valor: DataTypes.REAL,
      ofertaProdutoId: DataTypes.INTEGER, // Adicionado para rastrear a origem
    },
    {
      sequelize,
      modelName: "ComposicaoOfertaProdutos",
    },
  );
  return ComposicaoOfertaProdutos;
};
