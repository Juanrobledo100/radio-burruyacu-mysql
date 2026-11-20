const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const { Usuario } = require("../models");
const { mensajeValidacion } = require("../utils/errores");

const intentosLogin = new Map();
const MAX_INTENTOS = 5;
const VENTANA_LOGIN_MS = 15 * 60 * 1000;

const obtenerTransportadorCorreo = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
};

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETO, {
    expiresIn: process.env.JWT_EXPIRACION || "2h",
  });
};

const registrarUsuario = async (req, res) => {
  const { nombre, email, password } = req.body || {};
  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    return res.status(400).json({
      exito: false,
      mensaje: "Ingresá un nombre, un correo válido y una contraseña de al menos 6 caracteres.",
    });
  }

  try {
    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol: "usuario",
    });
    const token = generarToken(usuario.id);

    return res.status(201).json({
      exito: true,
      mensaje: "Cuenta creada correctamente.",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        exito: false,
        mensaje: "Ya existe una cuenta con ese nombre o correo.",
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ exito: false, mensaje: mensajeValidacion(error) });
    }
    console.error("Error en registrarUsuario:", error);
    return res.status(500).json({ exito: false, mensaje: "No se pudo crear la cuenta." });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { nombre, password } = req.body;
    const nombreNormalizado = typeof nombre === "string" ? nombre.trim() : "";
    const identificador = req.ip || "desconocido";
    const ahora = Date.now();
    const registro = intentosLogin.get(identificador);

    if (registro && ahora - registro.inicio < VENTANA_LOGIN_MS && registro.fallos >= MAX_INTENTOS) {
      return res.status(429).json({
        exito: false,
        mensaje: "Demasiados intentos. Esperá unos minutos e intentá nuevamente.",
      });
    }

    if (registro && ahora - registro.inicio >= VENTANA_LOGIN_MS) {
      intentosLogin.delete(identificador);
    }

    if (!nombreNormalizado || typeof password !== "string" || !password) {
      return res.status(400).json({
        exito: false,
        mensaje: "Por favor ingresa usuario y contraseña.",
      });
    }

    const usuario = await Usuario.unscoped().findOne({ where: { nombre: nombreNormalizado } });

    if (!usuario) {
      registrarFalloLogin(identificador, ahora);
      return res.status(401).json({
        exito: false,
        mensaje: "Credenciales incorrectas.",
      });
    }

    const passwordCorrecta = await usuario.compararPassword(password);

    if (!passwordCorrecta) {
      registrarFalloLogin(identificador, ahora);
      return res.status(401).json({
        exito: false,
        mensaje: "Credenciales incorrectas.",
      });
    }

    intentosLogin.delete(identificador);
    const token = generarToken(usuario.id);

    res.status(200).json({
      exito: true,
      mensaje: "Sesion iniciada correctamente.",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en iniciarSesion:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error interno del servidor.",
    });
  }
};

const registrarFalloLogin = (identificador, ahora) => {
  const registro = intentosLogin.get(identificador);
  if (!registro || ahora - registro.inicio >= VENTANA_LOGIN_MS) {
    intentosLogin.set(identificador, { inicio: ahora, fallos: 1 });
    return;
  }
  registro.fallos += 1;
};

const solicitarRestablecimiento = async (req, res) => {
  const respuestaGenerica = {
    exito: true,
    mensaje: "Si los datos son correctos, recibirás un enlace de recuperación en tu correo.",
  };

  try {
    const identificador = typeof req.body.identificador === "string"
      ? req.body.identificador.trim().toLowerCase()
      : "";
    const usuario = await Usuario.unscoped().findOne({
      where: { [Op.or]: [{ nombre: identificador }, { email: identificador }] },
    });
    const transportador = obtenerTransportadorCorreo();

    if (!transportador) {
      return res.status(503).json({ exito: false, mensaje: "La recuperación por correo todavía no está configurada en el servidor." });
    }
    if (!usuario || !usuario.email || !transportador) return res.status(200).json(respuestaGenerica);

    const token = crypto.randomBytes(32).toString("hex");
    usuario.tokenRestablecimiento = crypto.createHash("sha256").update(token).digest("hex");
    usuario.tokenRestablecimientoExpira = new Date(Date.now() + 60 * 60 * 1000);
    await usuario.save({ validate: false });

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
    const enlace = `${frontendUrl}/admin?restablecer=${token}`;
    await transportador.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: usuario.email,
      subject: "Restablecer contraseña - Radio Burruyacú",
      text: `Para cambiar tu contraseña, abrí este enlace (vence en 1 hora): ${enlace}`,
      html: `<p>Solicitaste cambiar tu contraseña de Radio Burruyacú.</p><p><a href="${enlace}">Restablecer contraseña</a></p><p>El enlace vence en 1 hora.</p>`,
    });
    return res.status(200).json(respuestaGenerica);
  } catch (error) {
    console.error("Error en solicitarRestablecimiento:", error);
    return res.status(500).json({ exito: false, mensaje: "No se pudo enviar el correo de recuperación." });
  }
};

const restablecerPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (typeof token !== "string" || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ exito: false, mensaje: "El token y una contraseña de al menos 6 caracteres son obligatorios." });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const usuario = await Usuario.unscoped().findOne({
      where: {
        tokenRestablecimiento: tokenHash,
        tokenRestablecimientoExpira: { [Op.gt]: new Date() },
      },
    });
    if (!usuario) return res.status(400).json({ exito: false, mensaje: "El enlace es inválido o ya venció." });

    usuario.password = password;
    usuario.tokenRestablecimiento = null;
    usuario.tokenRestablecimientoExpira = null;
    await usuario.save();
    return res.status(200).json({ exito: true, mensaje: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error en restablecerPassword:", error);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  solicitarRestablecimiento,
  restablecerPassword,
};
