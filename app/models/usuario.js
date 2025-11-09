"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Usuario.hasMany(models.Oferta, {
        foreignKey: "usuarioId",
        as: "Oferta",
        onDelete: "CASCADE",
      });

      Usuario.hasMany(models.PedidoConsumidores, {
        foreignKey: "usuarioId",
        as: "PedidoConsumidores",
        onDelete: "CASCADE",
      });
    }
  }
  Usuario.init(
    {
      nome: DataTypes.STRING,
      nomeoficial: DataTypes.STRING,
      celular: DataTypes.STRING,
      descritivo: DataTypes.STRING,
      email: DataTypes.STRING,
      cientepolitica: DataTypes.STRING,
      perfis:
        sequelize.options.dialect === "sqlite"
          ? {
              type: DataTypes.TEXT,
              get() {
                const rawValue = this.getDataValue("perfis");
                if (!rawValue) return [];
                try {
                  return JSON.parse(rawValue);
                } catch (e) {
                  return [];
                }
              },
              set(value) {
                this.setDataValue("perfis", JSON.stringify(value));
              },
            }
          : DataTypes.ARRAY(
              DataTypes.ENUM(
                "admin",
                "adminmercado",
                "fornecedor",
                "consumidor",
              ),
            ),
      status: DataTypes.ENUM("ativo", "inativo", "pendente"),
      senha: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Usuario",
    },
  );
  return Usuario;
};
