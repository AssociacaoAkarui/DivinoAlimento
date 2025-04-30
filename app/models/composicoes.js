'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Composicoes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Composicoes.belongsTo(models.CicloCestas, { 
        foreignKey: 'cicloCestaId', 
        as: 'cicloCesta' 
      });

      Composicoes.hasMany(models.ComposicaoOfertaProdutos, {
        foreignKey: 'composicaoId',
        as: 'composicaoOfertaProdutos',
        onDelete: 'CASCADE'
      });

    }
  };
  Composicoes.init({
    status: DataTypes.STRING,
    observacao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Composicoes',
  });
  return Composicoes;
};