import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, Plus, Trash2, Users } from "lucide-react";
import { apiFetch } from "../../../config/api";
import { useAuthStore } from "../../../stores/authStore";
import { useAdmin } from "../useAdmin";
import { Boton, BotonIcono, Campo, EncabezadoTarjeta, EstadoVacio, Insignia, Tarjeta, entrada } from "../ui";

const USUARIO_VACIO = { nombre: "", email: "", password: "", rol: "usuario" };
const RUTA_USUARIOS = "/PanelAdmin/usuarios";
const idDeUsuario = (usuario) => usuario.id ?? usuario._id;

const Usuarios = ({ modo = "lista" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, avisar, confirmar } = useAdmin();
  const usuarioActual = useAuthStore((state) => state.usuario);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(USUARIO_VACIO);
  const [cargando, setCargando] = useState(modo !== "crear");
  const [guardando, setGuardando] = useState(false);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      const respuesta = await apiFetch("/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || "No se pudieron cargar los usuarios.");
      }
      setUsuarios(datos.datos);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      avisar(error.message || "No se pudieron cargar los usuarios.", "error");
      if (modo !== "lista") navigate(RUTA_USUARIOS, { replace: true });
    } finally {
      setCargando(false);
    }
  }, [token, avisar, modo, navigate]);

  useEffect(() => {
    if (modo === "crear") {
      setForm(USUARIO_VACIO);
      setCargando(false);
      return;
    }
    cargarUsuarios();
  }, [modo, cargarUsuarios]);

  useEffect(() => {
    if (modo !== "editar" || cargando) return;
    const usuario = usuarios.find((item) => String(idDeUsuario(item)) === String(id));
    if (!usuario) {
      avisar("No se encontró el usuario solicitado.", "error");
      navigate(RUTA_USUARIOS, { replace: true });
      return;
    }
    setForm({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      password: "",
      rol: usuario.rol || "usuario",
    });
  }, [modo, id, usuarios, cargando, avisar, navigate]);

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const editando = modo === "editar";
    const cuerpo = {
      nombre: form.nombre.trim(),
      email: form.email.trim() || null,
      rol: form.rol,
      ...(!editando || form.password ? { password: form.password } : {}),
    };

    try {
      const respuesta = await apiFetch(
        editando ? `/api/usuarios/${id}` : "/api/usuarios",
        {
          method: editando ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cuerpo),
        }
      );
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || "No se pudo guardar el usuario.");
      }
      avisar(editando ? "Usuario actualizado." : "Usuario creado.");
      navigate(RUTA_USUARIOS);
    } catch (error) {
      console.error("Error guardando usuario:", error);
      avisar(error.message || "No se pudo guardar el usuario.", "error");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (usuario) => {
    try {
      const respuesta = await apiFetch(`/api/usuarios/${idDeUsuario(usuario)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || "No se pudo eliminar el usuario.");
      }
      avisar("Usuario eliminado.");
      await cargarUsuarios();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      avisar(error.message || "No se pudo eliminar el usuario.", "error");
    }
  };

  const pedirEliminar = (usuario) => confirmar({
    titulo: "¿Eliminar esta cuenta?",
    texto: `Se eliminará el usuario “${usuario.nombre}”. Esta acción no se puede deshacer.`,
    boton: "Eliminar usuario",
    accion: () => eliminar(usuario),
  });

  const esPropio = (usuario) =>
    String(idDeUsuario(usuario)) === String(usuarioActual?.id ?? usuarioActual?._id);

  if (modo === "lista") {
    return (
      <Tarjeta>
        <EncabezadoTarjeta
          titulo="Usuarios registrados"
          descripcion="Las contraseñas nunca se muestran. Solo un administrador puede gestionar estas cuentas."
          accion={<Boton onClick={() => navigate(`${RUTA_USUARIOS}/nueva`)}><Plus className="h-4 w-4" /> Nuevo usuario</Boton>}
        />
        {cargando ? (
          <p className="p-5 text-sm text-slate-400" role="status">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <EstadoVacio Icono={Users} titulo="No hay usuarios" texto="Creá la primera cuenta con el formulario." />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {usuarios.map((usuario) => (
              <li key={idDeUsuario(usuario)} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{usuario.nombre}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{usuario.email || "Sin correo"}</p>
                  <Insignia tono={usuario.rol === "admin" ? "rosa" : "gris"}>{usuario.rol}</Insignia>
                </div>
                <BotonIcono
                  etiqueta="Editar usuario"
                  onClick={() => navigate(`${RUTA_USUARIOS}/${idDeUsuario(usuario)}/editar`)}
                >
                  <Edit2 className="h-4 w-4" />
                </BotonIcono>
                <BotonIcono
                  etiqueta={esPropio(usuario) ? "No podés eliminar tu propia cuenta" : "Eliminar usuario"}
                  tono="peligro"
                  disabled={esPropio(usuario)}
                  onClick={() => pedirEliminar(usuario)}
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
    return <p className="p-5 text-sm text-slate-400" role="status">Cargando usuario...</p>;
  }

  return (
    <Tarjeta className="mx-auto w-full max-w-2xl">
      <EncabezadoTarjeta titulo={modo === "editar" ? "Editar usuario" : "Crear usuario"} />
      <form onSubmit={guardar} className="flex flex-col gap-4 p-5">
        <Campo etiqueta="Nombre de usuario">
          <input required maxLength={100} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className={entrada} autoComplete="username" />
        </Campo>
        <Campo etiqueta="Correo electrónico" ayuda="Opcional; debe ser único si se completa.">
          <input type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={entrada} autoComplete="email" />
        </Campo>
        <Campo
          etiqueta={modo === "editar" ? "Nueva contraseña" : "Contraseña"}
          ayuda={modo === "editar" ? "Dejala vacía para conservar la contraseña actual." : "Debe tener al menos 6 caracteres."}
        >
          <input
            type="password"
            required={modo === "crear"}
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={entrada}
            autoComplete="new-password"
          />
        </Campo>
        <Campo etiqueta="Rol">
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            disabled={modo === "editar" && String(id) === String(usuarioActual?.id ?? usuarioActual?._id)}
            className={entrada}
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </Campo>
        <div className="flex justify-end gap-2">
          <Boton variante="secundario" onClick={() => navigate(RUTA_USUARIOS)}>Volver al listado</Boton>
          <Boton type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : modo === "editar" ? "Guardar cambios" : "Crear usuario"}
          </Boton>
        </div>
      </form>
    </Tarjeta>
  );
};

export default Usuarios;
