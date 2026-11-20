const mensajeValidacion = (error) =>
  Array.isArray(error.errors) && error.errors.length
    ? error.errors.map((e) => e.message).join(". ")
    : error.message;

const responderError = (res, error, accion) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ exito: false, mensaje: mensajeValidacion(error) });
  }
  console.error(`Error en ${accion}:`, error);
  return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
};

module.exports = { mensajeValidacion, responderError };
