const express = require("express");
const router = express.Router();
const { subirArchivos, obtenerGaleria, eliminarMedia } = require("../controllers/mediaControlador");
const { protegerRuta, permitirRoles } = require("../middlewares/autenticacion");
const { procesarArchivoDinamico } = require("../middlewares/multer");

router.post("/upload", protegerRuta, permitirRoles("admin"), procesarArchivoDinamico, subirArchivos);

router.get("/", protegerRuta, permitirRoles("admin"), obtenerGaleria);

router.delete("/:id", protegerRuta, permitirRoles("admin"), eliminarMedia);

module.exports = router;
