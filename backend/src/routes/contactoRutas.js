const express = require("express");
const {
  listarContactos,
  crearContacto,
  actualizarEstadoContacto,
} = require("../controllers/contactoControlador");
const { protegerRuta, permitirRoles } = require("../middlewares/autenticacion");

const router = express.Router();

router.get("/", protegerRuta, permitirRoles("admin"), listarContactos);
router.post("/", protegerRuta, crearContacto);
router.patch("/:id/estado", protegerRuta, permitirRoles("admin"), actualizarEstadoContacto);

module.exports = router;
