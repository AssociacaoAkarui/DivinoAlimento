'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Usuarios', // name of Target model
      'descritivo', // name of the key we're adding
      {
        type: Sequelize.STRING,
      }
    )
    .then(() => {
      return queryInterface.addColumn(
        'Usuarios', // name of Target model
        'nomeoficial', // name of the key we're adding
        {
          type: Sequelize.STRING,
        }
      )
      .then(() => {
        return queryInterface.addColumn(
          'Usuarios', // name of Target model
          'cientepolitica', // name of the key we're adding
          {
            type: Sequelize.STRING,
          }
        )
      })
    })
  },

  

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn (
      'Usuarios',  //name of the Target model
      'descritivo'  //key we want to remove
    )
    .then(() => {
      return queryInterface.removeColumn (
        'Usuarios',  //name of the Target model
        'nomeoficial'  //key we want to remove
      )
      .then(() => {
        return queryInterface.removeColumn (
          'Usuarios',  //name of the Target model
          'cientepolitica'  //key we want to remove
        )
      }) 
    })
  }
};
