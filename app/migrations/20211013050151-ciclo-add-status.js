'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
        'Ciclos', // name of Target model
        'status', // name of the key we're adding
        {
          type: Sequelize.STRING,
        }
      )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn (
      'Ciclos',  //name of the Target model
      'status'  //key we want to remove
    )
  }
};
