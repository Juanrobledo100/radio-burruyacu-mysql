const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/baseDatos");

class NoticiaArchivo extends Model {}

NoticiaArchivo.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    noticiaId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    mediaId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    url: { type: DataTypes.STRING(500), allowNull: false },
    tipo: { type: DataTypes.ENUM("imagen", "video"), allowNull: false },
    orden: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "NoticiaArchivo",
    tableName: "noticia_archivos",
    timestamps: false,
  }
);

module.exports = NoticiaArchivo;
