const { RedSocial, ConfiguracionRadio } = require("../models");
const { buscarPorId } = require("../utils/ids");
const { mensajeValidacion } = require("../utils/errores");

const CAMPOS = ["nombre", "url", "activo", "orden"];

const migrarRedesExistentes = async () => {
  const configuracion = await ConfiguracionRadio.findOne({ order: [["id", "ASC"]] });
  if (!configuracion) return;

  const documentos = ConfiguracionRadio.REDES.map((nombre) => [nombre, configuracion[nombre]]).filter(
    ([, url]) => url
  );

  for (const [nombre, url] of documentos) {
    const existente = await RedSocial.findOne({ where: { nombre } });
    if (!existente) {
      await RedSocial.create({
        nombre,
        url,
        orden: documentos.findIndex(([clave]) => clave === nombre),
      });
    }
  }
};

const ORDEN = [["orden", "ASC"], ["nombre", "ASC"]];

const obtenerRedesSociales = async (req, res) => {
  try {
    await migrarRedesExistentes();
    const redes = await RedSocial.findAll({ where: { activo: true }, order: ORDEN });
    res.status(200).json({ exito: true, datos: redes });
  } catch (error) {
    console.error("Error en obtenerRedesSociales:", error);
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
};

const listarRedesAdmin = async (req, res) => {
  try {
    await migrarRedesExistentes();
    const redes = await RedSocial.findAll({ order: ORDEN });
    res.status(200).json({ exito: true, datos: redes });
  } catch (error) {
    console.error("Error en listarRedesAdmin:", error);
    res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
};

const crearRedSocial = async (req, res) => {
  try {
    const red = await RedSocial.create(
      { ...req.body, creadoPorUsuarioId: req.usuario.id },
      { fields: [...CAMPOS, "creadoPorUsuarioId"] }
    );
    res.status(201).json({ exito: true, mensaje: "Red social creada correctamente.", datos: red });
  } catch (error) {
    res.status(400).json({ exito: false, mensaje: mensajeValidacion(error) || "Datos inválidos." });
  }
};

const actualizarRedSocial = async (req, res) => {
  try {
    const red = await buscarPorId(RedSocial, req.params.id);
    if (!red) return res.status(404).json({ exito: false, mensaje: "Red social no encontrada." });
    await red.update(req.body, { fields: CAMPOS });
    res.status(200).json({ exito: true, mensaje: "Red social actualizada correctamente.", datos: red });
  } catch (error) {
    res.status(400).json({ exito: false, mensaje: mensajeValidacion(error) || "Datos inválidos." });
  }
};

const eliminarRedSocial = async (req, res) => {
  try {
    const red = await buscarPorId(RedSocial, req.params.id);
    if (!red) return res.status(404).json({ exito: false, mensaje: "Red social no encontrada." });
    await red.destroy();
    res.status(200).json({ exito: true, mensaje: "Red social eliminada correctamente." });
  } catch (error) {
    res.status(400).json({ exito: false, mensaje: "ID de red social inválido." });
  }
};

module.exports = {
  obtenerRedesSociales,
  listarRedesAdmin,
  crearRedSocial,
  actualizarRedSocial,
  eliminarRedSocial,
};
