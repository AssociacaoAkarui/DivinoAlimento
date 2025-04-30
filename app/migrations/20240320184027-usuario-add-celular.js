'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Usuarios', // name of Target model
      'celular', // name of the key we're adding
      {
        type: Sequelize.STRING,
      }
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn (
      'Usuarios',  //name of the Target model
      'celular'  //key we want to remove
    )
  }
};
