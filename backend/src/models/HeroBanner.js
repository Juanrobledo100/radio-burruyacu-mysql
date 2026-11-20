const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/baseDatos");

class HeroBanner extends Model {
  toJSON() {
    const datos = this.get({ plain: true });
    delete datos.creadoPorUsuarioId;
    return { _id: datos.id, ...datos };
  }
}

const trim = (campo) =>
  function (valor) {
    this.setDataValue(campo, typeof valor === "string" ? valor.trim() : valor);
  };

HeroBanner.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    creadoPorUsuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    titulo: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "", set: trim("titulo") },
    subtitulo: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "", set: trim("subtitulo") },
    tipoMedia: {
      type: DataTypes.ENUM("imagen", "video"),
      allowNull: false,
      validate: { notNull: { msg: "El tipo de media es obligatorio" } },
    },
    mediaUrl: { type: DataTypes.STRING(500), allowNull: true },
    mediaId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    linkAccion: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    textoBoton: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "", set: trim("textoBoton") },
    orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "HeroBanner",
    tableName: "hero_banners",
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

module.exports = HeroBanner;
