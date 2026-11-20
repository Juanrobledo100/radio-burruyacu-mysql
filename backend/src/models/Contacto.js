const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/baseDatos");

const textoObligatorio = (campo, largo, mensaje) => ({
  type: DataTypes.STRING(largo),
  allowNull: false,
  set(valor) {
    this.setDataValue(campo, typeof valor === "string" ? valor.trim() : valor);
  },
  validate: {
    notNull: { msg: mensaje },
    notEmpty: { msg: mensaje },
    len: { args: [1, largo], msg: mensaje },
  },
});

class Contacto extends Model {
  toJSON() {
    const datos = this.get({ plain: true });
    return { _id: datos.id, ...datos };
  }
}

Contacto.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    nombre: textoObligatorio("nombre", 100, "El nombre es obligatorio."),
    email: {
      ...textoObligatorio("email", 255, "El correo electrónico es obligatorio."),
      validate: {
        notNull: { msg: "El correo electrónico es obligatorio." },
        notEmpty: { msg: "El correo electrónico es obligatorio." },
        len: { args: [1, 255], msg: "El correo electrónico es demasiado largo." },
        isEmail: { msg: "Ingresá un correo electrónico válido." },
      },
      set(valor) {
        this.setDataValue("email", typeof valor === "string" ? valor.trim().toLowerCase() : valor);
      },
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
      set(valor) {
        this.setDataValue("telefono", typeof valor === "string" ? valor.trim() || null : valor);
      },
      validate: { len: { args: [0, 30], msg: "El teléfono es demasiado largo." } },
    },
    asunto: textoObligatorio("asunto", 150, "El asunto es obligatorio."),
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(valor) {
        this.setDataValue("mensaje", typeof valor === "string" ? valor.trim() : valor);
      },
      validate: {
        notNull: { msg: "El mensaje es obligatorio." },
        notEmpty: { msg: "El mensaje es obligatorio." },
        len: { args: [5, 5000], msg: "El mensaje debe tener entre 5 y 5000 caracteres." },
      },
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "realizado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    sequelize,
    modelName: "Contacto",
    tableName: "contactos",
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

module.exports = Contacto;
