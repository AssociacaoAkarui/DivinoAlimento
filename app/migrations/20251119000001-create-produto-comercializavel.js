'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProdutoComercializavels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      produtoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Produtos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      medida: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pesoKg: {
        type: Sequelize.REAL,
        allowNull: false
      },
      precoBase: {
        type: Sequelize.REAL,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'ativo'
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

    // Índice para búsquedas por producto
    await queryInterface.addIndex('ProdutoComercializavels', ['produtoId']);

    // Índice para filtrar por status
    await queryInterface.addIndex('ProdutoComercializavels', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProdutoComercializavels');
  }
};
