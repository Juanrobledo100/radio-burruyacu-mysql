import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Newspaper, Info, Mail, Play, Pause, Loader2, UserRound } from "lucide-react";
import { useAudio } from "../../context/AudioContext";
import { useAuthStore } from "../../stores/authStore";

const MobileNav = () => {
  const { isPlaying, isLoading, togglePlay } = useAudio();
  const usuario = useAuthStore((state) => state.usuario);

  const navItems = [
    { id: "inicio", ruta: "/", label: "Inicio", Icon: Home },
    { id: "noticias", ruta: "/noticias", label: "Noticias", Icon: Newspaper },
    { id: "play-central", label: "Reprod.", isPlayButton: true },
    { id: "nosotros", ruta: "/nosotros", label: "Nosotros", Icon: Info },
    { id: "contacto", ruta: "/contacto", label: "Contacto", Icon: Mail },
    { id: "cuenta", ruta: usuario ? "/contacto" : "/registro", label: usuario ? "Mi cuenta" : "Registro", Icon: UserRound },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full glass border-t border-white/5 z-50 px-2 sm:px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        if (item.isPlayButton) {
          return (
            <div key={item.id} className="relative -mt-6">
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-primary-accent to-pink-500 text-white shadow-lg shadow-primary-accent/40 border-4 border-[#08090d] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current translate-x-[1px]" />
                )}
              </button>
            </div>
          );
        }

        const Icon = item.Icon;

        return (
          <NavLink
            key={item.id}
            to={item.ruta}
            end={item.ruta === "/"}
            className="flex flex-col items-center gap-1 py-1 transition-colors"
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary-accent scale-110" : "text-slate-400"}`} />
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? "text-primary-accent" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileNav;
