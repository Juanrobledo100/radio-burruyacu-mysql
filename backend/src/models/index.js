const Usuario = require("./Usuario");
const ConfiguracionRadio = require("./ConfiguracionRadio");
const RedSocial = require("./RedSocial");
const Media = require("./Media");
const HeroBanner = require("./HeroBanner");
const Noticia = require("./Noticia");
const NoticiaArchivo = require("./NoticiaArchivo");
const Contacto = require("./Contacto");
const Categoria = require("./Categoria");

const asociarCreador = (Modelo, aliasPlural) => {
  Usuario.hasMany(Modelo, {
    as: aliasPlural,
    foreignKey: { name: "creadoPorUsuarioId", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Modelo.belongsTo(Usuario, {
    as: "creadoPor",
    foreignKey: "creadoPorUsuarioId",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
};

asociarCreador(Categoria, "categoriasCreadas");
asociarCreador(Noticia, "noticiasCreadas");
asociarCreador(Media, "mediosSubidos");
asociarCreador(HeroBanner, "bannersCreados");
asociarCreador(RedSocial, "redesCreadas");

Usuario.hasMany(Contacto, {
  as: "contactos",
  foreignKey: { name: "usuarioId", allowNull: true },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Contacto.belongsTo(Usuario, {
  as: "usuario",
  foreignKey: "usuarioId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

Categoria.hasMany(Noticia, {
  as: "noticias",
  foreignKey: { name: "categoriaId", allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Noticia.belongsTo(Categoria, {
  as: "categoriaRelacion",
  foreignKey: { name: "categoriaId", allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Noticia.hasMany(NoticiaArchivo, {
  as: "archivos",
  foreignKey: { name: "noticiaId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
NoticiaArchivo.belongsTo(Noticia, { as: "noticia", foreignKey: "noticiaId" });

Media.hasMany(NoticiaArchivo, {
  as: "archivosNoticia",
  foreignKey: "mediaId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
NoticiaArchivo.belongsTo(Media, { as: "media", foreignKey: "mediaId" });

Media.hasMany(HeroBanner, {
  as: "banners",
  foreignKey: "mediaId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
HeroBanner.belongsTo(Media, { as: "media", foreignKey: "mediaId" });

module.exports = {
  Usuario,
  ConfiguracionRadio,
  RedSocial,
  Media,
  HeroBanner,
  Noticia,
  NoticiaArchivo,
  Contacto,
  Categoria,
};
