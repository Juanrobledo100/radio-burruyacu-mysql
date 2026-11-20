const express = require("express");
const {
  listarCategorias,
  listarCategoriasAdmin,
  crearCategoria,
  actualizarCategoria,
  desactivarCategoria,
} = require("../controllers/categoriasControlador");
const { protegerRuta, permitirRoles } = require("../middlewares/autenticacion");

const router = express.Router();

router.get("/", listarCategorias);
router.get("/admin", protegerRuta, permitirRoles("admin"), listarCategoriasAdmin);
router.post("/", protegerRuta, permitirRoles("admin"), crearCategoria);
router.put("/:id", protegerRuta, permitirRoles("admin"), actualizarCategoria);
router.delete("/:id", protegerRuta, permitirRoles("admin"), desactivarCategoria);

module.exports = router;
