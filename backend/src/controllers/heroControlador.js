const { HeroBanner } = require("../models");
const { obtenerRutaPublica } = require("../middlewares/multer");
const { buscarPorId } = require("../utils/ids");
const { buscarMediaId } = require("../utils/media");
const { responderError } = require("../utils/errores");

const obtenerBanners = async (req, res) => {
  try {
    const soloActivos = req.query.todos !== "true";
    const where = soloActivos ? { activo: true } : {};

    const banners = await HeroBanner.findAll({
      where,
      order: [["orden", "ASC"], ["id", "ASC"]],
    });

    res.status(200).json({ exito: true, total: banners.length, datos: banners });
  } catch (error) {
    responderError(res, error, "obtenerBanners");
  }
};

const obtenerBannerPorId = async (req, res) => {
  try {
    const banner = await buscarPorId(HeroBanner, req.params.id);
    if (!banner) {
      return res.status(404).json({ exito: false, mensaje: "Banner no encontrado." });
    }
    res.status(200).json({ exito: true, datos: banner });
  } catch (error) {
    responderError(res, error, "obtenerBannerPorId");
  }
};

const crearBanner = async (req, res) => {
  try {
    const { titulo, subtitulo, tipoMedia, mediaUrl, linkAccion, textoBoton, orden, activo } =
      req.body;

    if (!req.file && !mediaUrl?.trim()) {
      return res.status(400).json({
        exito: false,
        mensaje: "Debes subir una imagen o video, o ingresar una URL de media.",
      });
    }

    const mediaGuardada = req.file ? obtenerRutaPublica(req.file) : mediaUrl.trim();
    const banner = await HeroBanner.create({
      creadoPorUsuarioId: req.usuario.id,
      titulo,
      subtitulo,
      tipoMedia,
      mediaUrl: mediaGuardada,
      mediaId: await buscarMediaId(mediaGuardada),
      linkAccion,
      textoBoton,
      orden: orden ? Number(orden) : 0,
      activo: activo !== "false" && activo !== false,
    });

    res.status(201).json({
      exito: true,
      mensaje: "Banner creado correctamente.",
      datos: banner,
    });
  } catch (error) {
    responderError(res, error, "crearBanner");
  }
};

const actualizarBanner = async (req, res) => {
  try {
    const { titulo, subtitulo, tipoMedia, mediaUrl, linkAccion, textoBoton, orden, activo } =
      req.body;

    const banner = await buscarPorId(HeroBanner, req.params.id);
    if (!banner) {
      return res.status(404).json({ exito: false, mensaje: "Banner no encontrado." });
    }

    if (titulo) banner.titulo = titulo;
    if (subtitulo !== undefined) banner.subtitulo = subtitulo;
    if (tipoMedia) banner.tipoMedia = tipoMedia;
    if (mediaUrl?.trim() && !req.file) banner.mediaUrl = mediaUrl.trim();
    if (linkAccion !== undefined) banner.linkAccion = linkAccion;
    if (textoBoton !== undefined) banner.textoBoton = textoBoton;
    if (orden !== undefined) banner.orden = Number(orden);
    if (activo !== undefined) banner.activo = activo !== "false" && activo !== false;

    if (req.file) {
      banner.mediaUrl = obtenerRutaPublica(req.file);
    }

    if (banner.changed("mediaUrl")) {
      banner.mediaId = await buscarMediaId(banner.mediaUrl);
    }

    await banner.save();

    res.status(200).json({
      exito: true,
      mensaje: "Banner actualizado correctamente.",
      datos: banner,
    });
  } catch (error) {
    responderError(res, error, "actualizarBanner");
  }
};

const eliminarBanner = async (req, res) => {
  try {
    const banner = await buscarPorId(HeroBanner, req.params.id);
    if (!banner) {
      return res.status(404).json({ exito: false, mensaje: "Banner no encontrado." });
    }
    await banner.destroy();
    res.status(200).json({ exito: true, mensaje: "Banner eliminado correctamente." });
  } catch (error) {
    responderError(res, error, "eliminarBanner");
  }
};

module.exports = {
  obtenerBanners,
  obtenerBannerPorId,
  crearBanner,
  actualizarBanner,
  eliminarBanner,
};
