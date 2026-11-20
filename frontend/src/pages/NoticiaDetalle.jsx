import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../config/api";
import ArticuloNoticia from "../components/noticias/ArticuloNoticia";
import PantallaCarga from "../components/layout/PantallaCarga";

const NoticiaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    apiFetch("/api/noticias")
      .then((res) => res.json())
      .then((data) => { if (data.exito) setNoticias(data.datos); })
      .catch((err) => console.error("Error al cargar la noticia:", err))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    apiFetch("/api/categorias")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.exito) throw new Error(data.mensaje || "No se pudieron cargar las categorías.");
        setCategorias(data.datos);
      })
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  const noticia = noticias.find((n) => String(n._id) === String(id));

  useEffect(() => {
    if (!noticia) return undefined;
    const tituloAnterior = document.title;
    document.title = `${noticia.titulo} | Radio Del Rosario 100.7 FM`;
    return () => { document.title = tituloAnterior; };
  }, [noticia]);

  if (cargando) return <PantallaCarga />;

  if (!noticia) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Esta noticia no está disponible</h1>
        <p className="text-sm text-slate-400">Puede haber sido eliminada o el enlace es incorrecto.</p>
        <Link to="/noticias" className="mt-2 rounded-full bg-primary-accent px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover">Ver todas las noticias</Link>
      </div>
    );
  }

  return (
    <ArticuloNoticia
      noticia={noticia}
      todasLasNoticias={noticias}
      categorias={categorias}
      onVolver={() => navigate("/noticias")}
      onSeleccionarNoticia={(n) => navigate(`/noticias/${n._id}`)}
      onFiltrarCategoria={(cat) => navigate(cat === "Todas" ? "/noticias" : `/noticias?categoria=${encodeURIComponent(cat)}`)}
    />
  );
};

export default NoticiaDetalle;
