'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PrecoMercado extends Model {
    static associate(models) {
      PrecoMercado.belongsTo(models.Produto, {
        foreignKey: 'produtoId',
        as: 'produto'
      });

      PrecoMercado.belongsTo(models.Mercado, {
        foreignKey: 'mercadoId',
        as: 'mercado'
      });
    }
  }

  PrecoMercado.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      produtoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      mercadoId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo'
      }
    },
    {
      sequelize,
      modelName: 'PrecoMercado',
      tableName: 'PrecoMercados',
      timestamps: true
    }
  );

  return PrecoMercado;
};
