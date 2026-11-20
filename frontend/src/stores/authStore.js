import { create } from "zustand";
import { apiFetch } from "../config/api";

export const useAuthStore = create((set) => ({
  token: null,
  usuario: null,
  estaAutenticado: false,

  login: async (nombre, password) => {
    try {
      const respuesta = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password }),
      });
      const datos = await respuesta.json();

      if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || "Error al iniciar sesión");
      }

      set({ token: datos.token, usuario: datos.usuario, estaAutenticado: true });
      return { exito: true, usuario: datos.usuario };
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      return { exito: false, mensaje: error.message };
    }
  },

  register: async (nombre, email, password) => {
    try {
      const respuesta = await apiFetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });
      const datos = await respuesta.json();

      if (!respuesta.ok || !datos.exito) {
        throw new Error(datos.mensaje || "Error al crear la cuenta");
      }

      set({ token: datos.token, usuario: datos.usuario, estaAutenticado: true });
      return { exito: true };
    } catch (error) {
      console.error("Error al crear la cuenta:", error.message);
      return { exito: false, mensaje: error.message };
    }
  },

  logout: () => set({ token: null, usuario: null, estaAutenticado: false }),
}));

if (typeof window !== "undefined") {
  window.addEventListener("auth:unauthorized", () => {
    useAuthStore.getState().logout();
  });
}
