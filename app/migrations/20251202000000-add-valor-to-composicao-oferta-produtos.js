module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'ComposicaoOfertaProdutos',
      'valor',
      {
        type: Sequelize.REAL,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'ComposicaoOfertaProdutos',
      'valor'
    );
  }
};
