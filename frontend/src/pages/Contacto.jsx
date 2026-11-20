import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, User, Tag, MessageSquare, Clock, ChevronRight, Headphones, Navigation, Music2 } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "../config/api";
import { useAuthStore } from "../stores/authStore";
import { Facebook, Instagram, Youtube } from "../components/ui/BrandIcons";
import contactoFondo from "../assets/Fondos/nosotros-fondo.jpg";

const EMAIL_CONTACTO = "fmdelrosario1976@gmail.com";
const UBICACION = { lat: -26.5, lon: -64.75 };
const HORARIO = { dias: "Lunes a Viernes", horas: "08:00 a 20:00 hs" };
const GOOGLE_MAPS = "https://www.google.com/maps/search/?api=1&query=Burruyac%C3%BA%2C+Tucum%C3%A1n%2C+Argentina";
const MAPA_EMBEBIDO = `https://www.openstreetmap.org/export/embed.html?bbox=${UBICACION.lon - 0.03}%2C${UBICACION.lat - 0.02}%2C${UBICACION.lon + 0.03}%2C${UBICACION.lat + 0.02}&layer=mapnik`;

const formatearTelefono = (linkWhatsapp) => {
  const digitos = (linkWhatsapp || "").replace(/\D/g, "");
  if (!digitos) return "";
  const grupos = digitos.match(/.{1,3}/g) || [digitos];
  return `+${grupos.join(" ")}`;
};

const IconoX = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const claseCampo =
  "w-full rounded-xl border border-white/10 bg-[#080a14]/80 py-3 pl-11 pr-3 text-sm text-white placeholder:text-slate-400 transition focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/25";

const Campo = ({ id, Icono, multilinea = false, ...props }) => {
  const Elemento = multilinea ? "textarea" : "input";
  return (
    <div className="relative">
      <Icono className={`pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400 ${multilinea ? "top-3.5" : "top-1/2 -translate-y-1/2"}`} />
      <label htmlFor={id} className="sr-only">{props.placeholder}</label>
      <Elemento id={id} className={`${claseCampo} ${multilinea ? "min-h-[120px] resize-y" : ""}`} {...props} />
    </div>
  );
};

const TarjetaCanal = ({ href, externo = false, Icono, etiqueta, valor, detalle, verde = false, valorChico = false }) => {
  const color = verde
    ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.3)]"
    : "border-primary-accent/70 bg-primary-accent/10 text-primary-accent shadow-[0_0_22px_rgba(255,46,99,0.35)]";
  const contenido = (
    <>
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 ${color}`}>
        <Icono className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-white">{etiqueta}</span>
        <span className={`mt-1 block font-bold leading-snug text-white [overflow-wrap:anywhere] ${valorChico ? "text-[13px] sm:text-sm" : "text-[15px] lg:text-base xl:text-lg"}`}>{valor}</span>
        <span className="mt-1 block text-xs leading-snug text-slate-400 lg:text-sm">{detalle}</span>
      </span>
      {href && <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 lg:hidden" />}
    </>
  );
  const clases = "flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b0d1a]/85 p-4 transition lg:flex-col lg:items-start lg:p-6";
  return href ? (
    <a href={href} {...(externo ? { target: "_blank", rel: "noreferrer" } : {})} className={`${clases} hover:border-primary-accent/50 hover:bg-[#10132a]`}>
      {contenido}
    </a>
  ) : (
    <div className={clases}>{contenido}</div>
  );
};

const Contacto = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const token = useAuthStore((state) => state.token);
  const [configRadio, setConfigRadio] = useState({
    redesSociales: { facebook: "", instagram: "", youtube: "", whatsapp: "" },
  });
  const [mensaje, setMensaje] = useState({ nombre: "", email: "", asunto: "", texto: "" });
  const [tipoFormulario, setTipoFormulario] = useState("contacto");
  const [pedidoTema, setPedidoTema] = useState({ tema: "", interprete: "", dedicatoria: "" });
  const [enviando, setEnviando] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState("");
  const [envioExitoso, setEnvioExitoso] = useState(false);
  const puedeEnviar = Boolean(usuario && token);

  useEffect(() => {
    if (!usuario) return;
    setMensaje((actual) => ({
      ...actual,
      nombre: actual.nombre || usuario.nombre,
      email: actual.email || usuario.email || "",
    }));
  }, [usuario?.nombre, usuario?.email]);

  useEffect(() => {
    apiFetch("/api/radio")
      .then((res) => res.json())
      .then((data) => {
        if (data.exito && data.datos) setConfigRadio(data.datos);
      })
      .catch((err) => console.error("Error al cargar configuración de contacto:", err));
  }, []);

  const redes = configRadio.redesSociales || {};
  const whatsappLink = redes.whatsapp || "";
  const telefonoFormateado = formatearTelefono(whatsappLink);
  const telHref = whatsappLink ? `tel:+${whatsappLink.replace(/\D/g, "")}` : null;

  const redesVisibles = [
    { id: "facebook", nombre: "Facebook", url: redes.facebook, Icono: Facebook },
    { id: "instagram", nombre: "Instagram", url: redes.instagram, Icono: Instagram },
    { id: "youtube", nombre: "YouTube", url: redes.youtube, Icono: Youtube },
    { id: "whatsapp", nombre: "WhatsApp", url: redes.whatsapp, Icono: MessageCircle },
    { id: "x", nombre: "X", url: redes.x || redes.twitter, Icono: IconoX },
  ].filter((red) => red.url);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (!puedeEnviar) {
      setEstadoEnvio("Iniciá sesión para enviar un mensaje o pedir un tema.");
      return;
    }

    setEnviando(true);
    setEstadoEnvio("");
    setEnvioExitoso(false);
    try {
      const asunto = tipoFormulario === "tema" ? "Pedido de tema" : mensaje.asunto;
      const texto =
        tipoFormulario === "tema"
          ? [
              `Tema: ${pedidoTema.tema.trim()}`,
              pedidoTema.interprete.trim() && `Intérprete: ${pedidoTema.interprete.trim()}`,
              pedidoTema.dedicatoria.trim() && `Dedicatoria: ${pedidoTema.dedicatoria.trim()}`,
            ]
              .filter(Boolean)
              .join("\n")
          : mensaje.texto;
      const respuesta = await apiFetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nombre: mensaje.nombre,
          email: mensaje.email,
          asunto,
          mensaje: texto,
        }),
      });
      const data = await respuesta.json();
      if (!respuesta.ok || !data.exito) {
        throw new Error(data.mensaje || "No se pudo enviar el mensaje.");
      }
      setMensaje({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        asunto: "",
        texto: "",
      });
      setPedidoTema({ tema: "", interprete: "", dedicatoria: "" });
      setEnvioExitoso(true);
      setEstadoEnvio(data.mensaje || "Tu mensaje se envió correctamente.");
    } catch (error) {
      console.error("Error al enviar mensaje de contacto:", error);
      setEstadoEnvio(error.message || "No se pudo enviar el mensaje. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  const onCambio = (campo) => (e) =>
    setMensaje((actual) => ({ ...actual, [campo]: e.target.value }));
  const onCambioTema = (campo) => (e) =>
    setPedidoTema((actual) => ({ ...actual, [campo]: e.target.value }));

  return (
    <div className="flex w-full flex-col gap-6 pb-10 text-left">
      <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#070912] sm:min-h-[600px] lg:min-h-[680px] xl:min-h-[740px]">
        <img
          src={contactoFondo}
          alt="Estudio de Radio Del Rosario 100.7 FM"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_30%] lg:left-[26%] lg:w-[74%] lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_38%)]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,9,18,0.5)_0%,rgba(7,9,18,0.82)_100%)] lg:hidden" />
        <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(7,9,18,0.9)_0%,rgba(7,9,18,0.55)_40%,rgba(7,9,18,0)_70%)] lg:block" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#08090d] to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-8">
          <div className="flex max-w-xl flex-col gap-5">
            <span className="flex w-fit items-center gap-2 rounded-full border border-primary-accent/40 bg-primary-accent/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-accent">
              <Headphones className="h-3.5 w-3.5" /> Contacto
            </span>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Estamos
              <span className="block bg-gradient-to-r from-primary-accent via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                en contacto
              </span>
            </h1>

            <p className="max-w-md text-sm leading-relaxed text-slate-200 sm:text-base">
              Tu opinión, consulta o mensaje es muy importante para nosotros. Completá el formulario o comunicate por los medios que te dejamos a continuación.
            </p>

            <div aria-hidden="true" className="mt-1 flex h-6 w-fit items-end gap-[3px] opacity-90">
              {Array.from({ length: 30 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-[3px] rounded-full bg-gradient-to-t from-primary-accent to-fuchsia-400 motion-reduce:animate-none animate-wave-${(i % 5) + 1}`}
                  style={{ height: `${6 + ((i * 7) % 5) * 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <TarjetaCanal
            Icono={Phone}
            etiqueta="Teléfono"
            href={telHref}
            valor={telefonoFormateado || "No disponible por el momento"}
            detalle="Llamanos o enviános un mensaje."
          />
          <TarjetaCanal
            Icono={MessageCircle}
            etiqueta="WhatsApp"
            verde
            externo
            href={whatsappLink || null}
            valor={telefonoFormateado || "No disponible por el momento"}
            detalle="Escribinos por WhatsApp, estamos conectados."
          />
          <TarjetaCanal
            Icono={Mail}
            etiqueta="Email"
            href={`mailto:${EMAIL_CONTACTO}`}
            valor={EMAIL_CONTACTO}
            valorChico
            detalle="Envíanos tu consulta por correo."
          />
          <TarjetaCanal
            Icono={MapPin}
            etiqueta="Dirección"
            href={GOOGLE_MAPS}
            externo
            valor="Burruyacú, Tucumán."
            detalle="Ubicación aproximada; no se indicó una dirección exacta."
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
          {puedeEnviar ? (
            <form onSubmit={handleEnviarMensaje} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0b0d1a]/85 p-5 sm:p-7">
              <div className="mb-2 flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary-accent/70 bg-primary-accent/10 text-primary-accent shadow-[0_0_22px_rgba(255,46,99,0.35)]">
                  {tipoFormulario === "tema" ? <Music2 className="h-6 w-6" /> : <Send className="h-6 w-6" />}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {tipoFormulario === "tema" ? "Pedí tu tema" : "Envíanos un mensaje"}
                  </h2>
                  <p className="text-sm text-slate-300">
                    Sesión iniciada como {usuario.nombre}. Completá el formulario y te responderemos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3" aria-label="Tipo de formulario">
                <button
                  type="button"
                  aria-pressed={tipoFormulario === "contacto"}
                  onClick={() => {
                    setTipoFormulario("contacto");
                    setEstadoEnvio("");
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    tipoFormulario === "contacto"
                      ? "border-primary-accent bg-primary-accent/15 text-white"
                      : "border-white/10 text-slate-300 hover:border-white/30"
                  }`}
                >
                  Enviar consulta
                </button>
                <button
                  type="button"
                  aria-pressed={tipoFormulario === "tema"}
                  onClick={() => {
                    setTipoFormulario("tema");
                    setEstadoEnvio("");
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    tipoFormulario === "tema"
                      ? "border-primary-accent bg-primary-accent/15 text-white"
                      : "border-white/10 text-slate-300 hover:border-white/30"
                  }`}
                >
                  Pedí tu tema
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Campo id="contacto-nombre" Icono={User} required value={mensaje.nombre} onChange={onCambio("nombre")} placeholder="Nombre y apellido" autoComplete="name" />
                <Campo id="contacto-email" Icono={Mail} required type="email" value={mensaje.email} onChange={onCambio("email")} placeholder="Email" autoComplete="email" />
              </div>

              {tipoFormulario === "tema" ? (
                <>
                  <Campo id="pedido-tema" Icono={Music2} required maxLength={150} value={pedidoTema.tema} onChange={onCambioTema("tema")} placeholder="Nombre del tema o canción" />
                  <Campo id="pedido-interprete" Icono={User} maxLength={150} value={pedidoTema.interprete} onChange={onCambioTema("interprete")} placeholder="Intérprete (opcional)" />
                  <Campo id="pedido-dedicatoria" Icono={MessageSquare} multilinea rows={4} maxLength={1000} value={pedidoTema.dedicatoria} onChange={onCambioTema("dedicatoria")} placeholder="Dedicatoria (opcional)" />
                </>
              ) : (
                <>
                  <Campo id="contacto-asunto" Icono={Tag} required value={mensaje.asunto} onChange={onCambio("asunto")} placeholder="Asunto" />
                  <Campo id="contacto-mensaje" Icono={MessageSquare} multilinea required rows={5} value={mensaje.texto} onChange={onCambio("texto")} placeholder="Tu mensaje..." />
                </>
              )}

              {estadoEnvio && (
                <p role="status" className={`text-sm ${envioExitoso ? "text-emerald-300" : "text-rose-300"}`}>
                  {estadoEnvio}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  enviando ||
                  (tipoFormulario === "tema" && !pedidoTema.tema.trim())
                }
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-accent to-pink-500 px-4 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,46,99,0.3)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-60"
              >
                {tipoFormulario === "tema" ? <Music2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                {enviando ? "Enviando..." : tipoFormulario === "tema" ? "Pedir tema" : "Enviar mensaje"}
              </button>
            </form>
          ) : (
            <section className="flex flex-col justify-center gap-4 rounded-2xl border border-white/10 bg-[#0b0d1a]/85 p-6 sm:p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-accent/70 bg-primary-accent/10 text-primary-accent">
                <User className="h-6 w-6" />
              </span>
              <h2 className="text-xl font-bold text-white">Iniciá sesión para participar</h2>
              <p className="text-sm leading-relaxed text-slate-300">
                Para enviar una consulta o pedir un tema necesitás iniciar sesión.
                Si todavía no tenés cuenta, podés registrarte gratis.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/ingresar"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-accent to-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-primary-accent/60 hover:bg-white/5"
                >
                  Crear cuenta
                </Link>
              </div>
            </section>
          )}

          <div className="flex flex-col gap-5">
            <div className="relative min-h-[270px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d1a]">
              <iframe
                title="Mapa de Burruyacú, Tucumán"
                src={MAPA_EMBEBIDO}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none absolute inset-0 h-full w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.6)_brightness(0.85)_contrast(0.95)]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[#2a0a3a]/20 mix-blend-color" />
              <MapPin aria-hidden="true" className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-full fill-primary-accent/30 text-primary-accent drop-shadow-[0_0_10px_rgba(255,46,99,0.9)]" />

              <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0d1a]/90 p-3 backdrop-blur-md sm:right-auto sm:max-w-[320px]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-accent/60 bg-primary-accent/10 text-primary-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">Nuestra ubicación</p>
                  <p className="text-xs text-slate-300">Centro de Burruyacú (ubicación aproximada).</p>
                  <a href={GOOGLE_MAPS} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-primary-accent/60 px-3 py-1 text-[11px] font-semibold text-primary-accent transition hover:bg-primary-accent/10">
                    <Navigation className="h-3 w-3" /> Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b0d1a]/85 p-5 sm:flex-row sm:items-center">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary-accent/70 bg-primary-accent/10 text-primary-accent shadow-[0_0_22px_rgba(255,46,99,0.35)]">
                <Clock className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">Horarios de atención</h3>
                <p className="mt-1 text-sm text-slate-300">{HORARIO.dias}</p>
                <p className="text-sm font-semibold text-white">{HORARIO.horas}</p>
              </div>
              <p className="text-xs leading-snug text-slate-400 sm:max-w-[190px] sm:border-l sm:border-white/10 sm:pl-4">
                Fuera de este horario podés dejarnos tu mensaje y te contactaremos.
              </p>
            </div>
          </div>
        </div>

        {redesVisibles.length > 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b0d1a]/85 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="hidden h-8 items-end gap-[3px] sm:flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`w-[3px] rounded-full bg-primary-accent motion-reduce:animate-none animate-wave-${i + 1}`} style={{ height: `${10 + (i % 3) * 6}px` }} />
                ))}
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Seguinos en nuestras redes</h3>
                <p className="text-xs text-slate-400">Enterate de todas las novedades, programas y mucho más.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {redesVisibles.map(({ id, nombre, url, Icono }) => (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={nombre}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-accent/60 text-primary-accent transition hover:bg-primary-accent/15 hover:shadow-[0_0_18px_rgba(255,46,99,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent"
                >
                  <Icono className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacto;
