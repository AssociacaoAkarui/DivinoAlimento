'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Ciclos', 'nome', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Ciclos', 'ofertaInicio', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('Ciclos', 'ofertaFim', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    // A chave estrangeira pontoEntregaId também é essencial
    await queryInterface.changeColumn('Ciclos', 'pontoEntregaId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'PontoEntregas',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT', // Mudar para RESTRICT para evitar apagar um Ponto de Entrega em uso
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Ciclos', 'nome', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('Ciclos', 'ofertaInicio', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('Ciclos', 'ofertaFim', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('Ciclos', 'pontoEntregaId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Reverte para permitir nulos
      references: {
        model: 'PontoEntregas',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Reverte para o comportamento original
    });
  }
};
