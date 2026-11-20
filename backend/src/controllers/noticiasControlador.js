const { sequelize } = require("../config/baseDatos");
const { Noticia, NoticiaArchivo, Categoria } = require("../models");
const { obtenerRutaPublica } = require("../middlewares/multer");
const { buscarPorId } = require("../utils/ids");
const { buscarMediaId } = require("../utils/media");
const { responderError } = require("../utils/errores");

const incluirArchivos = () => ({
  model: NoticiaArchivo,
  as: "archivos",
  separate: true,
  order: [["orden", "ASC"], ["id", "ASC"]],
});

const incluirCategoria = () => ({
  model: Categoria,
  as: "categoriaRelacion",
  attributes: ["id", "nombre"],
});

const resolverCategoriaActiva = async ({ categoriaId, categoria }) => {
  if (categoriaId !== undefined && categoriaId !== "") {
    const id = Number(categoriaId);
    if (!Number.isSafeInteger(id) || id < 1) return null;
    return Categoria.findOne({ where: { id, activo: true } });
  }
  if (typeof categoria === "string" && categoria.trim()) {
    return Categoria.findOne({ where: { nombre: categoria.trim(), activo: true } });
  }
  return null;
};

const prepararArchivos = async (archivos = [], inicioImagen = 0, inicioVideo = 0) => {
  let imagenes = inicioImagen;
  let videos = inicioVideo;
  const filas = [];

  for (const archivo of archivos) {
    const url = obtenerRutaPublica(archivo);
    let tipo = null;
    if (archivo.mimetype.startsWith("image/")) tipo = "imagen";
    else if (archivo.mimetype.startsWith("video/")) tipo = "video";
    if (!tipo) continue;

    filas.push({
      url,
      tipo,
      orden: tipo === "imagen" ? imagenes++ : videos++,
      mediaId: await buscarMediaId(url),
    });
  }
  return filas;
};

const siguienteOrden = async (noticiaId, tipo, transaction) => {
  const maximo = await NoticiaArchivo.max("orden", { where: { noticiaId, tipo }, transaction });
  return maximo === null || maximo === undefined ? 0 : Number(maximo) + 1;
};

const obtenerNoticias = async (req, res) => {
  try {
    const where = {};
    const categoriaInclude = incluirCategoria();
    if (req.query.categoriaId) {
      const categoriaId = Number(req.query.categoriaId);
      where.categoriaId = Number.isSafeInteger(categoriaId) && categoriaId > 0 ? categoriaId : -1;
    } else if (req.query.categoria) {
      categoriaInclude.where = { nombre: req.query.categoria };
      categoriaInclude.required = true;
    }
    if (req.query.destacada !== undefined) where.destacada = req.query.destacada === "true";

    const noticias = await Noticia.findAll({
      where,
      include: [categoriaInclude, incluirArchivos()],
      order: [["fechaPublicacion", "DESC"], ["id", "DESC"]],
    });

    res.status(200).json({ exito: true, total: noticias.length, datos: noticias });
  } catch (error) {
    responderError(res, error, "obtenerNoticias");
  }
};

const obtenerNoticiaPorId = async (req, res) => {
  try {
    const noticia = await buscarPorId(Noticia, req.params.id, {
      include: [incluirCategoria(), incluirArchivos()],
    });

    if (!noticia) {
      return res.status(404).json({ exito: false, mensaje: "Noticia no encontrada." });
    }

    res.status(200).json({ exito: true, datos: noticia });
  } catch (error) {
    responderError(res, error, "obtenerNoticiaPorId");
  }
};

const crearNoticia = async (req, res) => {
  try {
    const { titulo, subtitulo, contenido, destacada, fechaPublicacion } = req.body;
    const categoria = await resolverCategoriaActiva(req.body);
    if (!categoria) {
      return res.status(400).json({ exito: false, mensaje: "Seleccioná una categoría activa." });
    }

    const filas = await prepararArchivos(req.files);

    const id = await sequelize.transaction(async (transaction) => {
      const nueva = await Noticia.create(
        {
          creadoPorUsuarioId: req.usuario.id,
          titulo,
          subtitulo,
          contenido,
          categoriaId: categoria.id,
          destacada: destacada === "true" || destacada === true,
          fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : new Date(),
        },
        { transaction }
      );

      if (filas.length) {
        await NoticiaArchivo.bulkCreate(
          filas.map((fila) => ({ ...fila, noticiaId: nueva.id })),
          { transaction }
        );
      }
      return nueva.id;
    });

    const noticia = await Noticia.findByPk(id, {
      include: [incluirCategoria(), incluirArchivos()],
    });

    res.status(201).json({
      exito: true,
      mensaje: "Noticia creada correctamente.",
      datos: noticia,
    });
  } catch (error) {
    responderError(res, error, "crearNoticia");
  }
};

const actualizarNoticia = async (req, res) => {
  try {
    const { titulo, subtitulo, contenido, destacada } = req.body;

    const noticia = await buscarPorId(Noticia, req.params.id);
    if (!noticia) {
      return res.status(404).json({ exito: false, mensaje: "Noticia no encontrada." });
    }

    if (titulo) noticia.titulo = titulo;
    if (subtitulo !== undefined) noticia.subtitulo = subtitulo;
    if (contenido) noticia.contenido = contenido;
    if (req.body.categoriaId !== undefined || req.body.categoria !== undefined) {
      const categoria = await resolverCategoriaActiva(req.body);
      if (!categoria) {
        return res.status(400).json({ exito: false, mensaje: "Seleccioná una categoría activa." });
      }
      noticia.categoriaId = categoria.id;
    }
    if (destacada !== undefined) noticia.destacada = destacada === "true" || destacada === true;

    await sequelize.transaction(async (transaction) => {
      await noticia.save({ transaction });

      if (req.files && req.files.length > 0) {
        const inicioImagen = await siguienteOrden(noticia.id, "imagen", transaction);
        const inicioVideo = await siguienteOrden(noticia.id, "video", transaction);
        const filas = await prepararArchivos(req.files, inicioImagen, inicioVideo);

        if (filas.length) {
          await NoticiaArchivo.bulkCreate(
            filas.map((fila) => ({ ...fila, noticiaId: noticia.id })),
            { transaction }
          );
        }
      }
    });

    const actualizada = await Noticia.findByPk(noticia.id, {
      include: [incluirCategoria(), incluirArchivos()],
    });

    res.status(200).json({
      exito: true,
      mensaje: "Noticia actualizada correctamente.",
      datos: actualizada,
    });
  } catch (error) {
    responderError(res, error, "actualizarNoticia");
  }
};

const eliminarNoticia = async (req, res) => {
  try {
    const noticia = await buscarPorId(Noticia, req.params.id);

    if (!noticia) {
      return res.status(404).json({ exito: false, mensaje: "Noticia no encontrada." });
    }
    await noticia.destroy();

    res.status(200).json({
      exito: true,
      mensaje: "Noticia eliminada correctamente.",
    });
  } catch (error) {
    responderError(res, error, "eliminarNoticia");
  }
};

module.exports = {
  obtenerNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
};
