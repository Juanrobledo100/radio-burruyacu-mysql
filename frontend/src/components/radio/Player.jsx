import React from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, Radio } from "lucide-react";
import { useAudio } from "../../context/AudioContext";
import { useRadioConfig } from "../../context/RadioConfigContext";

const Player = ({ minimal = false, navbar = false }) => {
  const { configRadio } = useRadioConfig();
  const nombreRadio = configRadio?.nombre || "Radio Del Rosario 100.7 FM";
  const {
    isPlaying,
    volume,
    isMuted,
    isLoading,
    togglePlay,
    changeVolume,
    toggleMute,
  } = useAudio();

  const handleVolumeChange = (e) => {
    changeVolume(parseFloat(e.target.value));
  };

  if (navbar) {
    return (
      <button
        onClick={togglePlay}
        className="group relative flex items-center gap-2 p-[1.5px] rounded-full bg-gradient-to-r from-fuchsia-500 via-primary-accent to-amber-400 shadow-lg shadow-primary-accent/20 hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer disabled:opacity-60 disabled:cursor-wait shrink-0"
      >
        <span className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-[#0b0b12]/95 backdrop-blur-md">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500 via-primary-accent to-amber-400 text-white shrink-0">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Radio className="w-3.5 h-3.5" />
            )}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white whitespace-nowrap">
            {isPlaying ? (
              <>
                <span className="flex items-end gap-[2px] h-3">
                  <span className="w-[2px] bg-white animate-wave-1 rounded-full" style={{ height: "6px" }}></span>
                  <span className="w-[2px] bg-white animate-wave-2 rounded-full" style={{ height: "12px" }}></span>
                  <span className="w-[2px] bg-white animate-wave-3 rounded-full" style={{ height: "8px" }}></span>
                </span>
                En vivo
              </>
            ) : (
              "Escuchar en vivo"
            )}
          </span>
        </span>
      </button>
    );
  }

  if (minimal) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-accent text-white hover:bg-primary-hover transition-colors shadow-md shadow-primary-accent/20 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-[1px]" />
          )}
        </button>
        
        {isPlaying && (
          <div className="flex items-end gap-[3px] h-5 px-1">
            <span className="w-[3px] bg-primary-accent animate-wave-1 rounded-full"></span>
            <span className="w-[3px] bg-primary-accent animate-wave-2 rounded-full"></span>
            <span className="w-[3px] bg-primary-accent animate-wave-3 rounded-full"></span>
            <span className="w-[3px] bg-primary-accent animate-wave-4 rounded-full"></span>
            <span className="w-[3px] bg-primary-accent animate-wave-5 rounded-full"></span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary-accent to-primary-hover text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-accent/30 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-[1px]" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">En vivo</p>
            <p className="text-base font-bold text-white truncate">{nombreRadio}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={toggleMute}
            className="flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
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
            onChange={handleVolumeChange}
            className="w-20 accent-primary-accent bg-slate-700 rounded-lg appearance-none h-1.5 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-slate-950/35 border border-white/10">
        {isPlaying ? (
          <div className="flex items-end gap-[4px] h-8 w-full max-w-[220px] justify-center">
            <span className="w-[4px] h-3 bg-primary-accent animate-wave-1 rounded-full"></span>
            <span className="w-[4px] h-5 bg-pink-400 animate-wave-2 rounded-full"></span>
            <span className="w-[4px] h-8 bg-primary-accent animate-wave-3 rounded-full"></span>
            <span className="w-[4px] h-5 bg-pink-500 animate-wave-4 rounded-full"></span>
            <span className="w-[4px] h-7 bg-primary-accent animate-wave-5 rounded-full"></span>
            <span className="w-[4px] h-4 bg-pink-400 animate-wave-2 rounded-full"></span>
            <span className="w-[4px] h-6 bg-primary-accent animate-wave-1 rounded-full"></span>
            <span className="w-[4px] h-3 bg-pink-500 animate-wave-4 rounded-full"></span>
            <span className="w-[4px] h-5 bg-primary-accent animate-wave-3 rounded-full"></span>
            <span className="w-[4px] h-8 bg-pink-400 animate-wave-2 rounded-full"></span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-600"></span>
            Pausado
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
