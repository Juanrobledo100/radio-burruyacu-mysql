const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "radio",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "root",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
    define: {
      underscored: true,
      freezeTableName: true,
    },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);

const conectarBaseDatos = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL conectado");
  } catch (error) {
    console.error(`❌ Error al conectar MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarBaseDatos;
module.exports.sequelize = sequelize;
