import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, Plus, Tag, Trash2 } from "lucide-react";
import { apiFetch } from "../../../config/api";
import { useAdmin } from "../useAdmin";
import { Boton, BotonIcono, Campo, EncabezadoTarjeta, EstadoVacio, Insignia, Tarjeta, entrada } from "../ui";

const CATEGORIA_VACIA = { nombre: "", orden: 0, activo: true };
const RUTA_CATEGORIAS = "/PanelAdmin/categorias";

const Categorias = ({ modo = "lista" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, categorias, cargarCategorias, avisar, confirmar } = useAdmin();
  const [form, setForm] = useState(CATEGORIA_VACIA);
  const [cargando, setCargando] = useState(modo === "editar");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (modo !== "editar") {
      setForm(CATEGORIA_VACIA);
      setCargando(false);
      return undefined;
    }

    let vigente = true;
    const cargarCategoria = async () => {
      setCargando(true);
      try {
        const respuesta = await apiFetch("/api/categorias/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const datos = await respuesta.json();
        if (!respuesta.ok || !datos.exito) {
          throw new Error(datos.mensaje || "No se pudo cargar la categoría.");
        }
        const categoria = datos.datos.find((item) => String(item._id) === String(id));
        if (!categoria) throw new Error("No se encontró la categoría solicitada.");
        if (vigente) {
          setForm({
            nombre: categoria.nombre,
            orden: categoria.orden,
            activo: categoria.activo,
          });
        }
      } catch (error) {
        console.error("Error cargando categoría:", error);
        if (vigente) {
          avisar(error.message || "No se pudo cargar la categoría.", "error");
          navigate(RUTA_CATEGORIAS, { replace: true });
        }
      } finally {
        if (vigente) setCargando(false);
      }
    };

    cargarCategoria();
    return () => {
      vigente = false;
    };
  }, [modo, id, token, avisar, navigate]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const editando = modo === "editar";
      const respuesta = await apiFetch(
        editando ? `/api/categorias/${id}` : "/api/categorias",
        {
          method: editando ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, orden: Number(form.orden) || 0 }),
        }
      );
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        avisar(datos.mensaje || "No se pudo guardar la categoría.", "error");
        return;
      }

      avisar(editando ? "Categoría actualizada." : "Categoría creada.");
      await cargarCategorias();
      navigate(RUTA_CATEGORIAS);
    } catch (error) {
      console.error("Error guardando categoría:", error);
      avisar("Error de conexión al guardar la categoría.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (categoria, activo) => {
    try {
      const opciones = {
        method: activo ? "PUT" : "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      };
      if (activo) {
        opciones.headers["Content-Type"] = "application/json";
        opciones.body = JSON.stringify({ activo: true });
      }
      const respuesta = await apiFetch(`/api/categorias/${categoria._id}`, opciones);
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        avisar(datos.mensaje || "No se pudo actualizar la categoría.", "error");
        return;
      }
      avisar(activo ? "Categoría reactivada." : "Categoría dada de baja.");
      cargarCategorias();
    } catch (error) {
      console.error("Error cambiando estado de categoría:", error);
      avisar("Error de conexión al actualizar la categoría.", "error");
    }
  };

  const darDeBaja = (categoria) => confirmar({
    titulo: "¿Dar de baja esta categoría?",
    texto: `“${categoria.nombre}” dejará de aparecer para nuevas noticias. Las noticias existentes se conservan.`,
    boton: "Dar de baja",
    accion: () => cambiarEstado(categoria, false),
  });

  if (modo === "lista") {
    return (
      <Tarjeta>
        <EncabezadoTarjeta
          titulo="Categorías cargadas"
          descripcion="Las categorías dadas de baja se conservan en las noticias existentes."
          accion={<Boton onClick={() => navigate(`${RUTA_CATEGORIAS}/nueva`)}><Plus className="h-4 w-4" /> Nueva categoría</Boton>}
        />
        {categorias.length === 0 ? (
          <EstadoVacio Icono={Tag} titulo="No hay categorías" texto="Agregá una categoría para poder publicar noticias." />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {categorias.map((categoria) => (
              <li key={categoria._id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white">
                    {categoria.nombre}
                    <Insignia tono={categoria.activo ? "verde" : "gris"}>
                      {categoria.activo ? "Activa" : "Inactiva"}
                    </Insignia>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">Orden: {categoria.orden}</p>
                </div>
                <BotonIcono
                  etiqueta="Editar categoría"
                  onClick={() => navigate(`${RUTA_CATEGORIAS}/${categoria._id}/editar`)}
                >
                  <Edit2 className="h-4 w-4" />
                </BotonIcono>
                {categoria.activo ? (
                  <BotonIcono etiqueta="Dar de baja categoría" tono="peligro" onClick={() => darDeBaja(categoria)}>
                    <Trash2 className="h-4 w-4" />
                  </BotonIcono>
                ) : (
                  <Boton variante="secundario" onClick={() => cambiarEstado(categoria, true)}>
                    Reactivar
                  </Boton>
                )}
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    );
  }

  if (cargando) {
    return <p className="p-5 text-sm text-slate-400" role="status">Cargando categoría...</p>;
  }

  return (
    <Tarjeta className="mx-auto w-full max-w-2xl">
      <EncabezadoTarjeta titulo={modo === "editar" ? "Editar categoría" : "Crear categoría"} />
      <form onSubmit={handleGuardar} className="flex flex-col gap-4 p-5">
        <Campo etiqueta="Nombre">
          <input
            required
            maxLength={100}
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej.: Cultura"
            className={entrada}
          />
        </Campo>
        <Campo etiqueta="Orden" ayuda="Las categorías con número menor aparecen primero.">
          <input
            type="number"
            min="0"
            value={form.orden}
            onChange={(e) => setForm({ ...form, orden: e.target.value })}
            className={entrada}
          />
        </Campo>
        {modo === "editar" && (
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="h-4 w-4 cursor-pointer accent-primary-accent"
            />
            Disponible para nuevas noticias
          </label>
        )}
        <div className="flex justify-end gap-2">
          <Boton variante="secundario" onClick={() => navigate(RUTA_CATEGORIAS)}>Volver al listado</Boton>
          <Boton type="submit" disabled={guardando}>
            {guardando ? "Guardando…" : modo === "editar" ? "Guardar cambios" : "Crear categoría"}
          </Boton>
        </div>
      </form>
    </Tarjeta>
  );
};

export default Categorias;
