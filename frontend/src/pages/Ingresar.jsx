import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

const entrada =
  "w-full rounded-xl border border-white/10 bg-[#080a14]/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/25";

const Ingresar = () => {
  const iniciarSesion = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setError("");
    setCargando(true);
    const resultado = await iniciarSesion(nombre, password);
    setCargando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje || "No se pudo iniciar sesión.");
      return;
    }
    navigate(resultado.usuario?.rol === "admin" ? "/PanelAdmin" : "/contacto", { replace: true });
  };

  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-md items-center px-4 py-12">
      <div className="w-full rounded-2xl border border-white/10 bg-[#0b0d1a]/90 p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-accent">Radio Burruyacu</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Ingresar</h1>
        <p className="mt-2 text-sm text-slate-400">
          Iniciá sesión con tu cuenta de usuario o administrador.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-slate-300">
            Usuario
            <span className="relative">
              <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                required
                autoComplete="username"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                className={`${entrada} pl-10`}
                placeholder="Tu nombre de usuario"
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
                autoComplete="current-password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                className={`${entrada} pl-10`}
                placeholder="Tu contraseña"
              />
            </span>
          </label>

          {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
            {!cargando && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link to="/PanelAdmin/recuperar" className="font-semibold text-primary-accent hover:text-white">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        <p className="mt-5 text-center text-sm text-slate-400">
          ¿Todavía no tenés cuenta?{" "}
          <Link to="/registro" className="font-semibold text-primary-accent hover:text-white">
            Registrate
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Ingresar;
