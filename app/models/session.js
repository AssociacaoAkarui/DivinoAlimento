"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.Usuario, { foreignKey: "usuarioId" });
    }
  }

  Session.init(
    {
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Session",
    },
  );

  return Session;
};
