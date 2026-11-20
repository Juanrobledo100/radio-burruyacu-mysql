import { useEffect, useRef, useState } from "react";
import { Headphones, Smartphone, Share, X, MoreVertical, SquarePlus, Download } from "lucide-react";
import { useInstallPwa } from "../../hooks/useInstallPwa";


const PASOS = {
  ios: {
    titulo: "Instalar en iPhone o iPad",
    pasos: [
      { Icono: Share, texto: "Abrí la versión publicada del sitio en Safari y tocá Compartir. La dirección debe usar HTTPS." },
      { Icono: SquarePlus, texto: "Elegí “Agregar a pantalla de inicio”. Si aparece “Abrir como app web”, activalo." },
      { Icono: Download, texto: "Tocá “Agregar”. El icono de Radio Rosario aparecerá en tu pantalla de inicio." },
    ],
  },
  otros: {
    titulo: "Instalar en Android o computadora",
    pasos: [
      { Icono: MoreVertical, texto: "Abrí esta página en Chrome o Edge. Si estás en VS Code, copiá la dirección y pegala en uno de esos navegadores." },
      { Icono: SquarePlus, texto: "Tocá “Instalar aplicación” o “Agregar a pantalla de inicio”." },
      { Icono: Download, texto: "Confirmá y abrí la radio desde tu pantalla de inicio." },
    ],
  },
};

const GuiaInstalacion = ({ tipo, onCerrar }) => {
  const botonCerrar = useRef(null);
  const guia = PASOS[tipo];

  useEffect(() => {
    botonCerrar.current?.focus();
    const alTeclear = (e) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="guia-instalacion-titulo">
      <button type="button" aria-label="Cerrar" onClick={onCerrar} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-3xl border border-fuchsia-500/30 bg-[#0d0a1c] p-6 shadow-[0_0_60px_rgba(168,85,247,0.25)]">
        <button ref={botonCerrar} type="button" onClick={onCerrar} aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <h3 id="guia-instalacion-titulo" className="pr-8 text-lg font-bold text-white">{guia.titulo}</h3>
        <ol className="mt-5 flex flex-col gap-4">
          {guia.pasos.map(({ Icono, texto }, i) => (
            <li key={texto} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-300">
                <Icono className="h-4 w-4" />
              </span>
              <p className="pt-1.5 text-sm leading-snug text-slate-300"><span className="font-semibold text-white">{i + 1}. </span>{texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const BannerAppRadio = () => {
  const { puedeInstalar, instalada, esIOS, instalar } = useInstallPwa();
  const [guia, setGuia] = useState(null);
  const [mensajeNoInstalacion, setMensajeNoInstalacion] = useState("");

  if (instalada) return null;

  const iniciarInstalacion = async () => {
    const esPuertoLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname);
    if (!window.isSecureContext && !esPuertoLocal) {
      setMensajeNoInstalacion(
        esIOS
          ? "Para agregar la aplicación a la pantalla de inicio del iPhone, el sitio publicado debe usar HTTPS."
          : "Para instalar la aplicación, abrí la versión publicada del sitio con HTTPS."
      );
      setGuia(null);
      return;
    }

    if (esIOS) {
      setMensajeNoInstalacion("");
      setGuia("ios");
      return;
    }

    if (!puedeInstalar) {
      setMensajeNoInstalacion("Este navegador no ofrece la instalación directa. Abrí la página en Chrome o Edge y seguí estos pasos.");
      setGuia("otros");
      return;
    }

    const resultado = await instalar();
    if (resultado === "no-disponible") {
      setMensajeNoInstalacion("No se pudo abrir la instalación en este navegador. Probá desde el menú de Chrome o Edge.");
      setGuia("otros");
      return;
    }
    setMensajeNoInstalacion("");
  };

  const botonBase =
    "group flex min-w-[210px] items-center gap-3 rounded-2xl border border-white/25 bg-black/70 px-5 py-2.5 text-left transition hover:border-fuchsia-400/70 hover:bg-black hover:shadow-[0_0_24px_rgba(217,70,239,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400";

  return (
    <section aria-label="Instalar la app de Radio Del Rosario 100.7 FM" className="w-full px-4 pb-6 pt-10 md:px-8">
      <div className="relative mx-auto max-w-6xl rounded-[40px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-primary-accent p-[1.5px] shadow-[0_0_45px_rgba(217,70,239,0.25)]">
        <div className="relative overflow-hidden rounded-[39px] bg-[#0a0716] px-6 py-6 sm:px-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 items-end justify-end gap-[5px] pr-6 opacity-30 md:flex">
            {Array.from({ length: 22 }).map((_, i) => (
              <span key={i} className={`w-[3px] rounded-full bg-gradient-to-t from-primary-accent to-violet-400 motion-reduce:animate-none animate-wave-${(i % 5) + 1}`} style={{ height: `${8 + (i % 6) * 5}px` }} />
            ))}
          </div>

          <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:text-left">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-fuchsia-400/80 text-fuchsia-300 shadow-[0_0_30px_rgba(217,70,239,0.55),inset_0_0_20px_rgba(217,70,239,0.25)]">
                <Headphones className="h-9 w-9" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">Llevá Radio Del Rosario 100.7 FM a todos lados</h2>
                <p className="mt-1 max-w-md text-sm text-slate-300">Instalá la app y escuchanos en vivo desde tu celular o tu computadora.</p>
              </div>
            </div>

            {mensajeNoInstalacion && (
              <p className="max-w-md rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-left text-xs text-amber-100">
                {mensajeNoInstalacion}
              </p>
            )}

            <div className="relative flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={iniciarInstalacion} className={botonBase}>
                {esIOS ? (
                  <Share className="h-7 w-7 shrink-0 text-white" />
                ) : (
                  <Smartphone className="h-7 w-7 shrink-0 text-white" />
                )}
                <span className="flex flex-col leading-tight">
                  <span className="text-[10px] text-slate-300">
                    {esIOS ? "Agregar a inicio en" : "Instalar app en"}
                  </span>
                  <span className="text-base font-semibold text-white">
                    {esIOS ? "iPhone y iPad" : "Android y PC"}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {guia && <GuiaInstalacion tipo={guia} onCerrar={() => setGuia(null)} />}
    </section>
  );
};

export default BannerAppRadio;
