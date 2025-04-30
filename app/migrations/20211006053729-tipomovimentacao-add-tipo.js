'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'TipoMovimentacaos', // name of Target model
      'tipo', // name of the key we're adding
      {
        type: Sequelize.ARRAY(Sequelize.ENUM('credito', 'debito')),
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn (
      'TipoMovimentacaos',  //name of the Target model
      'tipo'  //key we want to remove
    )
  }
};
