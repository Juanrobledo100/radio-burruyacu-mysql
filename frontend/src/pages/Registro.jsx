import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const entrada =
  "w-full rounded-xl border border-white/10 bg-[#080a14]/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/25";

const Registro = () => {
  const registrar = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmarPassword: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const actualizar = (campo) => (evento) => {
    setForm((actual) => ({ ...actual, [campo]: evento.target.value }));
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setError("");
    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    const resultado = await registrar(form.nombre, form.email, form.password);
    setCargando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje || "No se pudo crear la cuenta.");
      return;
    }
    navigate("/contacto", { replace: true, state: { cuentaCreada: true } });
  };

  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-white/10 bg-[#0b0d1a]/90 p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-accent">Radio Burruyacu</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Crear una cuenta</h1>
        <p className="mt-2 text-sm text-slate-400">
          Registrate para enviar tus consultas y mensajes a la radio.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-slate-300">
            Nombre de usuario
            <span className="relative">
              <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                required
                minLength={3}
                maxLength={100}
                autoComplete="username"
                value={form.nombre}
                onChange={actualizar("nombre")}
                className={`${entrada} pl-10`}
                placeholder="Tu nombre"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-slate-300">
            Correo electrónico
            <span className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                required
                type="email"
                maxLength={255}
                autoComplete="email"
                value={form.email}
                onChange={actualizar("email")}
                className={`${entrada} pl-10`}
                placeholder="nombre@correo.com"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-slate-300">
            Contraseña
            <span className="relative">
              <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                required
                type="password"
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={actualizar("password")}
                className={`${entrada} pl-10`}
                placeholder="Al menos 6 caracteres"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-slate-300">
            Confirmar contraseña
            <input
              required
              type="password"
              minLength={6}
              autoComplete="new-password"
              value={form.confirmarPassword}
              onChange={actualizar("confirmarPassword")}
              className={entrada}
              placeholder="Repetí tu contraseña"
            />
          </label>

          {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {cargando ? "Creando cuenta..." : "Registrarme"}
            {!cargando && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          ¿Ya tenés cuenta?{" "}
          <Link to="/ingresar" className="font-semibold text-primary-accent hover:text-white">
            Ingresá
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Registro;
