const express = require("express");
const router = express.Router();
const {
	registrarUsuario,
	iniciarSesion,
	solicitarRestablecimiento,
	restablecerPassword,
} = require("../controllers/autenticacionControlador");

router.post("/registro", registrarUsuario);
router.post("/login", iniciarSesion);
router.post("/forgot-password", solicitarRestablecimiento);
router.post("/reset-password", restablecerPassword);

module.exports = router;
