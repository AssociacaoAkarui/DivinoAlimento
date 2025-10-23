"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OfertaProdutos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      OfertaProdutos.belongsTo(models.Produto, {
        foreignKey: "produtoId",
        as: "produto",
      });

      OfertaProdutos.hasMany(models.ComposicaoOfertaProdutos, {
        foreignKey: "ofertaProdutoId",
        as: "composicaoOfertaProdutos",
        onDelete: "CASCADE",
      });

      OfertaProdutos.hasOne(models.PedidosFornecedores, {
        foreignKey: "ofertaProdutoId",
        as: "ofertaProdutos",
        onDelete: "CASCADE",
      });

      OfertaProdutos.hasMany(models.ComposicaoOfertaProdutos, {
        foreignKey: "ofertaProdutoId",
        as: "ofertaProduto",
        onDelete: "CASCADE",
      });

      /*OfertaProdutos.hasMany(models.Oferta, {
        foreignKey: 'id',
        as: 'ofertaProdutosOferta'
      });*/
    }
  }
  OfertaProdutos.init(
    {
      quantidade: DataTypes.INTEGER,
      valorReferencia: DataTypes.REAL,
      valorOferta: DataTypes.REAL,
    },
    {
      sequelize,
      modelName: "OfertaProdutos",
    },
  );
  return OfertaProdutos;
};
