import React from "react";
import { Radio, Heart, Newspaper, Music2, Users, Globe, Play, Pause, Loader2 } from "lucide-react";
import { Instagram } from "../components/ui/BrandIcons";
import { useAudio } from "../context/AudioContext";
import nosotrosFondo from "../assets/Fondos/nosotros-fondo.jpg";

const CARACTERISTICAS = [
  { Icono: Newspaper, titulo: "Noticias Locales", desc: "Lo que pasa en Burruyacú y la región.", color: "text-primary-accent", bg: "bg-primary-accent/10", border: "border-primary-accent/25" },
  { Icono: Music2, titulo: "Música", desc: "Los mejores éxitos, las 24 horas.", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/25" },
  { Icono: Users, titulo: "Comunidad", desc: "Siempre cerca de nuestra gente.", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/25" },
  { Icono: Radio, titulo: "En Vivo", desc: "Transmitimos lo que realmente importa.", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/25" },
];

const Nosotros = () => {
  const { isPlaying, isLoading, togglePlay } = useAudio();

  return (
    <div className="w-full flex flex-col gap-16 pb-20 text-left">
      
      <section className="relative isolate rounded-[28px] overflow-hidden border border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.45)] min-h-[680px] sm:min-h-[760px] lg:min-h-[830px] flex flex-col bg-[#0a0d18]">

          <div className="absolute inset-0 z-0">
            <img
              src={nosotrosFondo}
              alt="Estudio de Radio Del Rosario 100.7 FM"
              className="w-full h-full object-cover object-[center_32%] sm:object-[center_38%] lg:object-[center_43%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,16,0.18)_0%,rgba(6,8,16,0.32)_45%,rgba(6,8,16,0.72)_100%),linear-gradient(90deg,rgba(6,8,16,0.72)_0%,rgba(6,8,16,0.32)_42%,rgba(6,8,16,0.05)_68%)]" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-between gap-10 p-6 sm:p-10 md:p-14">

            <div className="flex flex-col lg:flex-row justify-between gap-10">
              <div className="flex flex-col gap-6 max-w-md">
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-[0.95] drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]">
                    SOMOS
                  </span>
                  <span className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-primary-accent via-pink-400 to-purple-400 bg-clip-text text-transparent leading-[0.95]">
                    LA VOZ
                  </span>
                  <div className="flex items-center gap-3 my-2.5">
                    <span className="w-8 h-[2px] bg-white/40" />
                    <span className="text-base sm:text-xl font-bold text-white/80 tracking-[0.3em]">DE</span>
                    <span className="w-8 h-[2px] bg-white/40" />
                  </div>
                  <span className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[0.95] drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]">
                    BURRUYACÚ
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mt-4 leading-relaxed">
                    Información, música y compañía, siempre junto a vos, donde estés.
                  </p>

                  <div className="flex items-end gap-[3px] h-4 w-fit opacity-80 mt-4">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-[3px] rounded-full bg-gradient-to-t from-primary-accent to-purple-400 animate-wave-${(i % 5) + 1}`}
                        style={{ height: `${5 + (i % 4) * 3}px` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {CARACTERISTICAS.map(({ Icono, titulo, desc, color, bg, border }) => (
                    <div key={titulo} className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${bg} ${border} ${color}`}>
                        <Icono className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{titulo}</h4>
                        <p className="text-[11px] text-slate-300 leading-snug mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:self-center lg:text-right shrink-0">
                <p className="italic text-slate-200 text-lg sm:text-2xl leading-snug">
                  Más que una radio,<br />somos parte<br />de tu día.
                </p>
              </div>
            </div>

            <div className="glass max-w-xs w-full sm:w-auto p-5 rounded-2xl border border-primary-accent/30 shadow-lg flex flex-col gap-1.5 bg-black/40">
              <span className="flex items-center gap-2 text-primary-accent font-bold text-sm">
                <Heart className="w-4 h-4 fill-current" /> Gracias por elegirnos cada día
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tu compañía nos inspira a seguir creciendo.
              </p>
            </div>
          </div>
        </section>

      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="glass rounded-2xl border border-white/5 p-4 flex items-center gap-3">
            <Radio className="w-5 h-5 text-primary-accent shrink-0" />
            <div>
              <p className="text-sm font-bold text-white leading-none">100.7 FM</p>
              <p className="text-[10px] text-slate-400 mt-1">Sintonizanos</p>
            </div>
          </div>
          <div className="glass rounded-2xl border border-white/5 p-4 flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary-accent shrink-0" />
            <div>
              <p className="text-sm font-bold text-white leading-none">Online</p>
              <p className="text-[10px] text-slate-400 mt-1">Escuchanos desde la web</p>
            </div>
          </div>
          <div className="glass rounded-2xl border border-white/5 p-4 flex items-center gap-3">
            <Instagram className="w-5 h-5 text-primary-accent shrink-0" />
            <div>
              <p className="text-sm font-bold text-white leading-none">Redes</p>
              <p className="text-[10px] text-slate-400 mt-1">Seguinos y enterate de todo</p>
            </div>
          </div>
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="col-span-2 lg:col-span-1 relative rounded-2xl overflow-hidden p-[1.5px] bg-gradient-to-r from-fuchsia-500 via-primary-accent to-purple-500 shadow-lg shadow-primary-accent/20 hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer disabled:opacity-60"
          >
            <div className="flex items-center gap-3 h-full w-full rounded-2xl bg-[#0b0b12]/95 px-4 py-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 via-primary-accent to-purple-500 text-white shrink-0">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-[1px]" />
                )}
              </span>
              <div className="text-left">
                <p className="text-xs font-extrabold text-white uppercase tracking-wide leading-none">
                  {isPlaying ? "En vivo" : "Escuchanos en vivo"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Donde estés, cuando quieras.</p>
              </div>
            </div>
          </button>
        </div>

      <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="hidden sm:flex items-end gap-[3px] h-6 flex-1 max-w-[220px] justify-end opacity-60">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-full bg-gradient-to-t from-primary-accent to-purple-400 animate-wave-${(i % 5) + 1}`}
                style={{ height: `${6 + (i % 5) * 4}px` }}
              />
            ))}
          </div>
          <p className="text-center text-[11px] sm:text-sm font-bold tracking-[0.12em] sm:tracking-[0.25em] text-slate-300 uppercase break-words">
            Radio Del Rosario 100.7 FM <span className="text-primary-accent mx-2">•</span> Burruyacú, Tucumán
          </p>
          <div className="hidden sm:flex items-end gap-[3px] h-6 flex-1 max-w-[220px] opacity-60">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-full bg-gradient-to-t from-primary-accent to-purple-400 animate-wave-${(i % 5) + 1}`}
                style={{ height: `${6 + (i % 5) * 4}px` }}
              />
            ))}
          </div>
        </div>

      <div className="h-[1px] w-full bg-white/5" />

    </div>
  );
};

export default Nosotros;