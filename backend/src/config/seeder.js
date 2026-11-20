require("dotenv").config();
const conectarBaseDatos = require("./baseDatos");
const { sequelize } = require("./baseDatos");
const { Usuario, ConfiguracionRadio } = require("../models");

const sembrar = async () => {
  await conectarBaseDatos();

  const {
    ADMIN_NOMBRE,
    ADMIN_PASSWORD,
    USUARIO_NOMBRE,
    USUARIO_PASSWORD,
  } = process.env;
  if (!ADMIN_NOMBRE || !ADMIN_PASSWORD) {
    console.error("❌ Definí ADMIN_NOMBRE y ADMIN_PASSWORD en el .env.");
    process.exit(1);
  }

  const crearUsuario = async (nombre, password, rol) => {
    if (!nombre || !password) return;
    const existente = await Usuario.findOne({ where: { nombre: nombre.trim() } });
    if (existente) {
      console.log(`ℹ️  El usuario "${nombre}" ya existe, no se modifica.`);
      return;
    }
    await Usuario.create({ nombre, password, rol });
    console.log(`✅ Usuario ${rol} "${nombre}" creado.`);
  };

  await crearUsuario(ADMIN_NOMBRE, ADMIN_PASSWORD, "admin");
  await crearUsuario(USUARIO_NOMBRE, USUARIO_PASSWORD, "usuario");

  if ((await ConfiguracionRadio.count()) === 0) {
    await ConfiguracionRadio.create({});
    console.log("✅ Configuración inicial de la radio creada.");
  }

  await sequelize.close();
};

sembrar().catch((error) => {
  console.error("❌ Error en el seeder:", error.message);
  process.exit(1);
});
