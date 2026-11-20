import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Newspaper, Plus, Search, Star, Trash2 } from "lucide-react";
import { apiFetch } from "../../../config/api";
import { metaDeCategoria } from "../../../utils/categorias";
import { useAdmin } from "../useAdmin";
import { Boton, BotonIcono, EstadoVacio, Insignia, Miniatura, Tarjeta, entrada, fechaCorta } from "../ui";

const Noticias = () => {
  const { token, noticias, categorias, avisar, confirmar, cargarNoticias } = useAdmin();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return noticias.filter(
      (n) =>
        (filtroCategoria === "Todas" || n.categoria === filtroCategoria) &&
        (!q || `${n.titulo} ${n.subtitulo || ""}`.toLowerCase().includes(q))
    );
  }, [noticias, busqueda, filtroCategoria]);

  const eliminar = async (id) => {
    try {
      const res = await apiFetch(`/api/noticias/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.exito) {
        avisar("Noticia eliminada.");
        cargarNoticias();
      } else {
        avisar(data.mensaje || "No se pudo eliminar la noticia.", "error");
      }
    } catch (err) {
      console.error(err);
      avisar("Error de conexión al eliminar.", "error");
    }
  };

  const pedirEliminar = (n) =>
    confirmar({
      titulo: "¿Eliminar esta noticia?",
      texto: `“${n.titulo}” dejará de mostrarse en el sitio. No se puede deshacer.`,
      boton: "Eliminar noticia",
      accion: () => eliminar(n._id),
    });

  return (
    <>
      <Tarjeta>
        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por título…" aria-label="Buscar noticias" className={`${entrada} pl-10`} />
          </div>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} aria-label="Filtrar por categoría" className={`${entrada} sm:w-48`}>
            <option>Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria._id} value={categoria.nombre}>{categoria.nombre}</option>
            ))}
          </select>
          <Boton onClick={() => navigate("/PanelAdmin/noticias/nueva")}><Plus className="h-4 w-4" /> Nueva noticia</Boton>
        </div>

        {filtradas.length === 0 ? (
          <EstadoVacio
            Icono={Newspaper}
            titulo={noticias.length === 0 ? "Todavía no hay noticias" : "Ninguna noticia coincide"}
            texto={noticias.length === 0 ? "Publicá la primera noticia del sitio." : "Probá con otra búsqueda o categoría."}
          />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {filtradas.map((n) => {
              const meta = metaDeCategoria(n.categoria);
              return (
                <li key={n._id} className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5">
                  <Miniatura src={n.imagenes?.[0]} alt={n.titulo} className="h-14 w-14 sm:h-16 sm:w-20" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-white">{n.titulo}</p>
                    {n.subtitulo && <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{n.subtitulo}</p>}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />{n.categoria}</span>
                      <span>{fechaCorta(n.fechaPublicacion)}</span>
                      {n.destacada && <Insignia tono="ambar"><Star className="h-3 w-3 fill-current" /> Destacada</Insignia>}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <BotonIcono etiqueta="Editar noticia" onClick={() => navigate(`/PanelAdmin/noticias/${n._id}/editar`)}><Edit2 className="h-4 w-4" /></BotonIcono>
                    <BotonIcono etiqueta="Eliminar noticia" tono="peligro" onClick={() => pedirEliminar(n)}><Trash2 className="h-4 w-4" /></BotonIcono>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="border-t border-white/[0.06] px-5 py-3 text-xs text-slate-500">Mostrando {filtradas.length} de {noticias.length} noticias</p>
      </Tarjeta>

    </>
  );
};

export default Noticias;
