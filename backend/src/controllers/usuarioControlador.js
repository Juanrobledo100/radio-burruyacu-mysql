const { Usuario } = require("../models");
const { buscarPorId } = require("../utils/ids");
const { mensajeValidacion } = require("../utils/errores");

const datosPublicos = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
  creadoEn: usuario.creadoEn,
  actualizadoEn: usuario.actualizadoEn,
});

const manejarError = (error, res, accion) => {
  console.error(`Error en ${accion}:`, error);

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      exito: false,
      mensaje: "El nombre de usuario o el correo ya existe.",
    });
  }

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ exito: false, mensaje: mensajeValidacion(error) });
  }

  return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ order: [["nombre", "ASC"]] });
    res.status(200).json({
      exito: true,
      total: usuarios.length,
      datos: usuarios.map(datosPublicos),
    });
  } catch (error) {
    manejarError(error, res, "obtenerUsuarios");
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await buscarPorId(Usuario, req.params.id);
    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado." });
    }
    res.status(200).json({ exito: true, datos: datosPublicos(usuario) });
  } catch (error) {
    manejarError(error, res, "obtenerUsuarioPorId");
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body || {};
    const usuario = await Usuario.create({ nombre, email, password, rol });

    res.status(201).json({
      exito: true,
      mensaje: "Usuario creado correctamente.",
      datos: datosPublicos(usuario),
    });
  } catch (error) {
    manejarError(error, res, "crearUsuario");
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await buscarPorId(Usuario, req.params.id);
    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado." });
    }

    const { nombre, email, password, rol } = req.body;
    if (
      String(usuario.id) === String(req.usuario?.id) &&
      rol !== undefined &&
      rol !== "admin"
    ) {
      return res.status(409).json({
        exito: false,
        mensaje: "No podés quitarte el rol de administrador desde tu propia sesión.",
      });
    }

    if (usuario.rol === "admin" && rol === "usuario") {
      const administradores = await Usuario.count({ where: { rol: "admin" } });
      if (administradores <= 1) {
        return res.status(409).json({
          exito: false,
          mensaje: "No se puede quitar el rol del último administrador.",
        });
      }
    }

    if (nombre !== undefined) usuario.nombre = nombre;
    if (email !== undefined) usuario.email = email ? String(email).trim() : null;
    if (password !== undefined && password !== "") usuario.password = password;
    if (rol !== undefined) usuario.rol = rol;

    await usuario.save();

    res.status(200).json({
      exito: true,
      mensaje: "Usuario actualizado correctamente.",
      datos: datosPublicos(usuario),
    });
  } catch (error) {
    manejarError(error, res, "actualizarUsuario");
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await buscarPorId(Usuario, req.params.id);
    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado." });
    }

    if (String(usuario.id) === String(req.usuario?.id)) {
      return res.status(409).json({
        exito: false,
        mensaje: "No podés eliminar tu propia cuenta de administrador.",
      });
    }

    if (usuario.rol === "admin") {
      const administradores = await Usuario.count({ where: { rol: "admin" } });
      if (administradores <= 1) {
        return res.status(409).json({
          exito: false,
          mensaje: "No se puede eliminar el último administrador.",
        });
      }
    }

    await usuario.destroy();

    res.status(200).json({ exito: true, mensaje: "Usuario eliminado correctamente." });
  } catch (error) {
    manejarError(error, res, "eliminarUsuario");
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
