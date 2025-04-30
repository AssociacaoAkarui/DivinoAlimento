'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Produtos', // name of Target model
      'descritivo', // name of the key we're adding
      {
        type: Sequelize.STRING,
      }
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn (
      'Produtos',  //name of the Target model
      'descritivo'  //key we want to remove
    )
  }
};
