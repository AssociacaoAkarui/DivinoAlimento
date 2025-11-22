'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PrecoMercados', {
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
      mercadoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Mercados',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      preco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
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

    await queryInterface.addIndex('PrecoMercados', ['produtoId', 'mercadoId'], {
      unique: true,
      name: 'unique_produto_mercado'
    });

    await queryInterface.addIndex('PrecoMercados', ['mercadoId']);
    await queryInterface.addIndex('PrecoMercados', ['produtoId']);
    await queryInterface.addIndex('PrecoMercados', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PrecoMercados');
  }
};
