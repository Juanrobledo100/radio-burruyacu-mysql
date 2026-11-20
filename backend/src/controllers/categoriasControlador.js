const { Categoria } = require("../models");
const { buscarPorId } = require("../utils/ids");
const { mensajeValidacion, responderError } = require("../utils/errores");

const ORDEN = [["orden", "ASC"], ["nombre", "ASC"]];
const CAMPOS = ["nombre", "activo", "orden"];
const convertirOrden = (valor) => {
  const orden = Number(valor);
  return Number.isSafeInteger(orden) && orden >= 0 ? orden : null;
};

const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({ where: { activo: true }, order: ORDEN });
    return res.json({ exito: true, datos: categorias });
  } catch (error) {
    return responderError(res, error, "listarCategorias");
  }
};

const listarCategoriasAdmin = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({ order: ORDEN });
    return res.json({ exito: true, datos: categorias });
  } catch (error) {
    return responderError(res, error, "listarCategoriasAdmin");
  }
};

const responderErrorCategoria = (res, error) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ exito: false, mensaje: "Ya existe una categoría con ese nombre." });
  }
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ exito: false, mensaje: mensajeValidacion(error) });
  }
  return responderError(res, error, "gestionarCategoria");
};

const crearCategoria = async (req, res) => {
  const { nombre, orden } = req.body || {};
  if (typeof nombre !== "string") {
    return res.status(400).json({ exito: false, mensaje: "El nombre de la categoría es obligatorio." });
  }
  const ordenNormalizado = orden === undefined ? 0 : convertirOrden(orden);
  if (ordenNormalizado === null) {
    return res.status(400).json({ exito: false, mensaje: "El orden debe ser un número entero igual o mayor que cero." });
  }

  try {
    const categoria = await Categoria.create({
      creadoPorUsuarioId: req.usuario.id,
      nombre,
      orden: ordenNormalizado,
      activo: true,
    });
    return res.status(201).json({ exito: true, mensaje: "Categoría creada correctamente.", datos: categoria });
  } catch (error) {
    return responderErrorCategoria(res, error);
  }
};

const actualizarCategoria = async (req, res) => {
  try {
    const categoria = await buscarPorId(Categoria, req.params.id);
    if (!categoria) {
      return res.status(404).json({ exito: false, mensaje: "Categoría no encontrada." });
    }

    const cambios = {};
    if (req.body.nombre !== undefined) cambios.nombre = req.body.nombre;
    if (req.body.orden !== undefined) {
      cambios.orden = convertirOrden(req.body.orden);
      if (cambios.orden === null) {
        return res.status(400).json({ exito: false, mensaje: "El orden debe ser un número entero igual o mayor que cero." });
      }
    }
    if (req.body.activo !== undefined) {
      if (typeof req.body.activo !== "boolean") {
        return res.status(400).json({ exito: false, mensaje: "El estado de la categoría no es válido." });
      }
      cambios.activo = req.body.activo;
    }
    await categoria.update(cambios, { fields: CAMPOS });

    return res.json({ exito: true, mensaje: "Categoría actualizada correctamente.", datos: categoria });
  } catch (error) {
    return responderErrorCategoria(res, error);
  }
};

const desactivarCategoria = async (req, res) => {
  try {
    const categoria = await buscarPorId(Categoria, req.params.id);
    if (!categoria) {
      return res.status(404).json({ exito: false, mensaje: "Categoría no encontrada." });
    }
    categoria.activo = false;
    await categoria.save();
    return res.json({ exito: true, mensaje: "Categoría dada de baja; las noticias históricas se conservan." });
  } catch (error) {
    return responderErrorCategoria(res, error);
  }
};

module.exports = {
  listarCategorias,
  listarCategoriasAdmin,
  crearCategoria,
  actualizarCategoria,
  desactivarCategoria,
};
