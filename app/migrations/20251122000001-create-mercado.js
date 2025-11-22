"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Mercados", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM("cesta", "lote", "venda_direta"),
        allowNull: false,
      },
      responsavelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      taxaAdministrativa: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      valorMaximoCesta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ativo", "inativo"),
        allowNull: false,
        defaultValue: "ativo",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("Mercados", ["responsavelId"]);
    await queryInterface.addIndex("Mercados", ["status"]);
    await queryInterface.addIndex("Mercados", ["tipo"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Mercados");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Mercados_tipo";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Mercados_status";'
    );
  },
};
