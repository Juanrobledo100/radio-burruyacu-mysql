import React from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useAudio } from "../../context/AudioContext";
import { useRadioConfig } from "../../context/RadioConfigContext";

const BARRAS = [10, 18, 26, 16, 24, 30, 20, 14, 22, 28, 18, 12, 20, 26, 16, 10, 22, 18];

const EnVivoAhora = () => {
  const { configRadio } = useRadioConfig();
  const {
    isPlaying,
    volume,
    isMuted,
    isLoading,
    togglePlay,
    changeVolume,
    toggleMute,
  } = useAudio();

  return (
    <div className="glass rounded-3xl p-5 flex flex-col gap-4 border border-white/5 shadow-xl">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-accent">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-accent" />
          </span>
          En vivo ahora
        </span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300 tracking-wider">HD</span>
      </div>

      <div>
        <h3 className="text-lg font-extrabold text-white leading-none">
          {configRadio?.nombre || "Radio Del Rosario 100.7 FM"}
        </h3>
        <p className="text-xs text-slate-400 mt-1">La voz de nuestra gente</p>
      </div>

      <div className="h-16 w-full flex items-end justify-center gap-[3px] rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 overflow-hidden">
        {BARRAS.map((alto, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full transition-all duration-300 ${
              isPlaying
                ? `bg-gradient-to-t from-primary-accent to-pink-400 animate-wave-${(i % 5) + 1}`
                : "bg-slate-700"
            }`}
            style={!isPlaying ? { height: "4px" } : { minHeight: `${alto}px` }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-primary-accent to-pink-500 text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-accent/30 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-[1px]" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          aria-label="Activar o silenciar volumen"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-primary-accent" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          className="flex-1 min-w-0 accent-primary-accent bg-slate-700 rounded-lg appearance-none h-1.5 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default EnVivoAhora;
