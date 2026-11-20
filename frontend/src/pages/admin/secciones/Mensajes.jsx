import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Inbox, Mail, Reply, Search } from "lucide-react";
import { useAdmin } from "../useAdmin";
import { Boton, EstadoVacio, Tarjeta, entrada, fechaCorta, foco } from "../ui";

const Mensajes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mensajes, cargarMensajes, actualizarEstadoMensaje, avisar } = useAdmin();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [actualizandoId, setActualizandoId] = useState(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return mensajes.filter((m) => {
      const coincideEstado = filtroEstado === "todos" || m.estado === filtroEstado;
      const coincideBusqueda = !q || `${m.nombre} ${m.email} ${m.asunto} ${m.mensaje}`.toLowerCase().includes(q);
      return coincideEstado && coincideBusqueda;
    });
  }, [mensajes, busqueda, filtroEstado]);

  const abierto = mensajes.find((m) => String(m._id) === id) || null;

  const cambiarEstado = async (contacto, estado) => {
    if (contacto.estado === estado) return;
    setActualizandoId(contacto._id);
    try {
      await actualizarEstadoMensaje(contacto._id, estado);
      avisar(estado === "realizado" ? "Mensaje marcado como realizado." : "Mensaje marcado como pendiente.");
    } catch (error) {
      avisar(error.message || "No se pudo actualizar el estado del mensaje.", "error");
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
      <Tarjeta className={abierto ? "hidden lg:block" : ""}>
        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar mensajes…" aria-label="Buscar mensajes" className={`${entrada} py-2 pl-9`} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="filtro-estado-mensajes" className="sr-only">Filtrar mensajes por estado</label>
            <select
              id="filtro-estado-mensajes"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={`${entrada} min-w-0 flex-1 py-2`}
            >
              <option value="todos">Todos los mensajes</option>
              <option value="pendiente">Pendientes</option>
              <option value="realizado">Realizados</option>
            </select>
            <Boton variante="secundario" onClick={() => { cargarMensajes(); avisar("Lista actualizada."); }} className="px-3 py-2 text-xs">Actualizar</Boton>
          </div>
        </div>
        {filtrados.length === 0 ? (
          <EstadoVacio Icono={Inbox} titulo={mensajes.length === 0 ? "Todavía no hay mensajes" : "Sin resultados"} texto={mensajes.length === 0 ? "Los mensajes del formulario de contacto aparecen acá." : "No hay mensajes que coincidan con la búsqueda y el estado seleccionados."} />
        ) : (
          <ul className="max-h-[70vh] divide-y divide-white/[0.05] overflow-y-auto">
            {filtrados.map((m) => (
              <li key={m._id}>
                <div className={`px-4 py-3.5 transition ${id === String(m._id) ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}>
                  <button
                    type="button"
                    onClick={() => navigate(`/PanelAdmin/mensajes/${m._id}`)}
                    className={`w-full cursor-pointer text-left ${foco}`}
                  >
                    <span className="block truncate text-sm font-semibold text-white">{m.nombre}</span>
                    <span className="mt-1 block text-[11px] text-slate-500">{fechaCorta(m.creadoEn)}</span>
                    <span className="mt-0.5 block truncate text-xs font-medium text-slate-300">{m.asunto}</span>
                    <span className="mt-0.5 line-clamp-1 block text-xs text-slate-500">{m.mensaje}</span>
                  </button>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <label htmlFor={`estado-lista-${m._id}`} className="text-xs text-slate-400">Estado</label>
                    <select
                      id={`estado-lista-${m._id}`}
                      value={m.estado}
                      disabled={actualizandoId === m._id}
                      onChange={(e) => cambiarEstado(m, e.target.value)}
                      className={`${entrada} max-w-[150px] py-1.5 text-xs`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="realizado">Realizado</option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>

      <Tarjeta className={abierto ? "" : "hidden lg:block"}>
        {abierto ? (
          <article className="flex flex-col gap-5 p-5 sm:p-6">
            <button type="button" onClick={() => navigate("/PanelAdmin/mensajes")} className={`flex w-fit cursor-pointer items-center gap-1.5 rounded-lg text-xs text-slate-400 hover:text-white lg:hidden ${foco}`}><ArrowLeft className="h-3.5 w-3.5" /> Volver a la lista</button>
            <header className="flex flex-col gap-1 border-b border-white/[0.06] pb-5">
              <h2 className="text-lg font-bold text-white">{abierto.asunto}</h2>
              <p className="text-sm text-slate-300">{abierto.nombre} <span className="text-slate-500">&lt;{abierto.email}&gt;</span></p>
              <time className="text-xs text-slate-500">{new Date(abierto.creadoEn).toLocaleString("es-AR")}</time>
              <span className={`mt-2 w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${abierto.estado === "realizado" ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}>
                {abierto.estado === "realizado" ? "Realizado" : "Pendiente"}
              </span>
            </header>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">{abierto.mensaje}</p>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${abierto.email}?subject=${encodeURIComponent(`Re: ${abierto.asunto}`)}`} className={`inline-flex items-center gap-2 rounded-xl bg-primary-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover ${foco}`}><Reply className="h-4 w-4" /> Responder por correo</a>
              <label htmlFor={`estado-detalle-${abierto._id}`} className="sr-only">Estado del mensaje</label>
              <select
                id={`estado-detalle-${abierto._id}`}
                value={abierto.estado}
                disabled={actualizandoId === abierto._id}
                onChange={(e) => cambiarEstado(abierto, e.target.value)}
                className={`${entrada} max-w-[180px]`}
              >
                <option value="pendiente">Pendiente</option>
                <option value="realizado">Realizado</option>
              </select>
              {actualizandoId === abierto._id && <span className="self-center text-xs text-slate-400">Actualizando...</span>}
            </div>
          </article>
        ) : (
          <EstadoVacio Icono={Mail} titulo="Elegí un mensaje" texto="Seleccioná uno de la lista para leerlo y responderlo." />
        )}
      </Tarjeta>
    </div>
  );
};

export default Mensajes;
