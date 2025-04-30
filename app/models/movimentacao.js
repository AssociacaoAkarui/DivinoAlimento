'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movimentacao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Movimentacao.belongsTo(models.Usuario, { 
        foreignKey: 'usuarioId', 
        as: 'usuario' 
      });

    }
  };
  Movimentacao.init({
    data: DataTypes.DATE,
    valor: DataTypes.REAL,
    linkArquivo: DataTypes.STRING,
    status: DataTypes.STRING,
    observacao: DataTypes.STRING,
    tipoMovimentacaoId: DataTypes.INTEGER,
    usuarioId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Movimentacao',
  });
  return Movimentacao;
};