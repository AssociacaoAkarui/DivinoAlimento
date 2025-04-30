'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComposicaoCestaProdutos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ComposicaoCestaProdutos.init({
    quantidade: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ComposicaoCestaProdutos',
  });
  return ComposicaoCestaProdutos;
};