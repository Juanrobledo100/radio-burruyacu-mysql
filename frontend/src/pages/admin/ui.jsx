import React, { useEffect } from "react";
import { AlertCircle, CheckCircle2, Newspaper, ShieldAlert } from "lucide-react";


export const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60";
export const entrada =
  "w-full rounded-xl border border-white/10 bg-[#0a0c13] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 transition focus:border-primary-accent/70 focus:outline-none focus:ring-2 focus:ring-primary-accent/20";

export const Tarjeta = ({ className = "", children }) => (
  <section className={`rounded-2xl border border-white/[0.07] bg-[#0e1018] ${className}`}>{children}</section>
);

export const EncabezadoTarjeta = ({ titulo, descripcion, accion }) => (
  <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
    <div className="min-w-0">
      <h3 className="text-sm font-semibold text-white">{titulo}</h3>
      {descripcion && <p className="mt-0.5 text-xs text-slate-400">{descripcion}</p>}
    </div>
    {accion}
  </div>
);

const VARIANTES = {
  primario: "bg-primary-accent text-white shadow-[0_8px_20px_rgba(255,46,99,0.25)] hover:bg-primary-hover",
  secundario: "border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.09] hover:text-white",
  peligro: "border border-rose-500/25 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
};

export const Boton = ({ variante = "primario", className = "", children, ...props }) => (
  <button
    type="button"
    {...props}
    className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${foco} ${VARIANTES[variante]} ${className}`}
  >
    {children}
  </button>
);

export const BotonIcono = ({ etiqueta, tono = "neutro", className = "", children, ...props }) => (
  <button
    type="button"
    title={etiqueta}
    aria-label={etiqueta}
    {...props}
    className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition ${foco} ${
      tono === "peligro"
        ? "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
        : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.09] hover:text-white"
    } ${className}`}
  >
    {children}
  </button>
);

export const Campo = ({ etiqueta, ayuda, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-xs font-medium text-slate-300">{etiqueta}</span>
    {children}
    {ayuda && <span className="text-[11px] text-slate-500">{ayuda}</span>}
  </label>
);

const TONOS = {
  verde: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  ambar: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  rosa: "border-primary-accent/30 bg-primary-accent/10 text-primary-accent",
  gris: "border-white/10 bg-white/[0.04] text-slate-300",
};

export const Insignia = ({ tono = "gris", children }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${TONOS[tono]}`}>{children}</span>
);

export const EstadoVacio = ({ Icono, titulo, texto, accion }) => (
  <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400">
      <Icono className="h-5 w-5" />
    </span>
    <div>
      <p className="text-sm font-semibold text-white">{titulo}</p>
      <p className="mx-auto mt-1 max-w-xs text-xs text-slate-400">{texto}</p>
    </div>
    {accion}
  </div>
);

export const Miniatura = ({ src, alt = "", className = "h-11 w-11" }) =>
  src ? (
    <img src={src} alt={alt} className={`${className} shrink-0 rounded-lg bg-slate-900 object-cover`} />
  ) : (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-slate-600`}>
      <Newspaper className="h-4 w-4" />
    </span>
  );

export const fechaCorta = (f) =>
  f ? new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }) : "";

export const saludo = () => {
  const h = new Date().getHours();
  if (h < 6) return "Buenas noches";
  if (h < 13) return "Buen día";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
};

export const DialogoConfirmacion = ({ confirmacion, onCerrar }) => {
  useEffect(() => {
    if (!confirmacion) return undefined;
    const alTeclear = (e) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [confirmacion, onCerrar]);

  if (!confirmacion) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirmar-titulo">
      <button type="button" aria-label="Cancelar" onClick={onCerrar} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e1018] p-6 shadow-2xl">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/10 text-rose-300"><ShieldAlert className="h-5 w-5" /></span>
        <h3 id="confirmar-titulo" className="mt-4 text-base font-bold text-white">{confirmacion.titulo}</h3>
        <p className="mt-1.5 text-sm text-slate-400">{confirmacion.texto}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Boton variante="secundario" autoFocus onClick={onCerrar}>Cancelar</Boton>
          <Boton variante="peligro" onClick={() => { const accion = confirmacion.accion; onCerrar(); accion(); }}>{confirmacion.boton}</Boton>
        </div>
      </div>
    </div>
  );
};

export const Aviso = ({ aviso, onCerrar }) => {
  useEffect(() => {
    if (!aviso) return undefined;
    const t = window.setTimeout(onCerrar, 3800);
    return () => window.clearTimeout(t);
  }, [aviso, onCerrar]);

  if (!aviso) return null;
  const error = aviso.tipo === "error";
  return (
    <div role="status" aria-live="polite" className={`fixed bottom-5 left-1/2 z-[70] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur lg:left-auto lg:right-6 lg:translate-x-0 ${error ? "border-rose-500/30 bg-[#1a0d12]/95 text-rose-200" : "border-emerald-500/30 bg-[#0b1713]/95 text-emerald-200"}`}>
      {error ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
      {aviso.texto}
    </div>
  );
};
