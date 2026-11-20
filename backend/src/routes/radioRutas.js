const express = require("express");
const router = express.Router();
const { obtenerConfiguracion, actualizarConfiguracion } = require("../controllers/radioControlador");
const { protegerRuta, permitirRoles } = require("../middlewares/autenticacion");
const { subirRadio, manejarErrorSubida } = require("../middlewares/multer");

router.get("/", obtenerConfiguracion);

router.put(
  "/",
  protegerRuta,
  permitirRoles("admin"),
  subirRadio.single("logo"),
  manejarErrorSubida,
  actualizarConfiguracion
);

module.exports = router;
