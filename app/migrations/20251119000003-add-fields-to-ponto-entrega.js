"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("PontoEntregas", "bairro", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("PontoEntregas", "cidade", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("PontoEntregas", "estado", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("PontoEntregas", "cep", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("PontoEntregas", "bairro");
    await queryInterface.removeColumn("PontoEntregas", "cidade");
    await queryInterface.removeColumn("PontoEntregas", "estado");
    await queryInterface.removeColumn("PontoEntregas", "cep");
  },
};
