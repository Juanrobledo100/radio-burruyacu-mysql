const express = require("express");
const router = express.Router();
const {
  obtenerBanners,
  obtenerBannerPorId,
  crearBanner,
  actualizarBanner,
  eliminarBanner,
} = require("../controllers/heroControlador");
const { protegerRuta, permitirRoles } = require("../middlewares/autenticacion");
const { subirHero, manejarErrorSubida } = require("../middlewares/multer");

router.get("/", obtenerBanners);

router.get("/:id", obtenerBannerPorId);

router.post("/", protegerRuta, permitirRoles("admin"), subirHero.single("media"), manejarErrorSubida, crearBanner);

router.put(
  "/:id",
  protegerRuta,
  permitirRoles("admin"),
  subirHero.single("media"),
  manejarErrorSubida,
  actualizarBanner
);

router.delete("/:id", protegerRuta, permitirRoles("admin"), eliminarBanner);

module.exports = router;
