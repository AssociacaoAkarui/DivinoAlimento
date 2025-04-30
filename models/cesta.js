'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cesta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Cesta.hasMany(models.CicloCestas, {
        foreignKey: 'cestaId',
        as: 'CicloCestas',
        onDelete: 'CASCADE'
      });

    }
  };
  Cesta.init({
    nome: DataTypes.STRING,
    valormaximo: DataTypes.REAL,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cesta',
  });
  return Cesta;
};