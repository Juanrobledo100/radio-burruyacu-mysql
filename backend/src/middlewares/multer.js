const multer = require("multer");
const path = require("path");
const fs = require("fs");

const CARPETAS_PERMITIDAS = new Set(["noticias", "hero", "radio"]);
const TIPOS_IMAGEN = /^image\/(jpeg|jpg|png|gif|webp|svg\+xml|svg)$/i;
const TIPOS_PERMITIDOS = /^(image\/(jpeg|jpg|png|gif|webp|svg\+xml|svg)|video\/(mp4|webm|ogg))$/i;
const EXT_PERMITIDAS = /\.(jpeg|jpg|png|gif|webp|svg|mp4|webm|ogg)$/i;
const EXT_IMAGEN = /\.(jpeg|jpg|png|gif|webp|svg)$/i;

const generarNombreArchivo = (archivo) => {
  const nombreBase = archivo.originalname
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const ext = path.extname(archivo.originalname).toLowerCase();
  return `${nombreBase || "archivo"}-${Date.now()}${ext}`;
};

const crearAlmacenamiento = (carpeta) =>
  multer.diskStorage({
    destination: (req, archivo, cb) => {
      const dir = path.join(__dirname, "..", "..", "uploads", carpeta);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, archivo, cb) => {
      cb(null, generarNombreArchivo(archivo));
    },
  });

const filtrarArchivos = (req, archivo, cb) => {
  const extOk = EXT_PERMITIDAS.test(archivo.originalname.toLowerCase());
  const mimeOk = TIPOS_PERMITIDOS.test(archivo.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error("Tipo de archivo no permitido. Solo se aceptan imágenes y videos."));
};

const filtrarImagenes = (req, archivo, cb) => {
  const extOk = EXT_IMAGEN.test(archivo.originalname.toLowerCase());
  if (extOk && TIPOS_IMAGEN.test(archivo.mimetype)) return cb(null, true);
  cb(new Error("El logo debe ser una imagen válida."));
};

const crearSubida = (carpeta) =>
  multer({
    storage: crearAlmacenamiento(carpeta),
    fileFilter: filtrarArchivos,
    limits: { fileSize: 50 * 1024 * 1024 },
  });

const subirNoticias = crearSubida("noticias");
const subirHero = crearSubida("hero");
const subirRadio = multer({
  storage: crearAlmacenamiento("radio"),
  fileFilter: filtrarImagenes,
  limits: { fileSize: 10 * 1024 * 1024 },
});
const subirMedia = (carpeta) => crearSubida(carpeta);

const procesarArchivoDinamico = (req, res, siguiente) => {
  const carpeta = req.query.carpeta || "noticias";
  if (!CARPETAS_PERMITIDAS.has(carpeta)) {
    return res.status(400).json({
      exito: false,
      mensaje: "Carpeta inválida. Use noticias, hero o radio.",
    });
  }
  const instanciaMulter = subirMedia(carpeta);
  instanciaMulter.array("archivos", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ exito: false, mensaje: err.message });
    }
    siguiente();
  });
};

const obtenerRutaPublica = (archivo) => {
  const rel = path.relative(
    path.join(__dirname, "..", "..", "uploads"),
    archivo.path
  ).replace(/\\/g, "/");
  return `/uploads/${rel}`;
};

const manejarErrorSubida = (error, req, res, siguiente) => {
  if (error) {
    console.error("Error al subir archivo:", error);
    return res.status(400).json({
      exito: false,
      mensaje: error.message || "No se pudo subir el archivo.",
    });
  }
  siguiente();
};

module.exports = {
  subirNoticias,
  subirHero,
  subirRadio,
  subirMedia,
  procesarArchivoDinamico,
  obtenerRutaPublica,
  manejarErrorSubida,
};
