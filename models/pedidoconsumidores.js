'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PedidoConsumidores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PedidoConsumidores.hasMany(models.PedidoConsumidoresProdutos, {
        foreignKey: 'pedidoConsumidorId',
        as: 'pedidoConsumidoresProdutos',
        onDelete: 'CASCADE'
      });
    }
  };
  PedidoConsumidores.init({
    status: DataTypes.STRING,
    observacao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PedidoConsumidores',
  });
  return PedidoConsumidores;
};