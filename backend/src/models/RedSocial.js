const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/baseDatos");

class RedSocial extends Model {
  toJSON() {
    const datos = this.get({ plain: true });
    delete datos.creadoPorUsuarioId;
    return { _id: datos.id, ...datos };
  }
}

const textoObligatorio = (campo, mensaje, largo) => ({
  type: DataTypes.STRING(largo),
  allowNull: false,
  set(valor) {
    this.setDataValue(campo, typeof valor === "string" ? valor.trim() : valor);
  },
  validate: { notNull: { msg: mensaje }, notEmpty: { msg: mensaje } },
});

RedSocial.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    creadoPorUsuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    nombre: textoObligatorio("nombre", "El nombre de la red es obligatorio", 100),
    url: textoObligatorio("url", "La URL de la red es obligatoria", 500),
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "RedSocial",
    tableName: "redes_sociales",
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

module.exports = RedSocial;
