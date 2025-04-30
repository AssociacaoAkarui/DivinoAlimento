'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PedidoConsumidoresProdutos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      PedidoConsumidoresProdutos.belongsTo(models.Produto, { 
        foreignKey: 'produtoId', 
        as: 'produto' 
      });

    }
  };
  PedidoConsumidoresProdutos.init({
    quantidade: DataTypes.INTEGER,
    valorOferta: DataTypes.REAL,
    valorCompra: DataTypes.REAL
  }, {
    sequelize,
    modelName: 'PedidoConsumidoresProdutos',
  });
  return PedidoConsumidoresProdutos;
};