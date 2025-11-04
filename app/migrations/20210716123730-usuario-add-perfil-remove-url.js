"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn(
        "Usuarios", // name of Target model
        "perfis", // name of the key we're adding
        {
          type: Sequelize.ARRAY(
            Sequelize.ENUM(
              "info",
              "master",
              "admin",
              "fornecedor",
              "consumidor",
            ),
          ),
        },
      )
      .then(() => {
        return queryInterface.removeColumn(
          "Usuarios", //name of the Target model
          "urlFoto", //key we want to remove
        );
      });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn(
        "Usuarios", //name of the Target model
        "perfis", //key we want to remove
      )
      .then(() => {
        return queryInterface.addColumn(
          "Usuarios", // name of Target model
          "urlFoto", // name of the key we're adding
          {
            type: Sequelize.STRING,
          },
        );
      });
  },
};
