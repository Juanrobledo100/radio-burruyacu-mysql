const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/baseDatos");

class Usuario extends Model {
  async compararPassword(passwordCandidato) {
    return bcrypt.compare(passwordCandidato, this.password);
  }

  toJSON() {
    const { password, tokenRestablecimiento, tokenRestablecimientoExpira, ...datos } =
      this.get({ plain: true });
    return { _id: datos.id, ...datos };
  }
}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      set(valor) {
        this.setDataValue("nombre", typeof valor === "string" ? valor.trim() : valor);
      },
      validate: {
        notNull: { msg: "El nombre de usuario es obligatorio" },
        notEmpty: { msg: "El nombre de usuario es obligatorio" },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      set(valor) {
        if (typeof valor !== "string") return this.setDataValue("email", valor ?? null);
        this.setDataValue("email", valor.trim().toLowerCase() || null);
      },
      validate: { is: { args: [/^\S+@\S+\.\S+$/], msg: "El email no es válido" } },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: { msg: "La contrasena es obligatoria" },
        len: { args: [6, 255], msg: "La contrasena debe tener al menos 6 caracteres" },
      },
    },
    tokenRestablecimiento: { type: DataTypes.STRING(255), allowNull: true },
    tokenRestablecimientoExpira: { type: DataTypes.DATE, allowNull: true },
    rol: {
      type: DataTypes.ENUM("admin", "usuario"),
      allowNull: false,
      defaultValue: "usuario",
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
    defaultScope: {
      attributes: { exclude: ["password", "tokenRestablecimiento", "tokenRestablecimientoExpira"] },
    },
    hooks: {
      beforeSave: async (usuario) => {
        if (usuario.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  }
);

module.exports = Usuario;
