'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Oferta hasOne Ciclo
    return queryInterface.addColumn(
      'Oferta', // name of Target model
      'cicloId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ciclos', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
    .then(() => {
      // Oferta hasOne Usuario
      return queryInterface.addColumn(
        'Oferta', // name of Target model
        'usuarioId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Usuarios', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    })
    .then(() => {
      // Oferta hasMany OfertaProdutos
      return queryInterface.addColumn(
        'OfertaProdutos', // name of Target model
        'ofertaId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Oferta', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
    .then(() => {
      // Oferta hasOne Usuario
      return queryInterface.addColumn(
        'OfertaProdutos', // name of Target model
        'produtoId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Produtos', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn (
      'Oferta',  //name of the Target model
      'cicloId'  //key we want to remove
    )
    .then(() => {
      return queryInterface.removeColumn(
        'Oferta', // name of the Target model
        'usuarioId' // key we want to remove
      )
    })
    .then(() => {
      return queryInterface.removeColumn(
        'OfertaProdutos', // name of the Target model
        'ofertaId' // key we want to remove
      )
    })
    .then(() => {
      return queryInterface.removeColumn(
        'OfertaProdutos', // name of the Target model
        'produtoId' // key we want to remove
      )
    })
  }
};
