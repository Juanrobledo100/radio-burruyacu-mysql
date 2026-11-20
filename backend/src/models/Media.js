const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/baseDatos");

class Media extends Model {
  toJSON() {
    const datos = this.get({ plain: true });
    delete datos.creadoPorUsuarioId;
    return { _id: datos.id, ...datos };
  }
}

Media.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    creadoPorUsuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    nombreOriginal: { type: DataTypes.STRING(255), allowNull: false },
    filename: { type: DataTypes.STRING(255), allowNull: false },
    ruta: { type: DataTypes.STRING(500), allowNull: false },
    mimetype: { type: DataTypes.STRING(100), allowNull: false },
    publicId: { type: DataTypes.STRING(255), allowNull: true },
    tipoRecurso: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: false,
      defaultValue: "image",
    },
    carpeta: {
      type: DataTypes.ENUM("noticias", "hero", "radio"),
      allowNull: false,
      validate: { notNull: { msg: "La carpeta de destino es obligatoria" } },
    },
    tamano: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      get() {
        const valor = this.getDataValue("tamano");
        return valor === null || valor === undefined ? valor : Number(valor);
      },
    },
  },
  {
    sequelize,
    modelName: "Media",
    tableName: "media",
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

module.exports = Media;
