import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, ChevronRight, Inbox, Mail, Newspaper, Plus, Radio, Share2, Star } from "lucide-react";
import { metaDeCategoria } from "../../../utils/categorias";
import { useAdmin } from "../useAdmin";
import { calcularChecklist } from "../utils";
import { Boton, EncabezadoTarjeta, EstadoVacio, Insignia, Miniatura, Tarjeta, fechaCorta, foco, saludo } from "../ui";

const EnlaceVerTodos = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className={`flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary-accent hover:bg-primary-accent/10 ${foco}`}>
    {children} <ChevronRight className="h-3.5 w-3.5" />
  </button>
);

const Resumen = () => {
  const navigate = useNavigate();
  const { nombreUsuario, noticias, mensajes, redesSociales, configRadio } = useAdmin();

  const destacadas = noticias.filter((n) => n.destacada).length;
  const redesActivas = redesSociales.filter((r) => r.activo).length;
  const checklist = calcularChecklist(configRadio, redesActivas);
  const completos = checklist.filter((c) => c.ok).length;

  const porCategoria = useMemo(() => {
    const conteo = {};
    noticias.forEach((n) => { const c = n.categoria || "Locales"; conteo[c] = (conteo[c] || 0) + 1; });
    return Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  }, [noticias]);

  const nuevaNoticia = () => navigate("/PanelAdmin/noticias", { state: { nueva: true } });

  const tarjetas = [
    { etiqueta: "Noticias publicadas", valor: noticias.length, sub: destacadas === 1 ? "1 destacada" : `${destacadas} destacadas`, Icono: Newspaper, ir: "/PanelAdmin/noticias" },
    { etiqueta: "Mensajes recibidos", valor: mensajes.length, sub: "desde el formulario", Icono: Mail, ir: "/PanelAdmin/mensajes" },
    { etiqueta: "Redes activas", valor: redesActivas, sub: `de ${redesSociales.length} cargadas`, Icono: Share2, ir: "/PanelAdmin/redes" },
    { etiqueta: "Transmisión", valor: configRadio.streamUrl ? "Lista" : "Sin URL", sub: configRadio.streamUrl ? "Stream configurado" : "Cargala en Configuración", Icono: Radio, ir: "/PanelAdmin/configuracion" },
  ];

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-white">{saludo()}, {nombreUsuario}</h2>
        <p className="mt-1 text-sm text-slate-400 first-letter:uppercase">{new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {tarjetas.map(({ etiqueta, valor, sub, Icono, ir }) => (
          <button key={etiqueta} type="button" onClick={() => navigate(ir)} className={`group cursor-pointer rounded-2xl border border-white/[0.07] bg-[#0e1018] p-4 text-left transition hover:border-white/20 lg:p-5 ${foco}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400">{etiqueta}</p>
              <Icono className="h-4 w-4 text-slate-500 transition group-hover:text-primary-accent" />
            </div>
            <p className="mt-3 text-3xl font-bold leading-none text-white">{valor}</p>
            <p className="mt-2 text-xs text-slate-500">{sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Tarjeta>
          <EncabezadoTarjeta titulo="Últimas noticias" accion={<EnlaceVerTodos onClick={() => navigate("/PanelAdmin/noticias")}>Ver todas</EnlaceVerTodos>} />
          {noticias.length === 0 ? (
            <EstadoVacio Icono={Newspaper} titulo="Todavía no hay noticias" texto="Publicá la primera para que aparezca en el sitio." accion={<Boton onClick={nuevaNoticia}><Plus className="h-4 w-4" /> Nueva noticia</Boton>} />
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {noticias.slice(0, 5).map((n) => (
                <li key={n._id} className="flex items-center gap-3 px-5 py-3">
                  <Miniatura src={n.imagenes?.[0]} alt={n.titulo} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{n.titulo}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{n.categoria} · {fechaCorta(n.fechaPublicacion)}</p>
                  </div>
                  {n.destacada && <Insignia tono="ambar"><Star className="h-3 w-3 fill-current" /> Destacada</Insignia>}
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta titulo="Estado del sitio" descripcion={`${completos} de ${checklist.length} puntos completos`} />
          <div className="px-5 pt-4"><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${(completos / checklist.length) * 100}%` }} /></div></div>
          <ul className="flex flex-col gap-1 p-3">
            {checklist.map(({ ok, texto, ir }) => (
              <li key={texto}>
                <button type="button" onClick={() => navigate(ir)} className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition hover:bg-white/[0.04] ${foco}`}>
                  {ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />}
                  <span className={ok ? "text-slate-300" : "text-white"}>{texto}</span>
                  {!ok && <span className="ml-auto text-xs font-medium text-amber-300">Completar</span>}
                </button>
              </li>
            ))}
          </ul>
        </Tarjeta>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Tarjeta>
          <EncabezadoTarjeta titulo="Noticias por categoría" />
          {porCategoria.length === 0 ? (
            <p className="px-5 py-8 text-center text-xs text-slate-500">Sin datos todavía.</p>
          ) : (
            <ul className="flex flex-col gap-3.5 p-5">
              {porCategoria.map(([cat, cuenta]) => (
                <li key={cat}>
                  <div className="mb-1.5 flex items-center justify-between text-xs"><span className="text-slate-300">{cat}</span><span className="font-semibold text-white">{cuenta}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className={`h-full rounded-full ${metaDeCategoria(cat).dot}`} style={{ width: `${(cuenta / porCategoria[0][1]) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta titulo="Mensajes recientes" accion={<EnlaceVerTodos onClick={() => navigate("/PanelAdmin/mensajes")}>Ver todos</EnlaceVerTodos>} />
          {mensajes.length === 0 ? (
            <EstadoVacio Icono={Inbox} titulo="Sin mensajes" texto="Cuando alguien escriba desde la página de contacto, lo vas a ver acá." />
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {mensajes.slice(0, 4).map((m) => (
                <li key={m._id}>
                  <button type="button" onClick={() => navigate(`/PanelAdmin/mensajes/${m._id}`)} className={`flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left transition hover:bg-white/[0.03] ${foco}`}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold uppercase text-slate-300">{(m.nombre || "?").charAt(0)}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-white">{m.asunto}</span><span className="block truncate text-xs text-slate-500">{m.nombre} · {fechaCorta(m.creadoEn)}</span></span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>
    </>
  );
};

export default Resumen;
