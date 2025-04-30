'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Composicao hasOne cicloCestasId
    return queryInterface.addColumn(
      'Composicoes', // name of Target model
      'cicloCestaId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'CicloCestas', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
    .then(() => {
      // Composicoes hasMany ComposicaoOfertaProdutos
      return queryInterface.addColumn(
        'ComposicaoOfertaProdutos', // name of Target model
        'composicaoId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Composicoes', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
    .then(() => {
      // ComposicaoOfertaProdutos hasOne produtoId
      return queryInterface.addColumn(
        'ComposicaoOfertaProdutos', // name of Target model
        'produtoId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Produtos', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    })
    .then(() => {
      // Composicoes hasMany ComposicaoCestaOpcoes
      return queryInterface.addColumn(
        'ComposicaoCestaOpcoes', // name of Target model
        'composicaoId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Composicoes', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
    .then(() => {
      // ComposicaoCestaOpcoes hasMany ComposicaoCestaProdutos
      return queryInterface.addColumn(
        'ComposicaoCestaProdutos', // name of Target model
        'compCestaOpcaoId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'ComposicaoCestaOpcoes', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
    .then(() => {
      // ComposicaoCestaProdutos hasMany produtoId
      return queryInterface.addColumn(
        'ComposicaoCestaProdutos', // name of Target model
        'compOfertaProdutoId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'ComposicaoOfertaProdutos', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn (
      'Composicoes',  //name of the Target model
      'cicloCestaId'  //key we want to remove
    )
    .then(() => {
      return queryInterface.removeColumn(
        'ComposicaoOfertaProdutos', // name of the Target model
        'composicaoId' // key we want to remove
      )
    })
    .then(() => {
      return queryInterface.removeColumn(
        'ComposicaoOfertaProdutos', // name of the Target model
        'produtoId' // key we want to remove
      )
    })
    .then(() => {
      return queryInterface.removeColumn(
        'ComposicaoCestaOpcoes', // name of the Target model
        'composicaoId' // key we want to remove
      )
    })
    .then(() => {
      return queryInterface.removeColumn(
        'ComposicaoCestaProdutos', // name of the Target model
        'compCestaOpcaoId' // key we want to remove
      )
    })
    .then(() => {
      return queryInterface.removeColumn(
        'ComposicaoCestaProdutos', // name of the Target model
        'compOfertaProdutoId' // key we want to remove
      )
    })
  }
};
