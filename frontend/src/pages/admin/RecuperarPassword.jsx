import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { apiFetch } from "../../config/api";
import logoRadio from "../../assets/Logos/logo-radio-transparente.png";
import { Boton, Campo, entrada, foco } from "./ui";

const RecuperarPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const respuesta = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) throw new Error(datos.mensaje || "No se pudo solicitar la recuperación.");
      setMensaje(datos.mensaje);
    } catch (requestError) {
      setError(requestError.message || "No se pudo solicitar la recuperación.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary-accent/15 blur-[120px]" />
      <div className="relative w-full max-w-[420px]">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-950 p-1">
            <img src={logoRadio} alt="Radio Del Rosario 100.7 FM" className="h-full w-full object-contain" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">Recuperar contraseña</h1>
            <p className="mt-1 text-sm text-slate-400">Te enviaremos un enlace al correo asociado a tu cuenta.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0e1018]/95 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur sm:p-7">
          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {mensaje && <p role="status" className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300">{mensaje}</p>}

          <Campo etiqueta="Correo electrónico">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${entrada} pl-10`} placeholder="tu-correo@ejemplo.com" />
            </div>
          </Campo>

          <Boton type="submit" disabled={cargando} className="w-full py-3">
            {cargando ? "Enviando..." : "Enviar enlace"}
          </Boton>
        </form>

        <Link to="/PanelAdmin" className={`mx-auto mt-5 flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:text-white ${foco}`}>
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al login
        </Link>
      </div>
    </div>
  );
};

export default RecuperarPassword;
