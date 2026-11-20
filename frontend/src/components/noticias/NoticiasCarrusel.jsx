import React, { forwardRef, useEffect, useRef } from "react";
import ImagenTarjeta from "./ImagenTarjeta";

const NoticiasCarrusel = forwardRef(({ items = [], onSelect }, ref) => {
  const pausaRef = useRef(false);

  useEffect(() => {
    if (items.length <= 1) return undefined;

    const intervalo = setInterval(() => {
      const contenedor = ref?.current;
      if (!contenedor || pausaRef.current) return;

      const tarjeta = contenedor.querySelector(".news-card");
      const estilos = window.getComputedStyle(contenedor);
      const separacion = parseFloat(estilos.columnGap || estilos.gap || "0");
      const paso = (tarjeta?.offsetWidth || 240) + separacion;
      const llegoAlFinal = contenedor.scrollLeft + contenedor.clientWidth >= contenedor.scrollWidth - paso;

      if (llegoAlFinal) {
        contenedor.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        contenedor.scrollBy({ left: paso, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(intervalo);
  }, [items.length, ref]);

  if (items.length === 0) return null;

  return (
    <div
      ref={ref}
      onMouseEnter={() => (pausaRef.current = true)}
      onMouseLeave={() => (pausaRef.current = false)}
      className={`news-carousel flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1 ${items.length <= 4 ? "news-carousel-centered" : ""}`}
    >
      {items.map((noticia) => (
        <div
          key={noticia._id || noticia.id}
          onClick={() => onSelect && onSelect(noticia)}
          className="news-card snap-center shrink-0 w-[calc(100vw-3.5rem)] sm:w-[240px] lg:w-[280px] xl:w-[300px] cursor-pointer bg-transparent rounded-2xl overflow-hidden border border-white/15 hover:border-primary-accent/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.24)] transition-all duration-300 flex flex-col group"
        >
          <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden shrink-0">
            <ImagenTarjeta src={noticia.imagenes?.[0]} alt={noticia.titulo} zoomOnHover />
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-accent text-white uppercase tracking-wider shadow-md">
              {noticia.categoria || "Locales"}
            </span>
          </div>

          <div className="bg-transparent p-3 sm:p-4 flex-1 flex flex-col gap-1.5 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
            <span className="text-[10px] font-medium text-slate-400">
              {new Date(noticia.fechaPublicacion).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <h3 className="font-bold text-white text-xs sm:text-sm leading-snug line-clamp-2">
              {noticia.titulo}
            </h3>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
              {noticia.subtitulo || noticia.contenido}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default NoticiasCarrusel;
