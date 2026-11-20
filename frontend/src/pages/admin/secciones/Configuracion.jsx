import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Save, Upload } from "lucide-react";
import { apiFetch, assetUrl } from "../../../config/api";
import { useAdmin } from "../useAdmin";
import { calcularChecklist } from "../utils";
import { Boton, Campo, EncabezadoTarjeta, Tarjeta, entrada } from "../ui";

const Configuracion = () => {
  const { token, configRadio, setConfigRadio, cargarConfiguracion, redesSociales, avisar } = useAdmin();

  const [form, setForm] = useState({ nombre: "", streamUrl: "" });
  const [logoArchivo, setLogoArchivo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState("");
  const [logoVersion, setLogoVersion] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setForm({ nombre: configRadio.nombre || "", streamUrl: configRadio.streamUrl || "" });
  }, [configRadio.nombre, configRadio.streamUrl]);

  useEffect(() => {
    if (!logoArchivo) {
      setPreviewLogo(assetUrl(configRadio.logoUrl, logoVersion));
      return undefined;
    }
    const url = URL.createObjectURL(logoArchivo);
    setPreviewLogo(url);
    return () => URL.revokeObjectURL(url);
  }, [logoArchivo, configRadio.logoUrl, logoVersion]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("streamUrl", form.streamUrl);
    formData.append("redesSociales", JSON.stringify(configRadio.redesSociales));
    if (logoArchivo) formData.append("logo", logoArchivo);

    setGuardando(true);
    try {
      const res = await apiFetch("/api/radio", { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();
      if (data.exito) {
        const actualizada = data.datos || (await cargarConfiguracion());
        if (actualizada) {
          setConfigRadio(actualizada);
          setLogoVersion(Date.now());
        }
        setLogoArchivo(null);
        avisar("Configuración guardada. Los cambios se ven en el sitio al recargarlo.");
      } else {
        avisar(data.mensaje || "No se pudo guardar la configuración.", "error");
      }
    } catch (err) {
      console.error(err);
      avisar("Error de conexión al guardar.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const checklist = calcularChecklist(configRadio, redesSociales.filter((r) => r.activo).length).slice(0, 3);

  return (
    <form onSubmit={handleGuardar} className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col gap-5">
        <Tarjeta>
          <EncabezadoTarjeta titulo="Datos de la emisora" />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <Campo etiqueta="Nombre de la emisora"><input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Radio Del Rosario 100.7 FM" className={entrada} /></Campo>
            <Campo etiqueta="URL de la transmisión" ayuda="Dirección del streaming de audio."><input value={form.streamUrl} onChange={(e) => setForm({ ...form, streamUrl: e.target.value })} placeholder="https://servidor.com/radio/live" className={entrada} /></Campo>
          </div>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta titulo="Logo" descripcion="Se usa en la cabecera del sitio. Recomendado: PNG con fondo transparente." />
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-950 ring-1 ring-white/10">
              {previewLogo ? <img src={previewLogo} alt="Logo actual" className="h-full w-full object-contain p-1" /> : <span className="text-xs text-slate-600">Sin logo</span>}
            </span>
            <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center transition focus-within:ring-2 focus-within:ring-primary-accent/60 hover:border-primary-accent/50 hover:bg-white/[0.04]">
              <Upload className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-200">{logoArchivo ? logoArchivo.name : "Elegir una imagen"}</span>
              <span className="text-xs text-slate-500">JPG, PNG, WebP, GIF o SVG</span>
              <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml" onChange={(e) => setLogoArchivo(e.target.files[0] || null)} className="sr-only" />
            </label>
          </div>
        </Tarjeta>
      </div>

      <div className="flex flex-col gap-5">
        <Tarjeta className="p-5">
          <p className="text-sm font-semibold text-white">Guardar cambios</p>
          <p className="mt-1 text-xs text-slate-400">Los cambios se ven en el sitio al recargarlo.</p>
          <Boton type="submit" disabled={guardando} className="mt-4 w-full"><Save className="h-4 w-4" /> {guardando ? "Guardando…" : "Guardar configuración"}</Boton>
        </Tarjeta>
        <Tarjeta>
          <EncabezadoTarjeta titulo="Estado actual" />
          <ul className="flex flex-col gap-1 p-3 text-sm">
            {checklist.map(({ ok, texto }) => (
              <li key={texto} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
                {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4 text-amber-400" />}
                <span className="text-slate-300">{texto}</span>
              </li>
            ))}
          </ul>
        </Tarjeta>
      </div>
    </form>
  );
};

export default Configuracion;
