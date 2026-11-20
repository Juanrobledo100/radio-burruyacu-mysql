const { Media } = require("../models");

const buscarMediaId = async (url) => {
  if (!url) return null;
  const media = await Media.findOne({ where: { ruta: url }, attributes: ["id"] });
  return media ? media.id : null;
};

module.exports = { buscarMediaId };
