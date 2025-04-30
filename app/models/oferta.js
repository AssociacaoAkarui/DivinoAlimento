'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Oferta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      /*Oferta.hasOne(models.Ciclo, { 
        foreignKey: 'cicloId', 
        as: 'ciclo' 
      });

      Oferta.hasOne(models.Usuario, { 
        foreignKey: 'usuarioId', 
        as: 'usuario' 
      });*/

      Oferta.hasMany(models.OfertaProdutos, {
        foreignKey: 'ofertaId',
        as: 'ofertaProdutos',
        onDelete: 'CASCADE'
      });

    }
  };
  Oferta.init({
    status: DataTypes.STRING,
    observacao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Oferta',
  });
  return Oferta;
};