'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Produto.belongsTo(models.CategoriaProdutos, { 
        foreignKey: 'categoriaId', 
        as: 'categoria' 
      });

    }
  };
  Produto.init({
    nome: DataTypes.STRING,
    medida: DataTypes.STRING,
    pesoGrama: DataTypes.REAL,
    valorReferencia: DataTypes.REAL,
    status: DataTypes.STRING,
    descritivo: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Produto',
  });
  return Produto;
};