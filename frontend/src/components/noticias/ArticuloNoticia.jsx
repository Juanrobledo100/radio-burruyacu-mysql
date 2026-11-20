import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  Tag,
  Link2,
  Check,
  MessageCircle,
} from "lucide-react";
import { Facebook } from "../ui/BrandIcons";
import EnVivoAhora from "../radio/EnVivoAhora";
import ImagenTarjeta from "./ImagenTarjeta";
import { metaDeCategoria, formatFecha, tiempoLectura } from "../../utils/categorias";

const ArticuloNoticia = ({ noticia, todasLasNoticias, categorias = [], onVolver, onSeleccionarNoticia, onFiltrarCategoria }) => {
  const [copiado, setCopiado] = useState(false);
  const meta = metaDeCategoria(noticia.categoria);
  const categoriasVisibles = ["Todas", ...categorias.map((categoria) => categoria.nombre)];

  const relacionadas = todasLasNoticias
    .filter((n) => n._id !== noticia._id && (n.categoria || "Locales") === (noticia.categoria || "Locales"))
    .sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion))
    .slice(0, 3);

  const conteos = categoriasVisibles.reduce((acc, cat) => {
    acc[cat] = cat === "Todas"
      ? todasLasNoticias.length
      : todasLasNoticias.filter((n) => (n.categoria || "Locales").toLowerCase() === cat.toLowerCase()).length;
    return acc;
  }, {});

  const ordenadas = [...todasLasNoticias].sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
  const idxActual = ordenadas.findIndex((n) => n._id === noticia._id);
  const anterior = idxActual >= 0 ? ordenadas[idxActual + 1] : null;
  const siguiente = idxActual > 0 ? ordenadas[idxActual - 1] : null;

  const compartirWhatsapp = () => {
    const texto = encodeURIComponent(`${noticia.titulo} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${texto}`, "_blank", "noreferrer");
  };

  const compartirFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noreferrer");
  };

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 text-left pb-20">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
        <button onClick={onVolver} className="hover:text-white transition-colors cursor-pointer">Inicio</button>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <button onClick={onVolver} className="hover:text-white transition-colors cursor-pointer">Noticias</button>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-slate-300 truncate max-w-[180px] sm:max-w-xs">{noticia.titulo}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
        <article className="flex flex-col gap-5 min-w-0">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al listado
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-md ${meta.dot}`}>
              {noticia.categoria || "Locales"}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-primary-accent" /> {formatFecha(noticia.fechaPublicacion)}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-primary-accent" /> {tiempoLectura(noticia.contenido)}
            </span>
            {noticia.destacada && (
              <span className="flex items-center gap-1 text-primary-accent font-bold uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Destacada
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {noticia.titulo}
            </h1>
            {noticia.subtitulo && (
              <h3 className="text-lg md:text-xl font-medium text-slate-300 leading-relaxed">
                {noticia.subtitulo}
              </h3>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-accent to-pink-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                RDR
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Radio Del Rosario 100.7 FM</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Equipo de Noticias</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 mr-1 hidden sm:inline">Compartir:</span>
              <button onClick={compartirFacebook} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-primary-accent/40 transition-colors cursor-pointer" aria-label="Compartir en Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </button>
              <button onClick={compartirWhatsapp} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-primary-accent/40 transition-colors cursor-pointer" aria-label="Compartir por WhatsApp">
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
              <button onClick={copiarEnlace} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-primary-accent/40 transition-colors cursor-pointer" aria-label="Copiar enlace">
                {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="w-full h-[300px] sm:h-[420px] md:h-[500px] rounded-3xl overflow-hidden relative bg-slate-950 shadow-xl border border-white/5">
            <ImagenTarjeta src={noticia.imagenes?.[0]} alt={noticia.titulo} />
          </div>

          <div className="h-[1px] w-full bg-white/5" />

          <article className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {noticia.contenido}
          </article>

          {noticia.imagenes && noticia.imagenes.length > 1 && (
            <div className="flex flex-col gap-4 mt-2">
              <h4 className="font-bold text-white text-lg flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-accent" /> Galería de imágenes
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {noticia.imagenes.slice(1).map((img, i) => (
                  <a
                    key={i}
                    href={img}
                    target="_blank"
                    rel="noreferrer"
                    className="h-32 sm:h-44 rounded-2xl overflow-hidden border border-white/5 hover:border-primary-accent/30 transition-all shadow-md group"
                  >
                    <ImagenTarjeta src={img} alt={`Galería ${i}`} zoomOnHover />
                  </a>
                ))}
              </div>
            </div>
          )}

          {(anterior || siguiente) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
              {anterior ? (
                <button
                  onClick={() => onSeleccionarNoticia(anterior)}
                  className="flex items-center gap-3 p-3 rounded-2xl glass border border-white/5 hover:border-primary-accent/30 transition-colors text-left cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 text-primary-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Noticia anterior</p>
                    <p className="text-xs font-semibold text-white truncate group-hover:text-primary-accent transition-colors">{anterior.titulo}</p>
                  </div>
                </button>
              ) : <div />}
              {siguiente && (
                <button
                  onClick={() => onSeleccionarNoticia(siguiente)}
                  className="flex items-center justify-end gap-3 p-3 rounded-2xl glass border border-white/5 hover:border-primary-accent/30 transition-colors text-right cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Siguiente noticia</p>
                    <p className="text-xs font-semibold text-white truncate group-hover:text-primary-accent transition-colors">{siguiente.titulo}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-primary-accent rotate-180 shrink-0" />
                </button>
              )}
            </div>
          )}
        </article>

        <aside className="flex flex-col gap-6 xl:sticky xl:top-24">
          <EnVivoAhora />

          {relacionadas.length > 0 && (
            <div className="glass rounded-3xl p-5 flex flex-col gap-4 border border-white/5">
              <h4 className="text-sm font-extrabold text-white">Noticias relacionadas</h4>
              <div className="flex flex-col gap-3">
                {relacionadas.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => onSeleccionarNoticia(n)}
                    className="flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-white/5 shrink-0">
                      <ImagenTarjeta src={n.imagenes?.[0]} alt={n.titulo} zoomOnHover />
                    </div>
                    <div className="min-w-0">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${metaDeCategoria(n.categoria).color}`}>
                        {n.categoria || "Locales"}
                      </span>
                      <p className="text-xs font-semibold text-white leading-snug line-clamp-2 group-hover:text-primary-accent transition-colors">
                        {n.titulo}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{formatFecha(n.fechaPublicacion)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="glass rounded-3xl p-5 flex flex-col gap-3 border border-white/5">
            <h4 className="text-sm font-extrabold text-white">Categorías</h4>
            <div className="flex flex-col gap-1">
              {categoriasVisibles.map((cat) => {
                const catMeta = metaDeCategoria(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => onFiltrarCategoria(cat)}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2 text-xs text-slate-300 group-hover:text-white transition-colors">
                      <span className={`w-2 h-2 rounded-full ${catMeta.dot}`} />
                      {cat === "Todas" ? "Todas las noticias" : cat}
                    </span>
                    <span className="text-[10px] text-slate-500">{conteos[cat]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticuloNoticia;
