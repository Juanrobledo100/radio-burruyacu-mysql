import { LayoutDashboard, Newspaper, Mail, Share2, Settings, Tags, Users, Image } from "lucide-react";

export const SECCIONES = [
  { ruta: "/PanelAdmin", fin: true, label: "Resumen", Icono: LayoutDashboard, titulo: "Resumen", sub: "Un vistazo al estado de la radio y del sitio." },
  { ruta: "/PanelAdmin/noticias", label: "Noticias", Icono: Newspaper, titulo: "Noticias", sub: "Publicá, editá y ordená las noticias del sitio." },
  { ruta: "/PanelAdmin/categorias", label: "Categorías", Icono: Tags, titulo: "Categorías", sub: "Organizá las categorías de las noticias." },
  { ruta: "/PanelAdmin/mensajes", label: "Mensajes", Icono: Mail, titulo: "Mensajes", sub: "Consultas recibidas desde el formulario de contacto." },
  { ruta: "/PanelAdmin/redes", label: "Redes sociales", Icono: Share2, titulo: "Redes sociales", sub: "Enlaces que se muestran en la web." },
  { ruta: "/PanelAdmin/usuarios", label: "Usuarios", Icono: Users, titulo: "Usuarios", sub: "Creá y administrá las cuentas del sistema." },
  { ruta: "/PanelAdmin/banners", label: "Banners", Icono: Image, titulo: "Banners", sub: "Administrá los banners principales del sitio." },
  { ruta: "/PanelAdmin/configuracion", label: "Configuración", Icono: Settings, titulo: "Configuración", sub: "Datos de la emisora, logo y transmisión." },
];

export const seccionDePath = (pathname) => {
  const limpio = pathname.replace(/\/+$/, "") || "/";
  const seccion = SECCIONES.find((s) => (s.fin ? limpio === s.ruta : limpio.startsWith(s.ruta))) || SECCIONES[0];
  const recursos = {
    "/PanelAdmin/noticias": { nombre: "noticia", nueva: "una noticia", existente: "la noticia" },
    "/PanelAdmin/categorias": { nombre: "categoría", nueva: "una categoría", existente: "la categoría" },
    "/PanelAdmin/redes": { nombre: "red social", nueva: "una red social", existente: "la red social" },
    "/PanelAdmin/usuarios": { nombre: "usuario", nueva: "un usuario", existente: "el usuario" },
    "/PanelAdmin/banners": { nombre: "banner", nueva: "un banner", existente: "el banner" },
  };
  const recurso = recursos[seccion.ruta];
  if (!recurso) return seccion;

  if (limpio.endsWith("/nueva") || limpio.endsWith("/nuevo")) {
    return { ...seccion, titulo: `Crear ${recurso.nombre}`, sub: `Completá los datos para crear ${recurso.nueva}.` };
  }
  if (limpio.endsWith("/editar")) {
    return { ...seccion, titulo: `Editar ${recurso.nombre}`, sub: `Actualizá los datos de ${recurso.existente}.` };
  }
  return seccion;
};

export const calcularChecklist = (configRadio, redesActivas) => [
  { ok: Boolean(configRadio.nombre), texto: "Nombre de la emisora", ir: "/PanelAdmin/configuracion" },
  { ok: Boolean(configRadio.logoUrl), texto: "Logo cargado", ir: "/PanelAdmin/configuracion" },
  { ok: Boolean(configRadio.streamUrl), texto: "Transmisión en vivo (stream)", ir: "/PanelAdmin/configuracion" },
  { ok: Boolean(configRadio.redesSociales?.whatsapp), texto: "WhatsApp de contacto", ir: "/PanelAdmin/redes" },
  { ok: redesActivas > 0, texto: "Al menos una red social activa", ir: "/PanelAdmin/redes" },
];
