'use strict';
const {
  Model
} = require('sequelize');
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
        foreignKey: 'pontoEntregaId', 
        as: 'pontoEntrega' 
      });

      Ciclo.hasMany(models.CicloEntregas, {
        foreignKey: 'cicloId',
        as: 'cicloEntregas',
        onDelete: 'CASCADE'
      });

      Ciclo.hasMany(models.CicloCestas, {
        foreignKey: 'cicloId',
        as: 'CicloCestas',
        onDelete: 'CASCADE'
      });

      Ciclo.hasMany(models.CicloProdutos, {
        foreignKey: 'cicloId',
        as: 'cicloProdutos',
        onDelete: 'CASCADE'
      });

      Ciclo.hasMany(models.Oferta, {
        foreignKey: 'cicloId',
        as: 'Oferta',
        onDelete: 'CASCADE'
      });

      Ciclo.hasMany(models.PedidoConsumidores, {
        foreignKey: 'cicloId',
        as: 'PedidoConsumidores',
        onDelete: 'CASCADE'
      });

    }
  };
  Ciclo.init({
    nome: DataTypes.STRING,
    ofertaInicio: DataTypes.DATE,
    ofertaFim: DataTypes.DATE,
    itensAdicionaisInicio: DataTypes.DATE,
    itensAdicionaisFim: DataTypes.DATE,
    retiradaConsumidorInicio: DataTypes.DATE,
    retiradaConsumidorFim: DataTypes.DATE,
    observacao: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ciclo',
  });
  return Ciclo;
};