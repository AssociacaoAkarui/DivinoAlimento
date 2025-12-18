/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CicloMercados", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cicloId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Ciclos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      mercadoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Mercados",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      tipoVenda: {
        type: Sequelize.ENUM("cesta", "lote", "venda_direta"),
        allowNull: false,
      },
      ordemAtendimento: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      // Campos específicos para tipo CESTA
      quantidadeCestas: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      valorAlvoCesta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      // Campos específicos para tipo LOTE
      valorAlvoLote: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      // Campos comuns
      pontoEntregaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "PontoEntregas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      periodoEntregaFornecedorInicio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      periodoEntregaFornecedorFim: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      periodoRetiradaInicio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      periodoRetiradaFim: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      // Campos específicos para VENDA_DIRETA
      periodoComprasInicio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      periodoComprasFim: {
        type: Sequelize.DATE,
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

    // Índices para performance
    await queryInterface.addIndex("CicloMercados", ["cicloId"]);
    await queryInterface.addIndex("CicloMercados", ["mercadoId"]);
    await queryInterface.addIndex("CicloMercados", ["pontoEntregaId"]);
    await queryInterface.addIndex("CicloMercados", [
      "cicloId",
      "ordemAtendimento",
    ]);

    // Constraint para garantir unicidade de mercado por ciclo
    await queryInterface.addConstraint("CicloMercados", {
      fields: ["cicloId", "mercadoId"],
      type: "unique",
      name: "unique_ciclo_mercado",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CicloMercados");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_CicloMercados_tipoVenda";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_CicloMercados_status";'
    );
  },
};
