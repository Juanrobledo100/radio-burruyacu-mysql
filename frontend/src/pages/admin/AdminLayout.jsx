import React, { useCallback, useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { assetUrl } from "../../config/api";
import logoRadio from "../../assets/Logos/logo-radio-transparente.png";
import { useAdminData } from "./useAdminData";
import { SECCIONES, seccionDePath } from "./utils";
import { Aviso, BotonIcono, DialogoConfirmacion, foco } from "./ui";

const AdminShell = () => {
  const { token, usuario, logout } = useAuthStore();
  const { pathname } = useLocation();
  const datos = useAdminData(token, usuario?.rol);
  const { noticias, mensajes, configRadio } = datos;

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  const avisar = useCallback((texto, tipo = "ok") => setAviso({ texto, tipo, id: Date.now() }), []);
  const confirmar = useCallback((opciones) => setConfirmacion(opciones), []);
  const cerrarAviso = useCallback(() => setAviso(null), []);
  const cerrarConfirmacion = useCallback(() => setConfirmacion(null), []);

  useEffect(() => setMenuAbierto(false), [pathname]);
  useEffect(() => {
    const alTeclear = (e) => e.key === "Escape" && setMenuAbierto(false);
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, []);

  const seccion = seccionDePath(pathname);
  const nombreUsuario = usuario?.nombre || usuario?.usuario || usuario?.username || "Administrador";
  const cuentas = { "/PanelAdmin/noticias": noticias.length, "/PanelAdmin/mensajes": mensajes.length };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      {menuAbierto && <button type="button" aria-label="Cerrar menú" onClick={() => setMenuAbierto(false)} className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/[0.06] bg-[#0a0b11] transition-transform duration-200 lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:w-auto lg:translate-x-0 ${menuAbierto ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 p-0.5 ring-1 ring-white/10">
            <img src={configRadio.logoUrl ? assetUrl(configRadio.logoUrl) : logoRadio} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = logoRadio; }} alt="" className="h-full w-full object-contain" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{configRadio.nombre || "Radio Del Rosario 100.7 FM"}</p>
            <p className="text-xs text-slate-500">Administración</p>
          </div>
          <button type="button" onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú" className={`ml-auto rounded-lg p-1.5 text-slate-400 hover:text-white lg:hidden ${foco}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Secciones del panel">
          <ul className="flex flex-col gap-1">
            {SECCIONES.map(({ ruta, fin, label, Icono }) => (
              <li key={ruta}>
                <NavLink
                  to={ruta}
                  end={Boolean(fin)}
                  className={({ isActive }) => `relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${foco} ${isActive ? "bg-white/[0.07] text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"}`}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-primary-accent" />}
                      <Icono className={`h-[18px] w-[18px] ${isActive ? "text-primary-accent" : ""}`} />
                      {label}
                      {cuentas[ruta] > 0 && <span className="ml-auto rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] font-semibold text-slate-300">{cuentas[ruta]}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 border-t border-white/[0.06] p-4">
          <a href="/" target="_blank" rel="noreferrer" className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white ${foco}`}>
            <ExternalLink className="h-4 w-4" /> Ver sitio web
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-accent/15 text-sm font-bold uppercase text-primary-accent">{nombreUsuario.charAt(0)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{nombreUsuario}</p>
              <p className="flex items-center gap-1.5 text-[11px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Sesión activa</p>
            </div>
            <BotonIcono etiqueta="Cerrar sesión" onClick={logout}><LogOut className="h-4 w-4" /></BotonIcono>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/[0.06] bg-[#07080d]/85 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
          <button type="button" onClick={() => setMenuAbierto(true)} aria-label="Abrir menú" className={`rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden ${foco}`}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-white sm:text-xl">{seccion.titulo}</h1>
            <p className="hidden truncate text-xs text-slate-400 sm:block">{seccion.sub}</p>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 pb-16 sm:px-6 lg:px-8 lg:py-8">
          <Outlet context={{ token, nombreUsuario, ...datos, avisar, confirmar }} />
        </main>
      </div>

      <DialogoConfirmacion confirmacion={confirmacion} onCerrar={cerrarConfirmacion} />
      <Aviso aviso={aviso} onCerrar={cerrarAviso} />
    </div>
  );
};

const AdminLayout = () => {
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  const usuario = useAuthStore((state) => state.usuario);
  return (
    <div className="min-h-screen bg-dark-deep text-slate-100">
      {!estaAutenticado ? (
        <Navigate to="/ingresar" replace />
      ) : usuario?.rol === "admin" ? (
        <AdminShell />
      ) : (
        <Navigate to="/contacto" replace />
      )}
    </div>
  );
};

export default AdminLayout;
