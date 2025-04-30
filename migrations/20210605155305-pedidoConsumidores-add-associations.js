'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'PedidoConsumidores', // name of Target model
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
      // Oferta hasManny Usuario
      return queryInterface.addColumn(
        'PedidoConsumidores', // name of Target model
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
      // Oferta hasManny Usuario
      return queryInterface.addColumn(
        'PedidoConsumidoresProdutos', // name of Target model
        'pedidoConsumidorId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'PedidoConsumidores', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
    .then(() => {
      // Oferta hasManny Usuario
      return queryInterface.addColumn(
        'PedidoConsumidoresProdutos', // name of Target model
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
      'PedidoConsumidores',  //name of the Target model
      'cicloId'  //key we want to remove
    )
    .then(() => {
      return queryInterface.removeColumn(
        'PedidoConsumidores', // name of the Target model
        'usuarioId' // key we want to remove
      )
    })
    .then(() => {
      return queryInterface.removeColumn(
        'PedidoConsumidoresProdutos', // name of the Target model
        'pedidoConsumidorId' // key we want to remove
      )
    })
    .then(() => {
      return queryInterface.removeColumn(
        'PedidoConsumidoresProdutos', // name of the Target model
        'produtoId' // key we want to remove
      )
    })
  }
};
