"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("PontoEntregas", "mercadoId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Mercados",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("PontoEntregas", ["mercadoId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("PontoEntregas", ["mercadoId"]);
    await queryInterface.removeColumn("PontoEntregas", "mercadoId");
  },
};
