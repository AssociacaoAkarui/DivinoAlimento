'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'ComposicaoOfertaProdutos', // name of Target model
      'ofertaProdutoId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'OfertaProdutos', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn (
      'ComposicaoOfertaProdutos',  //name of the Target model
      'ofertaProdutoId'  //key we want to remove
    )
  }
};
