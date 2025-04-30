'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ciclo hasOne PontoEntrega
    return queryInterface.addColumn(
      'Ciclos', // name of Target model
      'pontoEntregaId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'PontoEntregas', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
    .then(() => {
      // Ciclo hasMany DataEntregas
      return queryInterface.addColumn(
        'CicloEntregas', // name of Target model
        'cicloId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Ciclos', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
    .then(() => {
      // Ciclo hasMany TiposCestas
      return queryInterface.addColumn(
        'CicloCestas', // name of Target model
        'cicloId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Ciclos', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
    .then(() => {
      // CicloCestas hasMany TipoCestas
      return queryInterface.addColumn(
        'CicloCestas', // name of Target model
        'cestaId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Cesta', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    })
    .then(() => {
      // Ciclo hasMany Produto
      return queryInterface.addColumn(
        'CicloProdutos', // name of Target model
        'cicloId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Ciclos', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
    .then(() => {
      // CicloProdutos hasMany productId
      return queryInterface.addColumn(
        'CicloProdutos', // name of Target model
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
    // remove Payment hasOne Order
    return queryInterface.removeColumn (
      'Ciclos',  //name of the Target model
      'pontoEntregaId'  //key we want to remove
    )
    .then(() => {
      // remove Order hasMany Product
      return queryInterface.removeColumn(
        'CicloEntregas', // name of the Target model
        'cicloId' // key we want to remove
      )
    })
    .then(() => {
      // remove Order hasMany Product
      return queryInterface.removeColumn(
        'CicloCestas', // name of the Target model
        'cicloId' // key we want to remove
      )
    })
    .then(() => {
      // remove Order hasMany Product
      return queryInterface.removeColumn(
        'CicloCestas', // name of the Target model
        'cestaId' // key we want to remove
      )
    })
    .then(() => {
      // remove Order hasMany Product
      return queryInterface.removeColumn(
        'CicloProdutos', // name of the Target model
        'cicloId' // key we want to remove
      )
    })
    .then(() => {
      // remove Order hasMany Product
      return queryInterface.removeColumn(
        'CicloProdutos', // name of the Target model
        'produtoId' // key we want to remove
      )
    })
  }
}
