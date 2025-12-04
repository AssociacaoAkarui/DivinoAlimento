/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar campo pontoReferencia
    await queryInterface.addColumn("PontoEntregas", "pontoReferencia", {
      type: Sequelize.STRING,
      allowNull: true, // Inicialmente permitir null para dados existentes
    });

    // Atualizar campos existentes vazios com valores padrão antes de torná-los obrigatórios
    await queryInterface.sequelize.query(`
      UPDATE "PontoEntregas"
      SET
        "nome" = COALESCE(NULLIF("nome", ''), 'Ponto de Entrega'),
        "endereco" = COALESCE(NULLIF("endereco", ''), 'A definir'),
        "bairro" = COALESCE(NULLIF("bairro", ''), 'A definir'),
        "cidade" = COALESCE(NULLIF("cidade", ''), 'A definir'),
        "estado" = COALESCE(NULLIF("estado", ''), 'A definir'),
        "cep" = COALESCE(NULLIF("cep", ''), '00000-000'),
        "status" = COALESCE(NULLIF("status", ''), 'ativo')
      WHERE
        "nome" IS NULL OR "nome" = '' OR
        "endereco" IS NULL OR "endereco" = '' OR
        "bairro" IS NULL OR "bairro" = '' OR
        "cidade" IS NULL OR "cidade" = '' OR
        "estado" IS NULL OR "estado" = '' OR
        "cep" IS NULL OR "cep" = '' OR
        "status" IS NULL OR "status" = ''
    `);

    // Tornar campos obrigatórios
    await queryInterface.changeColumn("PontoEntregas", "nome", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("PontoEntregas", "endereco", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("PontoEntregas", "bairro", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("PontoEntregas", "cidade", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("PontoEntregas", "estado", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("PontoEntregas", "cep", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("PontoEntregas", "status", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // pontoReferencia permanece opcional (allowNull: true)
  },

  async down(queryInterface, Sequelize) {
    // Reverter campos para permitir null
    await queryInterface.changeColumn("PontoEntregas", "nome", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("PontoEntregas", "endereco", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("PontoEntregas", "bairro", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("PontoEntregas", "cidade", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("PontoEntregas", "estado", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("PontoEntregas", "cep", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("PontoEntregas", "status", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Remover campo pontoReferencia
    await queryInterface.removeColumn("PontoEntregas", "pontoReferencia");
  },
};
