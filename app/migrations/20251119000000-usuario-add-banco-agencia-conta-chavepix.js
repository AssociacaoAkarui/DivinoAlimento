"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Usuarios", "banco", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Usuarios", "agencia", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Usuarios", "conta", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Usuarios", "chavePix", {
      type: Sequelize.STRING,
    });

    const [usuarios] = await queryInterface.sequelize.query(
      'SELECT id, descritivo FROM "Usuarios" WHERE descritivo IS NOT NULL'
    );

    for (const usuario of usuarios) {
      try {
        const descritivo = JSON.parse(usuario.descritivo);
        await queryInterface.sequelize.query(
          `UPDATE "Usuarios" SET
            banco = :banco,
            agencia = :agencia,
            conta = :conta,
            "chavePix" = :chavePix
          WHERE id = :id`,
          {
            replacements: {
              id: usuario.id,
              banco: descritivo.banco || null,
              agencia: descritivo.agencia || null,
              conta: descritivo.conta || null,
              chavePix: descritivo.pix || null,
            },
          }
        );
      } catch (e) {
        console.log(`Error parsing descritivo for user ${usuario.id}:`, e.message);
      }
    }

    await queryInterface.removeColumn("Usuarios", "descritivo");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Usuarios", "descritivo", {
      type: Sequelize.STRING,
    });

    const [usuarios] = await queryInterface.sequelize.query(
      'SELECT id, banco, agencia, conta, "chavePix" FROM "Usuarios"'
    );

    for (const usuario of usuarios) {
      const descritivo = JSON.stringify({
        banco: usuario.banco || "",
        agencia: usuario.agencia || "",
        conta: usuario.conta || "",
        pix: usuario.chavePix || "",
      });
      await queryInterface.sequelize.query(
        'UPDATE "Usuarios" SET descritivo = :descritivo WHERE id = :id',
        {
          replacements: {
            id: usuario.id,
            descritivo,
          },
        }
      );
    }

    await queryInterface.removeColumn("Usuarios", "banco");
    await queryInterface.removeColumn("Usuarios", "agencia");
    await queryInterface.removeColumn("Usuarios", "conta");
    await queryInterface.removeColumn("Usuarios", "chavePix");
  },
};
