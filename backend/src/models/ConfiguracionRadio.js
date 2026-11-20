const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/baseDatos");

const REDES = ["facebook", "instagram", "youtube", "whatsapp"];

class ConfiguracionRadio extends Model {
  toJSON() {
    const datos = this.get({ plain: true });
    const redesSociales = {};
    REDES.forEach((red) => {
      redesSociales[red] = datos[red];
      delete datos[red];
    });
    return { _id: datos.id, ...datos, redesSociales };
  }
}

const textoOpcional = () => ({ type: DataTypes.STRING(500), allowNull: false, defaultValue: "" });

ConfiguracionRadio.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "Radio Burruyacu",
      set(valor) {
        this.setDataValue("nombre", typeof valor === "string" ? valor.trim() : valor);
      },
      validate: { notEmpty: { msg: "El nombre de la radio es obligatorio" } },
    },
    logoUrl: textoOpcional(),
    streamUrl: {
      ...textoOpcional(),
      set(valor) {
        this.setDataValue("streamUrl", typeof valor === "string" ? valor.trim() : valor);
      },
    },
    facebook: textoOpcional(),
    instagram: textoOpcional(),
    youtube: textoOpcional(),
    whatsapp: textoOpcional(),
  },
  {
    sequelize,
    modelName: "ConfiguracionRadio",
    tableName: "configuracion_radio",
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

ConfiguracionRadio.REDES = REDES;
module.exports = ConfiguracionRadio;
