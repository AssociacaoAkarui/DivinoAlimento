'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SubmissaoProduto extends Model {
    static associate(models) {
      SubmissaoProduto.belongsTo(models.Usuario, {
        foreignKey: 'fornecedorId',
        as: 'fornecedor'
      });
    }
  }

  SubmissaoProduto.init({
    fornecedorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nomeProduto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagemUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    precoUnidade: {
      type: DataTypes.REAL,
      allowNull: false
    },
    medida: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendente'
    },
    motivoReprovacao: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'SubmissaoProduto',
  });

  return SubmissaoProduto;
};
