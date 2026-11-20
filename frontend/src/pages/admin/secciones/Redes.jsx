import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, Plus, Share2, Trash2 } from "lucide-react";
import { apiFetch } from "../../../config/api";
import { useAdmin } from "../useAdmin";
import { Boton, BotonIcono, Campo, EncabezadoTarjeta, EstadoVacio, Insignia, Tarjeta, entrada } from "../ui";

const RED_VACIA = { nombre: "", url: "", orden: 0, activo: true };
const RUTA_REDES = "/PanelAdmin/redes";

const Redes = ({ modo = "lista" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, redesSociales, cargarRedes, avisar, confirmar } = useAdmin();
  const [form, setForm] = useState(RED_VACIA);
  const [cargando, setCargando] = useState(modo === "editar");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (modo !== "editar") {
      setForm(RED_VACIA);
      setCargando(false);
      return undefined;
    }

    let vigente = true;
    const cargarRed = async () => {
      setCargando(true);
      try {
        const respuesta = await apiFetch("/api/redes-sociales/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const datos = await respuesta.json();
        if (!respuesta.ok || !datos.exito) {
          throw new Error(datos.mensaje || "No se pudo cargar la red social.");
        }
        const red = datos.datos.find((item) => String(item._id) === String(id));
        if (!red) throw new Error("No se encontró la red social solicitada.");
        if (vigente) {
          setForm({
            nombre: red.nombre,
            url: red.url,
            orden: red.orden || 0,
            activo: red.activo,
          });
        }
      } catch (error) {
        console.error("Error cargando red social:", error);
        if (vigente) {
          avisar(error.message || "No se pudo cargar la red social.", "error");
          navigate(RUTA_REDES, { replace: true });
        }
      } finally {
        if (vigente) setCargando(false);
      }
    };

    cargarRed();
    return () => {
      vigente = false;
    };
  }, [modo, id, token, avisar, navigate]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    const editando = modo === "editar";
    setGuardando(true);
    try {
      const respuesta = await apiFetch(
        editando ? `/api/redes-sociales/${id}` : "/api/redes-sociales",
        {
          method: editando ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, orden: Number(form.orden) || 0 }),
        }
      );
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        avisar(datos.mensaje || "No se pudo guardar la red social.", "error");
        return;
      }
      avisar(editando ? "Red social actualizada." : "Red social agregada.");
      await cargarRedes();
      navigate(RUTA_REDES);
    } catch (error) {
      console.error("Error guardando red social:", error);
      avisar("No se pudo guardar la red social.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (idRed) => {
    try {
      const respuesta = await apiFetch(`/api/redes-sociales/${idRed}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const datos = await respuesta.json();
      if (respuesta.ok && datos.exito) {
        avisar("Red social eliminada.");
        cargarRedes();
      } else {
        avisar(datos.mensaje || "No se pudo eliminar.", "error");
      }
    } catch (error) {
      console.error("Error eliminando red social:", error);
      avisar("Error de conexión al eliminar.", "error");
    }
  };

  if (modo === "lista") {
    return (
      <Tarjeta>
        <EncabezadoTarjeta
          titulo="Enlaces cargados"
          descripcion="Se muestran en el pie de página y en Contacto."
          accion={<Boton onClick={() => navigate(`${RUTA_REDES}/nueva`)}><Plus className="h-4 w-4" /> Nueva red</Boton>}
        />
        {redesSociales.length === 0 ? (
          <EstadoVacio Icono={Share2} titulo="No hay redes cargadas" texto="Agregá la primera con el formulario." />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {redesSociales.map((red) => (
              <li key={red._id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white">
                    {red.nombre}
                    <Insignia tono={red.activo ? "verde" : "gris"}>{red.activo ? "Activa" : "Oculta"}</Insignia>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{red.url}</p>
                </div>
                <BotonIcono
                  etiqueta="Editar red social"
                  onClick={() => navigate(`${RUTA_REDES}/${red._id}/editar`)}
                >
                  <Edit2 className="h-4 w-4" />
                </BotonIcono>
                <BotonIcono
                  etiqueta="Eliminar red social"
                  tono="peligro"
                  onClick={() => confirmar({
                    titulo: "¿Eliminar esta red social?",
                    texto: `Se quitará “${red.nombre}” del sitio.`,
                    boton: "Eliminar",
                    accion: () => eliminar(red._id),
                  })}
                >
                  <Trash2 className="h-4 w-4" />
                </BotonIcono>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    );
  }

  if (cargando) {
    return <p className="p-5 text-sm text-slate-400" role="status">Cargando red social...</p>;
  }

  return (
    <Tarjeta className="mx-auto w-full max-w-2xl">
      <EncabezadoTarjeta titulo={modo === "editar" ? "Editar red social" : "Crear red social"} />
      <form onSubmit={handleGuardar} className="flex flex-col gap-4 p-5">
        <Campo etiqueta="Nombre">
          <input required maxLength={100} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Instagram" className={entrada} />
        </Campo>
        <Campo etiqueta="Enlace">
          <input required type="url" maxLength={500} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" className={entrada} />
        </Campo>
        <Campo etiqueta="Orden" ayuda="Las redes con número menor aparecen primero.">
          <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: e.target.value })} className={entrada} />
        </Campo>
        {modo === "editar" && (
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
            <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="h-4 w-4 cursor-pointer accent-primary-accent" />
            Mostrar en el sitio
          </label>
        )}
        <div className="flex justify-end gap-2">
          <Boton variante="secundario" onClick={() => navigate(RUTA_REDES)}>Volver al listado</Boton>
          <Boton type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : modo === "editar" ? "Guardar cambios" : "Crear red"}
          </Boton>
        </div>
      </form>
    </Tarjeta>
  );
};

export default Redes;
