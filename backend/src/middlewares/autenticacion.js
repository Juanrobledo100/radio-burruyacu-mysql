const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const { buscarPorId } = require("../utils/ids");

const protegerRuta = async (req, res, siguiente) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      exito: false,
      mensaje: "Acceso denegado. No se proporcionó token de autenticación.",
    });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRETO);

    req.usuario = await buscarPorId(Usuario, decodificado.id);

    if (!req.usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: "El token es inválido o el usuario ya no existe.",
      });
    }

    siguiente();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        exito: false,
        mensaje: "La sesión ha expirado. Por favor, iniciá sesión nuevamente.",
      });
    }
    return res.status(401).json({
      exito: false,
      mensaje: "Token inválido.",
    });
  }
};

const permitirRoles = (...rolesPermitidos) => (req, res, siguiente) => {
  if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({
      exito: false,
      mensaje: "No tenés permisos para realizar esta operación.",
    });
  }
  siguiente();
};

module.exports = { protegerRuta, permitirRoles };
