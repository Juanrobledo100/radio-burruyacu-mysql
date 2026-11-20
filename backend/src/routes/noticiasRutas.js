const express = require("express");
const router = express.Router();
const {
  obtenerNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
} = require("../controllers/noticiasControlador");
const { protegerRuta, permitirRoles } = require("../middlewares/autenticacion");
const { subirNoticias, manejarErrorSubida } = require("../middlewares/multer");

router.get("/", obtenerNoticias);

router.get("/:id", obtenerNoticiaPorId);

router.post(
  "/",
  protegerRuta,
  permitirRoles("admin"),
  subirNoticias.array("archivos", 10),
  manejarErrorSubida,
  crearNoticia
);

router.put(
  "/:id",
  protegerRuta,
  permitirRoles("admin"),
  subirNoticias.array("archivos", 10),
  manejarErrorSubida,
  actualizarNoticia
);

router.delete("/:id", protegerRuta, permitirRoles("admin"), eliminarNoticia);

module.exports = router;
