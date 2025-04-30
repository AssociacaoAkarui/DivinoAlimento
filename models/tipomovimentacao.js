'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoMovimentacao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TipoMovimentacao.init({
    nome: DataTypes.STRING,
    status: DataTypes.STRING,
    observacao: DataTypes.STRING,
    tipo: DataTypes.ARRAY(DataTypes.ENUM('credito', 'debito')),
  }, {
    sequelize,
    modelName: 'TipoMovimentacao',
  });
  return TipoMovimentacao;
};