'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Produtos', // name of Target model
      'categoriaId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'CategoriaProdutos', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn (
      'Produtos',  //name of the Target model
      'categoriaId'  //key we want to remove
    )
  }
};
