'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProdutoComercializavel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      ProdutoComercializavel.belongsTo(models.Produto, {
        foreignKey: 'produtoId',
        as: 'produto'
      });
    }
  }

  ProdutoComercializavel.init({
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Produtos',
        key: 'id'
      }
    },
    medida: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pesoKg: {
      type: DataTypes.REAL,
      allowNull: false
    },
    precoBase: {
      type: DataTypes.REAL,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ativo'
    }
  }, {
    sequelize,
    modelName: 'ProdutoComercializavel',
  });

  return ProdutoComercializavel;
};
