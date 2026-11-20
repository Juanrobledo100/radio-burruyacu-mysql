const express = require("express");
const router = express.Router();
const {
  obtenerRedesSociales,
  listarRedesAdmin,
  crearRedSocial,
  actualizarRedSocial,
  eliminarRedSocial,
} = require("../controllers/redSocialControlador");
const { protegerRuta, permitirRoles } = require("../middlewares/autenticacion");

router.get("/", obtenerRedesSociales);
router.use(protegerRuta, permitirRoles("admin"));
router.get("/admin", listarRedesAdmin);
router.post("/", crearRedSocial);
router.put("/:id", actualizarRedSocial);
router.delete("/:id", eliminarRedSocial);

module.exports = router;