import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import { apiFetch, assetUrl } from "../../../config/api";
import { useAdmin } from "../useAdmin";
import { Boton, BotonIcono, Campo, EncabezadoTarjeta, EstadoVacio, Insignia, Tarjeta, entrada } from "../ui";

const BANNER_VACIO = {
  titulo: "",
  subtitulo: "",
  tipoMedia: "imagen",
  mediaUrl: "",
  linkAccion: "",
  textoBoton: "",
  orden: 0,
  activo: true,
};

const RUTA_BANNERS = "/PanelAdmin/banners";
const idDeBanner = (banner) => banner._id ?? banner.id;

const Banners = ({ modo = "lista" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, avisar, confirmar } = useAdmin();
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(BANNER_VACIO);
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(modo !== "crear");
  const [guardando, setGuardando] = useState(false);

  const cargarBanners = useCallback(async () => {
    setCargando(true);
    try {
      const respuesta = await apiFetch("/api/hero?todos=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || "No se pudieron cargar los banners.");
      }
      setBanners(datos.datos);
    } catch (error) {
      console.error("Error cargando banners:", error);
      avisar(error.message || "No se pudieron cargar los banners.", "error");
      if (modo !== "lista") navigate(RUTA_BANNERS, { replace: true });
    } finally {
      setCargando(false);
    }
  }, [token, avisar, modo, navigate]);

  useEffect(() => {
    if (modo === "crear") {
      setForm(BANNER_VACIO);
      setCargando(false);
      return;
    }
    cargarBanners();
  }, [modo, cargarBanners]);

  useEffect(() => {
    if (modo !== "editar" || cargando) return;
    const banner = banners.find((item) => String(idDeBanner(item)) === String(id));
    if (!banner) {
      avisar("No se encontró el banner solicitado.", "error");
      navigate(RUTA_BANNERS, { replace: true });
      return;
    }
    setForm({
      titulo: banner.titulo || "",
      subtitulo: banner.subtitulo || "",
      tipoMedia: banner.tipoMedia || "imagen",
      mediaUrl: banner.mediaUrl || "",
      linkAccion: banner.linkAccion || "",
      textoBoton: banner.textoBoton || "",
      orden: banner.orden ?? 0,
      activo: Boolean(banner.activo),
    });
    setArchivo(null);
  }, [modo, id, banners, cargando, avisar, navigate]);

  const guardar = async (e) => {
    e.preventDefault();
    if (!archivo && !form.mediaUrl.trim()) {
      avisar("Subí una imagen o video, o ingresá una URL de media.", "error");
      return;
    }
    if (
      archivo &&
      ((form.tipoMedia === "imagen" && !archivo.type.startsWith("image/")) ||
        (form.tipoMedia === "video" && !archivo.type.startsWith("video/")))
    ) {
      avisar("El tipo de medio seleccionado no coincide con el archivo.", "error");
      return;
    }

    setGuardando(true);
    const formData = new FormData();
    formData.append("titulo", form.titulo.trim());
    formData.append("subtitulo", form.subtitulo.trim());
    formData.append("tipoMedia", form.tipoMedia);
    formData.append("mediaUrl", form.mediaUrl.trim());
    formData.append("linkAccion", form.linkAccion.trim());
    formData.append("textoBoton", form.textoBoton.trim());
    formData.append("orden", String(Number(form.orden) || 0));
    formData.append("activo", String(form.activo));
    if (archivo) formData.append("media", archivo);

    const editando = modo === "editar";
    try {
      const respuesta = await apiFetch(
        editando ? `/api/hero/${id}` : "/api/hero",
        {
          method: editando ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || "No se pudo guardar el banner.");
      }
      avisar(editando ? "Banner actualizado." : "Banner creado.");
      navigate(RUTA_BANNERS);
    } catch (error) {
      console.error("Error guardando banner:", error);
      avisar(error.message || "No se pudo guardar el banner.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (banner) => {
    try {
      const respuesta = await apiFetch(`/api/hero/${idDeBanner(banner)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || "No se pudo eliminar el banner.");
      }
      avisar("Banner eliminado.");
      await cargarBanners();
    } catch (error) {
      console.error("Error eliminando banner:", error);
      avisar(error.message || "No se pudo eliminar el banner.", "error");
    }
  };

  const pedirEliminar = (banner) => confirmar({
    titulo: "¿Eliminar este banner?",
    texto: `Se eliminará “${banner.titulo || "Banner sin título"}”. Esta acción no se puede deshacer.`,
    boton: "Eliminar banner",
    accion: () => eliminar(banner),
  });

  if (modo === "lista") {
    return (
      <Tarjeta>
        <EncabezadoTarjeta
          titulo="Banners del sitio"
          descripcion="Podés crear, editar, activar, ordenar o eliminar los banners principales."
          accion={<Boton onClick={() => navigate(`${RUTA_BANNERS}/nuevo`)}><Plus className="h-4 w-4" /> Nuevo banner</Boton>}
        />
        {cargando ? (
          <p className="p-5 text-sm text-slate-400" role="status">Cargando banners...</p>
        ) : banners.length === 0 ? (
          <EstadoVacio Icono={ImageIcon} titulo="No hay banners" texto="Creá uno con el formulario para mostrarlo en el sitio." />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {banners.map((banner) => {
              const src = assetUrl(banner.mediaUrl);
              return (
                <li key={idDeBanner(banner)} className="flex items-center gap-3 px-5 py-3.5">
                  {src && banner.tipoMedia === "video" ? (
                    <video src={src} className="h-14 w-20 shrink-0 rounded-lg bg-slate-900 object-cover" muted />
                  ) : src ? (
                    <img src={src} alt={banner.titulo || "Banner"} className="h-14 w-20 shrink-0 rounded-lg bg-slate-900 object-cover" />
                  ) : (
                    <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-slate-600">
                      <ImageIcon className="h-5 w-5" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{banner.titulo || "Banner sin título"}</p>
                    <p className="mt-0.5 text-xs text-slate-400">Orden: {banner.orden}</p>
                    <Insignia tono={banner.activo ? "verde" : "gris"}>{banner.activo ? "Activo" : "Inactivo"}</Insignia>
                  </div>
                  <BotonIcono
                    etiqueta="Editar banner"
                    onClick={() => navigate(`${RUTA_BANNERS}/${idDeBanner(banner)}/editar`)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </BotonIcono>
                  <BotonIcono etiqueta="Eliminar banner" tono="peligro" onClick={() => pedirEliminar(banner)}>
                    <Trash2 className="h-4 w-4" />
                  </BotonIcono>
                </li>
              );
            })}
          </ul>
        )}
      </Tarjeta>
    );
  }

  if (cargando) {
    return <p className="p-5 text-sm text-slate-400" role="status">Cargando banner...</p>;
  }

  return (
    <Tarjeta className="mx-auto w-full max-w-2xl">
      <EncabezadoTarjeta titulo={modo === "editar" ? "Editar banner" : "Crear banner"} />
      <form onSubmit={guardar} className="flex flex-col gap-4 p-5">
        <Campo etiqueta="Título">
          <input maxLength={255} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className={entrada} />
        </Campo>
        <Campo etiqueta="Subtítulo">
          <input maxLength={255} value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} className={entrada} />
        </Campo>
        <Campo etiqueta="Tipo de media">
          <select required value={form.tipoMedia} onChange={(e) => setForm({ ...form, tipoMedia: e.target.value })} className={entrada}>
            <option value="imagen">Imagen</option>
            <option value="video">Video</option>
          </select>
        </Campo>
        <Campo etiqueta="URL de media" ayuda="Opcional si subís un archivo.">
          <input value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} placeholder="https://... o /uploads/..." className={entrada} />
        </Campo>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-center transition hover:border-primary-accent/50">
          <Upload className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-200">{archivo ? archivo.name : "Subir imagen o video"}</span>
          <span className="text-xs text-slate-500">También podés usar la URL de media.</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/webm,video/ogg"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="sr-only"
          />
        </label>
        <Campo etiqueta="Enlace del botón">
          <input value={form.linkAccion} onChange={(e) => setForm({ ...form, linkAccion: e.target.value })} className={entrada} />
        </Campo>
        <Campo etiqueta="Texto del botón">
          <input maxLength={100} value={form.textoBoton} onChange={(e) => setForm({ ...form, textoBoton: e.target.value })} className={entrada} />
        </Campo>
        <Campo etiqueta="Orden">
          <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: e.target.value })} className={entrada} />
        </Campo>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
          <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="h-4 w-4 accent-primary-accent" />
          Mostrar en el sitio
        </label>
        <div className="flex justify-end gap-2">
          <Boton variante="secundario" onClick={() => navigate(RUTA_BANNERS)}>Volver al listado</Boton>
          <Boton type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : modo === "editar" ? "Guardar cambios" : "Crear banner"}
          </Boton>
        </div>
      </form>
    </Tarjeta>
  );
};

export default Banners;
