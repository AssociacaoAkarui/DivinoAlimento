'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ComposicaoOfertaProdutos', 'ofertaProdutoId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'OfertaProdutos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ComposicaoOfertaProdutos', 'ofertaProdutoId');
  }
};
