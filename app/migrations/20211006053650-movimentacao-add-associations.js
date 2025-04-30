'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Movimentacaos', // name of Target model
      'tipoMovimentacaoId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'TipoMovimentacaos', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
    .then(() => {
      // Oferta hasManny Usuario
      return queryInterface.addColumn(
        'Movimentacaos', // name of Target model
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
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn (
      'Movimentacaos',  //name of the Target model
      'tipoMovimentacaoId'  //key we want to remove
    )
    .then(() => {
      return queryInterface.removeColumn(
        'Movimentacaos', // name of the Target model
        'usuarioId' // key we want to remove
      )
    })
  }
};
