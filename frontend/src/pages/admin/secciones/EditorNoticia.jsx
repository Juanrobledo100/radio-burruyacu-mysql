import React, { useEffect, useState } from "react";
import { Save, Upload, X } from "lucide-react";
import { apiFetch } from "../../../config/api";
import { useAdmin } from "../useAdmin";
import { Boton, BotonIcono, Campo, entrada } from "../ui";

const NOTICIA_VACIA = { titulo: "", subtitulo: "", contenido: "", categoriaId: "", destacada: false };

const EditorNoticia = ({ noticia, onCerrar, pantallaCompleta = false }) => {
  const { token, categorias, avisar, cargarNoticias } = useAdmin();
  const editandoId = noticia?._id || null;

  const [form, setForm] = useState(() =>
    noticia
      ? {
          titulo: noticia.titulo,
          subtitulo: noticia.subtitulo || "",
          contenido: noticia.contenido,
          categoriaId: noticia.categoriaId ? String(noticia.categoriaId) : "",
          destacada: noticia.destacada || false,
        }
      : NOTICIA_VACIA
  );
  const [archivos, setArchivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const categoriasDisponibles = categorias.filter(
    (categoria) => categoria.activo || String(categoria.id) === form.categoriaId
  );

  useEffect(() => {
    if (form.categoriaId) return;
    const categoriaInicial = noticia
      ? categorias.find((categoria) => categoria.nombre === noticia.categoria)
      : categorias.find((categoria) => categoria.activo);
    if (categoriaInicial) {
      setForm((actual) => ({ ...actual, categoriaId: String(categoriaInicial.id) }));
    }
  }, [categorias, form.categoriaId, noticia]);

  useEffect(() => {
    const alTeclear = (e) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [onCerrar]);

  useEffect(() => {
    if (archivos.length === 0) {
      setPreviews([]);
      return undefined;
    }
    const lista = archivos.map((archivo) => ({
      url: URL.createObjectURL(archivo),
      esVideo: archivo.type.startsWith("video/"),
      nombre: archivo.name,
    }));
    setPreviews(lista);
    return () => lista.forEach((p) => URL.revokeObjectURL(p.url));
  }, [archivos]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", form.titulo);
    formData.append("subtitulo", form.subtitulo);
    formData.append("contenido", form.contenido);
    formData.append("categoriaId", form.categoriaId);
    formData.append("destacada", String(form.destacada));
    archivos.forEach((archivo) => formData.append("archivos", archivo));

    setGuardando(true);
    try {
      const res = await apiFetch(editandoId ? `/api/noticias/${editandoId}` : "/api/noticias", {
        method: editandoId ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (data.exito) {
        avisar(editandoId ? "Noticia actualizada." : "Noticia publicada.");
        cargarNoticias();
        onCerrar();
      } else {
        avisar(data.mensaje || `No se pudo guardar la noticia (${res.status}).`, "error");
      }
    } catch (err) {
      console.error(err);
      avisar("Error de conexión. Revisá tu internet e intentá de nuevo.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const actuales = noticia?.imagenes || [];

  return (
    <div
      className={pantallaCompleta ? "w-full" : "fixed inset-0 z-50 flex justify-end"}
      role={pantallaCompleta ? "region" : "dialog"}
      aria-modal={pantallaCompleta ? undefined : "true"}
      aria-label={editandoId ? "Editar noticia" : "Nueva noticia"}
    >
      {!pantallaCompleta && <button type="button" aria-label="Cerrar editor" onClick={onCerrar} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />}
      <form
        onSubmit={handleGuardar}
        className={pantallaCompleta
          ? "mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e1018]"
          : "relative flex h-full w-full max-w-2xl flex-col border-l border-white/10 bg-[#0b0d14] shadow-2xl"}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-base font-bold text-white">{editandoId ? "Editar noticia" : "Nueva noticia"}</h2>
          <BotonIcono etiqueta={pantallaCompleta ? "Volver al listado" : "Cerrar"} onClick={onCerrar}><X className="h-4 w-4" /></BotonIcono>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          <Campo etiqueta="Título"><input required autoFocus value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título de la noticia" className={entrada} /></Campo>
          <Campo etiqueta="Subtítulo" ayuda="Opcional. Un copete corto debajo del título."><input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} placeholder="Subtítulo" className={entrada} /></Campo>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo etiqueta="Categoría">
              <select
                required
                value={form.categoriaId}
                onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                className={entrada}
                disabled={categoriasDisponibles.length === 0}
              >
                {categoriasDisponibles.map((categoria) => (
                  <option key={categoria._id} value={String(categoria.id)}>
                    {categoria.nombre}{categoria.activo ? "" : " (inactiva)"}
                  </option>
                ))}
              </select>
              {categoriasDisponibles.length === 0 && (
                <p className="mt-1 text-xs text-amber-300">Creá una categoría activa antes de publicar una noticia.</p>
              )}
            </Campo>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0a0c13] px-3.5 py-2.5 sm:mt-[22px]">
              <input type="checkbox" checked={form.destacada} onChange={(e) => setForm({ ...form, destacada: e.target.checked })} className="h-4 w-4 cursor-pointer accent-primary-accent" />
              <span className="text-sm text-slate-200">Noticia destacada</span>
            </label>
          </div>
          <Campo etiqueta="Contenido"><textarea required rows={9} value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} placeholder="Escribí la noticia completa acá…" className={`${entrada} resize-y leading-relaxed`} /></Campo>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-slate-300">Imágenes y videos</span>
            {editandoId && actuales.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {actuales.map((src, i) => <img key={src + i} src={src} alt={`Imagen actual ${i + 1}`} className="h-14 w-14 rounded-lg border border-white/10 object-cover" />)}
              </div>
            )}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] px-4 py-7 text-center transition focus-within:ring-2 focus-within:ring-primary-accent/60 hover:border-primary-accent/50 hover:bg-white/[0.04]">
              <Upload className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-200">{archivos.length > 0 ? `${archivos.length} archivo(s) seleccionado(s)` : "Subir imágenes o videos"}</span>
              <span className="text-xs text-slate-500">JPG, PNG, WebP, GIF, MP4 o WebM</span>
              <input type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/webm,video/ogg" onChange={(e) => setArchivos(Array.from(e.target.files || []))} className="sr-only" />
            </label>
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previews.map((p, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/50">
                    {p.esVideo ? <video src={p.url} controls className="h-24 w-full object-cover" /> : <img src={p.url} alt={`Vista previa ${i + 1}`} className="h-24 w-full object-cover" />}
                    <p className="truncate px-2 py-1 text-[11px] text-slate-400">{p.nombre}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/[0.06] bg-[#0b0d14] px-5 py-4">
          <Boton variante="secundario" onClick={onCerrar}>Cancelar</Boton>
          <Boton type="submit" disabled={guardando || !form.categoriaId}><Save className="h-4 w-4" /> {guardando ? "Guardando…" : editandoId ? "Guardar cambios" : "Publicar noticia"}</Boton>
        </div>
      </form>
    </div>
  );
};

export default EditorNoticia;
