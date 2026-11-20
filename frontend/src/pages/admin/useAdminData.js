import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../config/api";

export const useAdminData = (token, rol) => {
  const [noticias, setNoticias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [redesSociales, setRedesSociales] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [configRadio, setConfigRadio] = useState({
    nombre: "",
    streamUrl: "",
    redesSociales: { facebook: "", instagram: "", youtube: "", whatsapp: "" },
  });

  const cargarNoticias = useCallback(() => {
    apiFetch("/api/noticias")
      .then((res) => res.json())
      .then((data) => { if (data.exito) setNoticias(data.datos); })
      .catch((err) => console.error("Error cargando noticias admin:", err));
  }, []);

  const cargarRedes = useCallback(async () => {
    try {
      const res = await apiFetch("/api/redes-sociales/admin", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.exito) setRedesSociales(data.datos);
    } catch (err) {
      console.error("Error cargando redes sociales:", err);
    }
  }, [token]);

  const cargarCategorias = useCallback(async () => {
    try {
      const esAdmin = rol === "admin";
      const res = await apiFetch(
        esAdmin ? "/api/categorias/admin" : "/api/categorias",
        esAdmin ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      const data = await res.json();
      if (!res.ok || !data.exito) throw new Error(data.mensaje || "No se pudieron cargar las categorías.");
      setCategorias(data.datos);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  }, [token, rol]);

  const cargarConfiguracion = useCallback(async () => {
    try {
      const res = await apiFetch("/api/radio");
      const data = await res.json();
      if (data.exito && data.datos) {
        setConfigRadio(data.datos);
        return data.datos;
      }
    } catch (err) {
      console.error("Error cargando config admin:", err);
    }
    return null;
  }, []);

  const cargarMensajes = useCallback(async () => {
    try {
      const res = await apiFetch("/api/contacto", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.exito) throw new Error(data.mensaje || "No se pudieron cargar los mensajes.");
      setMensajes(data.datos);
    } catch (err) {
      console.error("Error cargando mensajes de contacto:", err);
    }
  }, [token]);

  const actualizarEstadoMensaje = useCallback(async (id, estado) => {
    const res = await apiFetch(`/api/contacto/${id}/estado`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado }),
    });
    const data = await res.json();
    if (!res.ok || !data.exito) {
      throw new Error(data.mensaje || "No se pudo actualizar el estado del mensaje.");
    }
    setMensajes((actuales) =>
      actuales.map((mensaje) =>
        String(mensaje._id) === String(id) ? data.datos : mensaje
      )
    );
    return data.datos;
  }, [token]);

  useEffect(() => {
    cargarNoticias();
    cargarCategorias();
    cargarConfiguracion();
    cargarRedes();
    cargarMensajes();
  }, [cargarNoticias, cargarCategorias, cargarConfiguracion, cargarRedes, cargarMensajes]);

  return {
    noticias, categorias, redesSociales, mensajes, configRadio,
    setConfigRadio, cargarNoticias, cargarCategorias, cargarRedes, cargarConfiguracion, cargarMensajes,
    actualizarEstadoMensaje,
  };
};
