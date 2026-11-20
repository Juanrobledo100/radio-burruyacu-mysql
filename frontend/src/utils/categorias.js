import {
  LayoutGrid,
  MapPin,
  ShieldAlert,
  HeartPulse,
  Landmark,
  TrendingUp,
  Newspaper,
} from "lucide-react";

export const CATEGORIA_META = {
  Todas: { Icono: LayoutGrid, color: "text-primary-accent", dot: "bg-primary-accent" },
  Policiales: { Icono: ShieldAlert, color: "text-red-400", dot: "bg-red-400" },
  Salud: { Icono: HeartPulse, color: "text-emerald-400", dot: "bg-emerald-400" },
  Locales: { Icono: MapPin, color: "text-sky-400", dot: "bg-sky-400" },
  Política: { Icono: Landmark, color: "text-amber-400", dot: "bg-amber-400" },
  Economía: { Icono: TrendingUp, color: "text-purple-400", dot: "bg-purple-400" },
};

export const metaDeCategoria = (categoria) =>
  CATEGORIA_META[categoria] || { Icono: Newspaper, color: "text-slate-400", dot: "bg-slate-400" };

export const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const formatHora = (fecha) =>
  new Date(fecha).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const tiempoLectura = (contenido = "") => {
  const palabras = contenido.trim().split(/\s+/).filter(Boolean).length;
  const minutos = Math.max(1, Math.round(palabras / 200));
  return `${minutos} min de lectura`;
};
