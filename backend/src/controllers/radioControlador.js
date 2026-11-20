const { ConfiguracionRadio } = require("../models");
const { obtenerRutaPublica } = require("../middlewares/multer");
const { responderError } = require("../utils/errores");

const obtenerConfiguracion = async (req, res) => {
  try {
    const configuracion = await ConfiguracionRadio.findOne({ order: [["id", "ASC"]] });

    if (!configuracion) {
      return res.status(404).json({
        exito: false,
        mensaje: "No se encontro configuracion de la radio.",
      });
    }

    res.status(200).json({ exito: true, datos: configuracion });
  } catch (error) {
    responderError(res, error, "obtenerConfiguracion");
  }
};

const actualizarConfiguracion = async (req, res) => {
  try {
    const { nombre, streamUrl, redesSociales } = req.body;

    const camposActualizar = {};
    if (nombre) camposActualizar.nombre = nombre;
    if (streamUrl) camposActualizar.streamUrl = streamUrl;
    if (redesSociales) {
      const redes =
        typeof redesSociales === "string" ? JSON.parse(redesSociales) : redesSociales;
      ConfiguracionRadio.REDES.forEach((red) => {
        if (redes[red] !== undefined) camposActualizar[red] = redes[red] ?? "";
      });
    }

    if (req.file) {
      camposActualizar.logoUrl = obtenerRutaPublica(req.file);
    }

    let configuracion = await ConfiguracionRadio.findOne({ order: [["id", "ASC"]] });
    if (configuracion) {
      await configuracion.update(camposActualizar);
    } else {
      configuracion = await ConfiguracionRadio.create(camposActualizar);
    }

    res.status(200).json({
      exito: true,
      mensaje: "Configuracion de la radio actualizada correctamente.",
      datos: configuracion,
    });
  } catch (error) {
    responderError(res, error, "actualizarConfiguracion");
  }
};

module.exports = { obtenerConfiguracion, actualizarConfiguracion };
