'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComposicaoOfertaProdutos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ComposicaoOfertaProdutos.belongsTo(models.Produto, { 
        foreignKey: 'produtoId', 
        as: 'produto' 
      });

      ComposicaoOfertaProdutos.belongsTo(models.Composicoes, { 
        foreignKey: 'composicaoId', 
        as: 'composicaoOfertaProdutos' 
      });

      ComposicaoOfertaProdutos.belongsTo(models.OfertaProdutos, {
        foreignKey: 'ofertaProdutoId',
        as: 'ofertaProduto'
      });

    }
  };
  ComposicaoOfertaProdutos.init({
    quantidade: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ComposicaoOfertaProdutos',
  });
  return ComposicaoOfertaProdutos;
};