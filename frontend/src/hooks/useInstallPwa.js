import { useSyncExternalStore } from "react";


const esContextoSeguro = () => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return window.isSecureContext || host === "localhost" || host === "127.0.0.1" || host === "[::1]";
};

const estaInstalada = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true);

let eventoDiferido = null;
let instalada = estaInstalada();
let instantanea = { puedeInstalar: false, instalada };
const oyentes = new Set();

const emitir = () => {
  instantanea = {
    puedeInstalar: Boolean(eventoDiferido) && esContextoSeguro(),
    instalada,
  };
  oyentes.forEach((oyente) => oyente());
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (evento) => {
    if (!esContextoSeguro()) return;
    evento.preventDefault();
    eventoDiferido = evento;
    emitir();
  });

  window.addEventListener("appinstalled", () => {
    eventoDiferido = null;
    instalada = true;
    emitir();
  });

  window.matchMedia("(display-mode: standalone)").addEventListener?.("change", () => {
    instalada = estaInstalada();
    emitir();
  });
}

const suscribir = (oyente) => {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
};

const obtenerInstantanea = () => instantanea;
const obtenerInstantaneaServidor = () => ({ puedeInstalar: false, instalada: false });

const detectarIOS = () => {
  if (typeof navigator === "undefined") return false;
  const esIphoneOIpad = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const esIpadModerno = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return esIphoneOIpad || esIpadModerno;
};

const instalar = async () => {
  if (!eventoDiferido) return "no-disponible";
  const evento = eventoDiferido;
  eventoDiferido = null;
  emitir();

  try {
    await evento.prompt();
    const { outcome } = await evento.userChoice;
    return outcome;
  } catch {
    return "no-disponible";
  }
};

export const useInstallPwa = () => {
  const estado = useSyncExternalStore(suscribir, obtenerInstantanea, obtenerInstantaneaServidor);
  return { ...estado, esIOS: detectarIOS(), instalar };
};
