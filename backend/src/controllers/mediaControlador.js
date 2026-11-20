const { Media } = require("../models");
const path = require("path");
const fs = require("fs");
const { buscarPorId } = require("../utils/ids");
const { responderError } = require("../utils/errores");
const { obtenerRutaPublica } = require("../middlewares/multer");

const subirArchivos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        exito: false,
        mensaje: "No se enviaron archivos.",
      });
    }

    const carpeta = req.query.carpeta || req.body.carpeta || "noticias";

    const archivosGuardados = await Promise.all(
      req.files.map((archivo) => {
        const rutaPublica = obtenerRutaPublica(archivo);
        return Media.create({
          creadoPorUsuarioId: req.usuario.id,
          nombreOriginal: archivo.originalname,
          filename: archivo.filename,
          ruta: rutaPublica,
          mimetype: archivo.mimetype,
          publicId: archivo.filename,
          tipoRecurso: archivo.mimetype.startsWith("video/") ? "video" : "image",
          carpeta: carpeta,
          tamano: archivo.size,
        });
      })
    );

    res.status(201).json({
      exito: true,
      mensaje: `${archivosGuardados.length} archivo(s) subido(s) correctamente.`,
      datos: archivosGuardados,
    });
  } catch (error) {
    responderError(res, error, "subirArchivos");
  }
};

const obtenerGaleria = async (req, res) => {
  try {
    const where = {};
    if (req.query.carpeta) where.carpeta = req.query.carpeta;

    const archivos = await Media.findAll({
      where,
      order: [["creadoEn", "DESC"], ["id", "DESC"]],
    });

    res.status(200).json({
      exito: true,
      total: archivos.length,
      datos: archivos,
    });
  } catch (error) {
    responderError(res, error, "obtenerGaleria");
  }
};

const eliminarMedia = async (req, res) => {
  try {
    const media = await buscarPorId(Media, req.params.id);
    if (!media) {
      return res.status(404).json({ exito: false, mensaje: "Archivo no encontrado." });
    }

    if (media.ruta) {
      try {
        const rutaAbsoluta = path.join(
          __dirname, "..", "..", "uploads",
          media.ruta.replace(/^\/uploads\//, "")
        );
        if (fs.existsSync(rutaAbsoluta)) {
          fs.unlinkSync(rutaAbsoluta);
        }
      } catch (err) {
        console.error("Advertencia: no se pudo eliminar el archivo del disco:", err.message);
      }
    }

    await media.destroy();

    res.status(200).json({ exito: true, mensaje: "Archivo eliminado correctamente." });
  } catch (error) {
    responderError(res, error, "eliminarMedia");
  }
};

module.exports = { subirArchivos, obtenerGaleria, eliminarMedia };
