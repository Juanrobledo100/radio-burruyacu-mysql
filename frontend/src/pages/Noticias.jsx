import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Sparkles, Newspaper, Bookmark, Radio } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../config/api";
import { useRadioConfig } from "../context/RadioConfigContext";
import Player from "../components/radio/Player";
import ImagenTarjeta from "../components/noticias/ImagenTarjeta";
import logoRadio from "../assets/Logos/logo-radio-transparente.png";
import { metaDeCategoria, formatFecha } from "../utils/categorias";

const Noticias = () => {
  const navigate = useNavigate();
  const { configRadio } = useRadioConfig();
  const nombreRadio = configRadio?.nombre || "Radio Del Rosario 100.7 FM";
  const [searchParams, setSearchParams] = useSearchParams();
  const [noticias, setNoticias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [errorCategorias, setErrorCategorias] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardadas, setGuardadas] = useState([]);

  useEffect(() => {
    apiFetch("/api/noticias")
      .then((res) => res.json())
      .then((data) => {
        if (data.exito) {
          setNoticias(data.datos);
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar noticias:", err);
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    apiFetch("/api/categorias")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.exito) throw new Error(data.mensaje || "No se pudieron cargar las categorías.");
        setCategorias(data.datos);
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
        setErrorCategorias("No se pudieron cargar las categorías.");
      });
  }, []);

  const categoriaActiva = searchParams.get("categoria") || "Todas";
  const setCategoriaActiva = (cat) => setSearchParams(cat === "Todas" ? {} : { categoria: cat });
  const categoriasVisibles = ["Todas", ...categorias.map((categoria) => categoria.nombre)];

  const noticiasOrdenadas = useMemo(
    () => [...noticias].sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)),
    [noticias]
  );

  const noticiaDestacada = noticiasOrdenadas[0] || null;

  const noticiasFiltradas = noticiasOrdenadas
    .filter((n) => (!noticiaDestacada || n._id !== noticiaDestacada._id))
    .filter((n) => categoriaActiva === "Todas" || (n.categoria || "Locales").toLowerCase() === categoriaActiva.toLowerCase());

  const handleSeleccionarNoticia = (noticia) => navigate(`/noticias/${noticia._id}`);

  const toggleGuardada = (id) => {
    setGuardadas((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  return (
    <div className="w-full min-w-0 flex flex-col gap-6 md:gap-8 text-left pb-20">

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
          NOTICIAS
          <span className="flex items-end gap-[3px] h-6 opacity-70">
            <span className="w-[3px] h-2 bg-primary-accent rounded-full animate-wave-1"></span>
            <span className="w-[3px] h-4 bg-pink-400 rounded-full animate-wave-2"></span>
            <span className="w-[3px] h-6 bg-primary-accent rounded-full animate-wave-3"></span>
            <span className="w-[3px] h-3 bg-pink-400 rounded-full animate-wave-4"></span>
          </span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          La información más relevante de Burruyacú y la región.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span className="w-4 h-[2px] bg-primary-accent rounded-full" /> Explorá por categoría
        </p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {errorCategorias ? (
            <p role="alert" className="text-sm text-rose-300">{errorCategorias}</p>
          ) : categoriasVisibles.map((cat) => {
            const { Icono, color } = metaDeCategoria(cat);
            const activa = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`flex flex-col items-center justify-center gap-1.5 min-w-[84px] sm:min-w-[92px] px-4 py-3 rounded-2xl border shrink-0 transition-all cursor-pointer ${
                  activa
                    ? "bg-primary-accent/15 border-primary-accent text-white shadow-[0_0_20px_rgba(255,46,99,0.15)]"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icono className={`w-5 h-5 ${activa ? "text-primary-accent" : color}`} />
                <span className="text-[11px] font-semibold">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {cargando && (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-4 border-primary-accent border-t-transparent rounded-full animate-spin"></span>
        </div>
      )}

      {!cargando && noticiaDestacada && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">

          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary-accent" /> Noticia destacada
            </p>
            <div
              onClick={() => handleSeleccionarNoticia(noticiaDestacada)}
              className="group relative rounded-3xl overflow-hidden border border-primary-accent/20 cursor-pointer shadow-2xl min-h-[480px] sm:min-h-[560px] lg:min-h-[600px] flex flex-col justify-end hover:border-primary-accent/50 transition-colors"
            >
              <ImagenTarjeta fill src={noticiaDestacada.imagenes?.[0]} alt={noticiaDestacada.titulo} zoomOnHover  />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-primary-accent text-white uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Destacada
              </span>

              <div className="relative z-10 p-5 sm:p-7 flex flex-col gap-3">
                <span className={`w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${metaDeCategoria(noticiaDestacada.categoria).dot}`}>
                  {noticiaDestacada.categoria || "Locales"}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight line-clamp-3">
                  {noticiaDestacada.titulo}
                </h2>
                {noticiaDestacada.subtitulo && (
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 max-w-2xl">
                    {noticiaDestacada.subtitulo}
                  </p>
                )}
                <div className="flex items-center justify-between gap-3 mt-1">
                  <span className="text-xs text-slate-400">{formatFecha(noticiaDestacada.fechaPublicacion)}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-white bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full group-hover:bg-primary-accent transition-colors">
                    Leer noticia <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6 flex flex-col gap-5 border border-white/5 min-w-0 min-h-[320px] sm:min-h-[380px] xl:mt-[27px] xl:min-h-[560px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/10 via-transparent to-purple-500/10 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-3 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En vivo ahora
                </span>
                <Radio className="w-4 h-4 text-primary-accent" />
              </div>
              <h2 className="text-xl font-bold text-white mt-3">{nombreRadio}</h2>
              <p className="text-xs text-slate-400 mt-0.5">La voz de nuestra gente</p>
            </div>

            <div className="relative z-10 flex w-full flex-1 flex-col justify-center items-center gap-5 pt-2 sm:pt-0">
              <div className="relative flex items-center justify-center h-36 w-36 sm:h-40 sm:w-40 rounded-full border border-white/10 bg-slate-950/40 shadow-[0_0_45px_rgba(255,46,99,0.35)] backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-3 rounded-full border border-primary-accent/40 animate-[spin_12s_linear_infinite]" />
                <div className="absolute inset-1 rounded-full border border-white/15 animate-[spin_18s_linear_infinite_reverse]" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-accent/25 via-transparent to-purple-500/10 blur-2xl" />
                <div className="absolute inset-5 rounded-full border border-white/5 animate-pulse" />
                <img
                  src={logoRadio}
                  alt={`Logo ${nombreRadio}`}
                  className="relative z-10 h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-[0_0_20px_rgba(255,46,99,0.65)] animate-[pulse_3s_ease-in-out_infinite]"
                />
              </div>

              <div className="w-full mt-2 sm:mt-4">
                <Player />
              </div>
            </div>
          </div>
        </div>
      )}

      {!cargando && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary-accent" /> Más noticias
          </h2>

          {noticiasFiltradas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticiasFiltradas.map((noticia) => {
                const meta = metaDeCategoria(noticia.categoria);
                const estaGuardada = guardadas.includes(noticia._id);
                return (
                  <div
                    key={noticia._id}
                    onClick={() => handleSeleccionarNoticia(noticia)}
                    className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-primary-accent/30 group cursor-pointer shadow-lg hover:shadow-primary-accent/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="h-[220px] sm:h-[260px] lg:h-[290px] w-full relative overflow-hidden bg-slate-950">
                      <ImagenTarjeta src={noticia.imagenes?.[0]} alt={noticia.titulo} zoomOnHover />
                      <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-md ${meta.dot}`}>
                        {noticia.categoria || "Locales"}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-medium text-slate-400">
                          {formatFecha(noticia.fechaPublicacion)}
                        </span>
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-primary-accent transition-colors line-clamp-2">
                          {noticia.titulo}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-1">
                          {noticia.subtitulo || noticia.contenido}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary-accent inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                          Leer más <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGuardada(noticia._id);
                          }}
                          className="text-slate-500 hover:text-primary-accent transition-colors cursor-pointer"
                          aria-label="Guardar noticia"
                        >
                          <Bookmark className={`w-4 h-4 ${estaGuardada ? "fill-primary-accent text-primary-accent" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass p-16 rounded-2xl text-center text-slate-500 border border-white/5">
              No se encontraron noticias en esta categoría.
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Noticias;
