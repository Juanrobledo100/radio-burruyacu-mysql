import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import Hls from "hls.js";

const AudioContext = createContext();

const resolverUrlStream = (url) => {
  try {
    const urlAnalizada = new URL(url);
    if (urlAnalizada.hostname === "fmdelrosario1007.escuchanos.online") {
      return "https://streaming.escuchanosonline.com:7345/stream";
    }
  } catch {
    return url;
  }
  return url;
};

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  const usuarioDetuvoRef = useRef(false);
  const reproduccionSolicitadaRef = useRef(false);
  const operacionAudioRef = useRef(0);

  const limpiarFuente = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "none";
    
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => {
      if (!reproduccionSolicitadaRef.current) return;
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("loadstart", handleLoadStart);
    audioRef.current.addEventListener("canplay", handleCanPlay);
    audioRef.current.addEventListener("playing", handlePlaying);
    audioRef.current.addEventListener("error", handleError);

    return () => {
      limpiarFuente();
      if (audioRef.current) {
        audioRef.current.pause();
        limpiarFuente();
        audioRef.current.removeEventListener("loadstart", handleLoadStart);
        audioRef.current.removeEventListener("canplay", handleCanPlay);
        audioRef.current.removeEventListener("playing", handlePlaying);
        audioRef.current.removeEventListener("error", handleError);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!streamUrl || usuarioDetuvoRef.current) return;
    setIsLoading(true);
    reproducirStream();

    const reintentarConInteraccion = () => {
      if (!usuarioDetuvoRef.current && !isPlaying) {
        setIsLoading(true);
        reproducirStream();
      }
    };

    document.addEventListener("pointerdown", reintentarConInteraccion, { once: true });
    document.addEventListener("keydown", reintentarConInteraccion, { once: true });

    return () => {
      document.removeEventListener("pointerdown", reintentarConInteraccion);
      document.removeEventListener("keydown", reintentarConInteraccion);
    };
  }, [streamUrl]);

  const reproducirStream = () => {
    const audio = audioRef.current;
    if (!audio || !streamUrl || reproduccionSolicitadaRef.current) return;

    reproduccionSolicitadaRef.current = true;
    const operacionActual = ++operacionAudioRef.current;
    limpiarFuente();
    const urlAudio = resolverUrlStream(streamUrl);
    const esHls = /\.m3u8(?:$|[?#])/i.test(urlAudio);

    const iniciarAudio = () => {
      if (operacionActual !== operacionAudioRef.current || !reproduccionSolicitadaRef.current) return;

      audio.play()
        .then(() => {
          if (operacionActual === operacionAudioRef.current && reproduccionSolicitadaRef.current) {
            setIsPlaying(true);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (operacionActual !== operacionAudioRef.current) return;
          console.error("Error al iniciar reproducción:", err);
          reproduccionSolicitadaRef.current = false;
          setIsPlaying(false);
          setIsLoading(false);
        });
    };

    if (esHls && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.attachMedia(audio);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        if (operacionActual !== operacionAudioRef.current) return;
        hls.loadSource(urlAudio);
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        iniciarAudio();
      });
      hls.on(Hls.Events.ERROR, (_evento, datos) => {
        if (datos.fatal && operacionActual === operacionAudioRef.current) {
          console.error("Error fatal del stream HLS:", datos);
          hls.destroy();
          hlsRef.current = null;
          reproduccionSolicitadaRef.current = false;
          setIsPlaying(false);
          setIsLoading(false);
        }
      });
      return;
    }

    audio.src = urlAudio;
    audio.load();
    iniciarAudio();
  };

  const togglePlay = () => {
    if (!streamUrl) return;

    if (isPlaying || reproduccionSolicitadaRef.current) {
      usuarioDetuvoRef.current = true;
      operacionAudioRef.current += 1;
      reproduccionSolicitadaRef.current = false;
      audioRef.current.pause();
      limpiarFuente();
      audioRef.current.src = "";
      audioRef.current.load();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      usuarioDetuvoRef.current = false;
      setIsLoading(true);
      reproducirStream();
    }
  };

  const changeVolume = (newVolume) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (vol > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        volume,
        isMuted,
        streamUrl,
        isLoading,
        setStreamUrl,
        togglePlay,
        changeVolume,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
