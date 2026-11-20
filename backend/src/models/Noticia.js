const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/baseDatos");

class Noticia extends Model {
  toJSON() {
    const datosCompletos = this.get({ plain: true });
    delete datosCompletos.creadoPorUsuarioId;
    const { archivos = [], categoriaRelacion, ...datos } = datosCompletos;
    const urls = (tipo) => archivos.filter((a) => a.tipo === tipo).map((a) => a.url);
    return {
      _id: datos.id,
      ...datos,
      categoria: categoriaRelacion?.nombre || "",
      imagenes: urls("imagen"),
      videos: urls("video"),
    };
  }
}

const trim = (campo) =>
  function (valor) {
    this.setDataValue(campo, typeof valor === "string" ? valor.trim() : valor);
  };

Noticia.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    creadoPorUsuarioId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set: trim("titulo"),
      validate: {
        notNull: { msg: "El titulo de la noticia es obligatorio" },
        notEmpty: { msg: "El titulo de la noticia es obligatorio" },
      },
    },
    subtitulo: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "", set: trim("subtitulo") },
    contenido: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
      validate: {
        notNull: { msg: "El contenido de la noticia es obligatorio" },
        notEmpty: { msg: "El contenido de la noticia es obligatorio" },
      },
    },
    categoriaId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    destacada: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fechaPublicacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Noticia",
    tableName: "noticias",
    createdAt: "creadoEn",
    updatedAt: "actualizadoEn",
  }
);

module.exports = Noticia;
