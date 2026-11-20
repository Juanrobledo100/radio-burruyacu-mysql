import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import logoRadio from "../../assets/Logos/logo-radio-transparente.png";
import { useInstallPwa } from "../../hooks/useInstallPwa";

const InstallPwaPrompt = () => {
  const { puedeInstalar, instalar } = useInstallPwa();
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    if (!puedeInstalar) return undefined;
    const temporizador = window.setTimeout(() => setOculto(true), 10000);
    return () => window.clearTimeout(temporizador);
  }, [puedeInstalar]);

  if (!puedeInstalar || oculto) return null;

  return (
    <aside className="fixed bottom-24 right-4 z-[70] w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-white/10 bg-[#111322]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setOculto(true)}
        aria-label="Cerrar aviso de instalación"
        className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-3 pr-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950 p-1 shadow-md shadow-black/30">
          <img src={logoRadio} alt="Logo de Radio Del Rosario 100.7 FM" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white">Radio Del Rosario 100.7 FM</p>
          <p className="mt-1 text-sm leading-snug text-slate-400">
            Instalá la aplicación y escuchá la radio más rápido.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={instalar}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        <Download className="h-4 w-4" />
        Descargar aplicación
      </button>
    </aside>
  );
};

export default InstallPwaPrompt;
