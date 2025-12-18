'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "ComposicaoOfertaProdutos"
      DROP CONSTRAINT IF EXISTS "ComposicaoOfertaProdutos_ofertaProdutoId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "ComposicaoOfertaProdutos"
      ADD CONSTRAINT "ComposicaoOfertaProdutos_ofertaProdutoId_fkey"
      FOREIGN KEY ("ofertaProdutoId")
      REFERENCES "OfertaProdutos"("id")
      ON UPDATE CASCADE
      ON DELETE CASCADE;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "ComposicaoOfertaProdutos"
      DROP CONSTRAINT IF EXISTS "ComposicaoOfertaProdutos_ofertaProdutoId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "ComposicaoOfertaProdutos"
      ADD CONSTRAINT "ComposicaoOfertaProdutos_ofertaProdutoId_fkey"
      FOREIGN KEY ("ofertaProdutoId")
      REFERENCES "OfertaProdutos"("id")
      ON UPDATE CASCADE
      ON DELETE SET NULL;
    `);
  }
};
