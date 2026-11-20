import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../config/api";
import { useAdmin } from "../useAdmin";
import EditorNoticia from "./EditorNoticia";

const FormularioNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { avisar } = useAdmin();
  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(Boolean(id));

  useEffect(() => {
    let vigente = true;

    if (!id) {
      setNoticia(null);
      setCargando(false);
      return () => {
        vigente = false;
      };
    }

    const cargarNoticia = async () => {
      setCargando(true);
      try {
        const respuesta = await apiFetch(`/api/noticias/${id}`);
        const datos = await respuesta.json();
        if (!respuesta.ok || !datos.exito) {
          throw new Error(datos.mensaje || "No se pudo cargar la noticia.");
        }
        if (vigente) setNoticia(datos.datos);
      } catch (error) {
        console.error("Error cargando noticia:", error);
        if (vigente) {
          avisar(error.message || "No se pudo cargar la noticia.", "error");
          navigate("/PanelAdmin/noticias", { replace: true });
        }
      } finally {
        if (vigente) setCargando(false);
      }
    };

    cargarNoticia();
    return () => {
      vigente = false;
    };
  }, [id, avisar, navigate]);

  if (cargando) {
    return <p className="p-5 text-sm text-slate-400" role="status">Cargando noticia...</p>;
  }

  if (id && !noticia) return null;

  return (
    <EditorNoticia
      key={id || "nueva"}
      noticia={noticia}
      pantallaCompleta
      onCerrar={() => navigate("/PanelAdmin/noticias")}
    />
  );
};

export default FormularioNoticia;
