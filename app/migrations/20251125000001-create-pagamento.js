module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pagamentos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tipo: {
        type: Sequelize.ENUM("fornecedor", "consumidor"),
        allowNull: false,
      },
      valorTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "pendente",
          "pago",
          "cancelado",
          "a_receber",
          "a_pagar"
        ),
        allowNull: false,
        defaultValue: "pendente",
      },
      dataPagamento: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      observacao: {
        type: Sequelize.TEXT,
        allowNull: true,
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
        onDelete: "CASCADE",
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    await queryInterface.addIndex("Pagamentos", ["cicloId"]);
    await queryInterface.addIndex("Pagamentos", ["mercadoId"]);
    await queryInterface.addIndex("Pagamentos", ["usuarioId"]);
    await queryInterface.addIndex("Pagamentos", ["tipo"]);
    await queryInterface.addIndex("Pagamentos", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Pagamentos");
  },
};
