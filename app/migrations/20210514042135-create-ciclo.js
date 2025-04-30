'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ciclos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING
      },
      ofertaInicio: {
        type: Sequelize.DATE
      },
      ofertaFim: {
        type: Sequelize.DATE
      },
      itensAdicionaisInicio: {
        type: Sequelize.DATE
      },
      itensAdicionaisFim: {
        type: Sequelize.DATE
      },
      retiradaConsumidorInicio: {
        type: Sequelize.DATE
      },
      retiradaConsumidorFim: {
        type: Sequelize.DATE
      },
      observacao: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ciclos');
  }
};