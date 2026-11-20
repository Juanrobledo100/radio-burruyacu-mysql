const { Contacto } = require("../models");
const { mensajeValidacion, responderError } = require("../utils/errores");
const { buscarPorId } = require("../utils/ids");

const listarContactos = async (req, res) => {
  try {
    const contactos = await Contacto.findAll({ order: [["creadoEn", "DESC"]] });
    return res.json({ exito: true, datos: contactos });
  } catch (error) {
    return responderError(res, error, "listarContactos");
  }
};

const crearContacto = async (req, res) => {
  const { nombre, email, telefono, asunto, mensaje } = req.body || {};
  const camposObligatorios = [nombre, email, asunto, mensaje];

  if (!camposObligatorios.every((campo) => typeof campo === "string")) {
    return res.status(400).json({
      exito: false,
      mensaje: "Nombre, correo, asunto y mensaje son obligatorios.",
    });
  }

  if (telefono !== undefined && telefono !== null && typeof telefono !== "string") {
    return res.status(400).json({ exito: false, mensaje: "El teléfono no es válido." });
  }

  try {
    const contacto = await Contacto.create({
      usuarioId: req.usuario.id,
      nombre,
      email,
      telefono,
      asunto,
      mensaje,
    });
    return res.status(201).json({
      exito: true,
      mensaje: "Tu mensaje fue recibido correctamente.",
      datos: { id: contacto.id, creadoEn: contacto.creadoEn },
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ exito: false, mensaje: mensajeValidacion(error) });
    }
    return responderError(res, error, "crearContacto");
  }
};

const actualizarEstadoContacto = async (req, res) => {
  const { estado } = req.body || {};
  if (!["pendiente", "realizado"].includes(estado)) {
    return res.status(400).json({
      exito: false,
      mensaje: "El estado debe ser pendiente o realizado.",
    });
  }

  try {
    const contacto = await buscarPorId(Contacto, req.params.id);
    if (!contacto) {
      return res.status(404).json({ exito: false, mensaje: "Mensaje de contacto no encontrado." });
    }

    await contacto.update({ estado });
    return res.json({ exito: true, datos: contacto });
  } catch (error) {
    return responderError(res, error, "actualizarEstadoContacto");
  }
};

module.exports = { listarContactos, crearContacto, actualizarEstadoContacto };
