const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/baseDatos");

class Categoria extends Model {
  toJSON() {
    const datos = this.get({ plain: true });
    delete datos.creadoPorUsuarioId;
    return { _id: datos.id, ...datos };
  }
}

Categoria.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    creadoPorUsuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      set(valor) {
        this.setDataValue("nombre", typeof valor === "string" ? valor.trim() : valor);
      },
      validate: {
        notNull: { msg: "El nombre de la categoría es obligatorio." },
        notEmpty: { msg: "El nombre de la categoría es obligatorio." },
        len: { args: [1, 100], msg: "El nombre no puede superar los 100 caracteres." },
      },
    },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: "El orden no puede ser negativo." } },
    },
  },
  {
    sequelize,
    modelName: "Categoria",
    tableName: "categorias",
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

module.exports = Categoria;
