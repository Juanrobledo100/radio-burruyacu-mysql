import React from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import Player from "../radio/Player";
import { assetUrl } from "../../config/api";
import { useRadioConfig } from "../../context/RadioConfigContext";
import { useAuthStore } from "../../stores/authStore";
import logoRadioFallback from "../../assets/Logos/logo-radio-transparente.png";

export const ENLACES_PRINCIPALES = [
  { ruta: "/", label: "Inicio" },
  { ruta: "/noticias", label: "Noticias" },
  { ruta: "/nosotros", label: "Nosotros" },
  { ruta: "/contacto", label: "Contacto" },
];

const Header = () => {
  const { configRadio } = useRadioConfig();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="w-full glass sticky top-0 z-50 px-3 sm:px-4 md:px-8 py-2.5 md:py-3 flex items-center justify-between gap-2 border-b border-white/5">
      <Link to="/" aria-label="Ir al inicio" className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer group">
        <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-full bg-slate-950 flex items-center justify-center text-white shadow-md shadow-black/30 group-hover:scale-105 transition-transform overflow-hidden">
          <img
            src={configRadio?.logoUrl ? assetUrl(configRadio.logoUrl) : logoRadioFallback}
            alt="Logo de Radio Del Rosario 100.7 FM"
            onError={(evento) => {
              evento.currentTarget.onerror = null;
              evento.currentTarget.src = logoRadioFallback;
            }}
            className="h-full w-full object-contain p-0.5"
          />
        </div>
        <div className="min-w-0">
          <span className="font-extrabold text-sm sm:text-lg tracking-wider text-white uppercase group-hover:text-primary-accent transition-colors">
            Radio
          </span>
          <span className="font-light text-xs sm:text-sm tracking-wider text-slate-300 block -mt-0.5 sm:-mt-1">
            Del Rosario 100.7 FM
          </span>
        </div>
      </Link>

      <nav className="hidden lg:flex items-center gap-6" aria-label="Principal">
        {ENLACES_PRINCIPALES.map((item) => (
          <NavLink
            key={item.ruta}
            to={item.ruta}
            end={item.ruta === "/"}
            className={({ isActive }) =>
              `font-medium text-sm tracking-wide transition-all relative py-1 ${
                isActive ? "text-primary-accent" : "text-slate-300 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-accent rounded-full animate-fade-in" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:flex items-center gap-3">
        {usuario ? (
          <>
            <Link to="/contacto" className="max-w-32 truncate text-sm text-slate-300 hover:text-white">
              {usuario.nombre}
            </Link>
            {usuario.rol === "admin" && (
              <Link to="/PanelAdmin" className="text-sm font-semibold text-primary-accent hover:text-white">
                Panel
              </Link>
            )}
            <button
              type="button"
              onClick={logout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <Link to="/ingresar" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Ingresar
            </Link>
            <Link
              to="/registro"
              className="rounded-lg bg-primary-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Registrarme
            </Link>
          </>
        )}
      </div>

      <div className="hidden lg:flex items-center">
        <Player navbar />
      </div>

      <div className="flex lg:hidden items-center gap-2 shrink-0">
        <Player minimal />
      </div>
    </header>
  );
};

export default Header;
