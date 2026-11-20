require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const conectarBaseDatos = require("./config/baseDatos");
require("./models");

const autenticacionRutas = require("./routes/autenticacionRutas");
const radioRutas = require("./routes/radioRutas");
const noticiasRutas = require("./routes/noticiasRutas");
const heroRutas = require("./routes/heroRutas");
const mediaRutas = require("./routes/mediaRutas");
const usuariosRutas = require("./routes/usuariosRutas");
const redSocialRutas = require("./routes/redSocialRutas");
const contactoRutas = require("./routes/contactoRutas");
const categoriasRutas = require("./routes/categoriasRutas");

const app = express();
const PUERTO = process.env.PORT || 5000;

const origenesPermitidos = (process.env.CORS_ORIGENES || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origen, callback) => {
    if (!origen || origenesPermitidos.includes(origen)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origen no permitido"));
  },
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", autenticacionRutas);
app.use("/api/radio", radioRutas);
app.use("/api/noticias", noticiasRutas);
app.use("/api/hero", heroRutas);
app.use("/api/media", mediaRutas);
app.use("/api/usuarios", usuariosRutas);
app.use("/api/redes-sociales", redSocialRutas);
app.use("/api/contacto", contactoRutas);
app.use("/api/categorias", categoriasRutas);

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Radio Burruyacu funcionando correctamente",
    version: "1.0.0",
    estado: "activo",
  });
});

app.use((req, res) => {
  res.status(404).json({ exito: false, mensaje: "Ruta no encontrada." });
});

app.use((error, req, res, next) => {
  console.error("Error no manejado:", error);
  res.status(500).json({
    exito: false,
    mensaje: error.message || "Error interno del servidor.",
  });
});

const iniciarServidor = async () => {
  await conectarBaseDatos();

  app.listen(PUERTO, () => {
    console.log(`\n🎙️  Radio Burruyacu API corriendo en http://localhost:${PUERTO}`);
    console.log(`📁  Archivos estaticos en:  http://localhost:${PUERTO}/uploads`);
    console.log(`🌿  Entorno: ${process.env.NODE_ENV || "development"}\n`);
  });
};

iniciarServidor();
