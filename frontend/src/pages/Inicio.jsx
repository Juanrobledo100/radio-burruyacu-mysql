import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import Player from "../components/radio/Player";
import NoticiasCarrusel from "../components/noticias/NoticiasCarrusel";
import { useAudio } from "../context/AudioContext";
import { useRadioConfig } from "../context/RadioConfigContext";
import { apiFetch, assetUrl } from "../config/api";
import videoHeroLocal from "../assets/VID-20260821-WA0048.mp4";

const BANNER_VIDEO_LOCAL = {
  _id: "video-hero-local",
  titulo: "Radio Del Rosario 100.7 FM | En vivo",
  subtitulo: "La voz de Burruyacu, siempre junto a vos.",
  tipoMedia: "video",
  mediaUrl: videoHeroLocal,
  linkAccion: "",
  textoBoton: "",
};

const Inicio = () => {
  const navigate = useNavigate();
  const { configRadio } = useRadioConfig();
  const nombreRadio = configRadio?.nombre || "Radio Del Rosario 100.7 FM";
  const [noticias, setNoticias] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannerActivo, setBannerActivo] = useState(0);
  const [cargandoNoticias, setCargandoNoticias] = useState(true);
  const [cargandoBanners, setCargandoBanners] = useState(true);

  const carruselRef = useRef(null);
  const heroMediaRef = useRef(null);

  const { isPlaying, isLoading, togglePlay, isMuted, toggleMute } = useAudio();

  useEffect(() => {
    apiFetch("/api/noticias")
      .then((res) => res.json())
      .then((data) => {
        if (data.exito) {
          setNoticias(data.datos);
        }
        setCargandoNoticias(false);
      })
      .catch((err) => {
        console.error("Error al cargar noticias:", err);
        setCargandoNoticias(false);
      });
  }, []);

  useEffect(() => {
    apiFetch("/api/hero")
      .then((res) => res.json())
      .then((data) => {
        if (data.exito) {
          setBanners([BANNER_VIDEO_LOCAL, ...data.datos]);
        }
        setCargandoBanners(false);
      })
      .catch((err) => {
        console.error("Error al cargar banners:", err);
        setCargandoBanners(false);
      });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const intervalo = setInterval(() => {
      setBannerActivo((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(intervalo);
  }, [banners]);

  useEffect(() => {
    const media = heroMediaRef.current;
    if (!media) return undefined;

    gsap.fromTo(media, { autoAlpha: 0, scale: 1.04 }, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
    });

    if (media.tagName === "VIDEO") {
      media.muted = true;
      media.playsInline = true;

      const intentarReproducir = () => media.play().catch(() => {});

      if (media.readyState >= 2) {
        intentarReproducir();
      } else {
        media.addEventListener("canplay", intentarReproducir, { once: true });
      }

      return () => {
        media.removeEventListener("canplay", intentarReproducir);
        gsap.killTweensOf(media);
      };
    }

    return () => gsap.killTweensOf(media);
  }, [bannerActivo, cargandoBanners]);

  const handleVerDetalleNoticia = (noticia) => {
    navigate(`/noticias/${noticia._id}`);
  };

  const partirTitulo = (titulo = "") => {
    const partes = titulo.split(" | ");
    return { linea1: partes[0], linea2: partes[1] || null };
  };

  const bannerActual = banners[bannerActivo];
  const { linea1, linea2 } = partirTitulo(
    bannerActual?.titulo || "Conectamos historias, | unimos personas."
  );

  const resolverMediaUrl = (banner) =>
    banner?._id === "video-hero-local" ? banner.mediaUrl : assetUrl(banner?.mediaUrl);

  const desplazarNoticias = (dir) => {
    const contenedor = carruselRef.current;
    if (!contenedor) return;
    const ancho = contenedor.querySelector(".news-card")?.offsetWidth || 260;
    contenedor.scrollBy({ left: dir * (ancho + 20), behavior: "smooth" });
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-20">

      <section className="relative isolate min-h-[600px] sm:min-h-[560px] lg:min-h-[480px] rounded-2xl sm:rounded-[24px] overflow-hidden border border-white/5 bg-[#0a0d18] shadow-[0_30px_70px_rgba(0,0,0,0.45)] p-6 sm:p-10 md:p-14 lg:px-20 lg:py-8">

        <div className="absolute inset-0 z-0">
          {!cargandoBanners && bannerActual ? (
            bannerActual.tipoMedia === "video" ? (
              <video
                ref={heroMediaRef}
                src={resolverMediaUrl(bannerActual)}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={(evento) => evento.currentTarget.play().catch(() => {})}
                className="w-full h-full bg-[#080b16] object-cover object-center"
              />
            ) : (
              <img
                ref={heroMediaRef}
                src={resolverMediaUrl(bannerActual)}
                alt={bannerActual.titulo}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full bg-[#080b16] object-cover object-center transition-all duration-700"
              />
            )
          ) : (
            <video
              ref={heroMediaRef}
              src={videoHeroLocal}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={(evento) => evento.currentTarget.play().catch(() => {})}
              className="w-full h-full object-cover object-[75%_center]"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,16,0.25)_0%,rgba(6,8,16,0.15)_50%,rgba(6,8,16,0.2)_100%),radial-gradient(circle_at_bottom_left,_rgba(207,70,255,0.08),transparent_55%)]"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-8">

          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-primary-accent/15 border border-primary-accent/30 text-primary-accent uppercase tracking-wider shadow-[0_0_18px_rgba(255,46,99,0.18)] mb-5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> La voz de Burruyacú
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.02] tracking-[-0.03em] drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]">
              {linea1 || "Conectamos historias,"}
              <br />
              <span className="bg-gradient-to-r from-primary-accent via-pink-300 to-purple-300 bg-clip-text text-transparent">
                {linea2 || "unimos personas."}
              </span>
            </h1>

            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl mt-5">
              {bannerActual?.subtitulo ||
                "Información, música, entretenimiento y la mejor compañía, siempre junto a vos, donde estés."}
            </p>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 mt-7">
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="w-full sm:w-auto justify-center px-6 py-3 rounded-full bg-primary-accent text-white font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary-accent/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? "Escuchando en vivo" : "Escuchar en Vivo"}
              </button>
              <button
                onClick={() => navigate("/noticias")}
                className="w-full sm:w-auto justify-center px-6 py-3 rounded-full liquid-glass-strong text-white font-bold text-sm border border-white/15 hover:bg-white/10 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                Ver Noticias <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full max-w-md lg:w-[400px] xl:w-[480px] lg:max-w-none lg:ml-auto shrink-0 rounded-[22px] border border-white/10 bg-[#0c0f1c]/80 backdrop-blur-md p-5 sm:p-6 lg:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-left">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En vivo ahora
              </span>
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Silenciar"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <h2 className="text-xl font-bold text-white mt-3">{nombreRadio}</h2>
            <p className="text-xs text-slate-400 mt-0.5">La voz de nuestra gente</p>

            <div className="mt-4">
              <Player />
            </div>
          </div>
        </div>

        {banners.length > 1 && (
          <div className="relative z-10 flex justify-center lg:justify-start gap-1.5 mt-8">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setBannerActivo(index)}
                aria-label={`Ir al banner ${index + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  bannerActivo === index ? "bg-primary-accent w-6" : "bg-white/20 w-2 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="w-full flex flex-col gap-3 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white">ÚLTIMAS NOTICIAS</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/noticias")}
              className="text-xs font-semibold text-primary-accent hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              Ver Todas
            </button>
            {noticias.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => desplazarNoticias(-1)}
                  aria-label="Anterior"
                  className="w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:text-primary-accent hover:border-primary-accent/40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => desplazarNoticias(1)}
                  aria-label="Siguiente"
                  className="w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:text-primary-accent hover:border-primary-accent/40 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {cargandoNoticias ? (
          <div className="flex items-center justify-center py-20 w-full">
            <span className="w-8 h-8 border-4 border-primary-accent border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : noticias.length > 0 ? (
          <NoticiasCarrusel ref={carruselRef} items={noticias} onSelect={handleVerDetalleNoticia} />
        ) : (
          <div className="w-full flex min-h-32 items-center justify-center text-center text-slate-500">
            No hay noticias publicadas en este momento.
          </div>
        )}
      </section>

    </div>
  );
};

export default Inicio;
