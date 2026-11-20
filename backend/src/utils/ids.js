const idValido = (id) => /^[1-9]\d*$/.test(String(id));

const buscarPorId = (Modelo, id, opciones = {}) =>
  idValido(id) ? Modelo.findByPk(Number(id), opciones) : Promise.resolve(null);

module.exports = { idValido, buscarPorId };
