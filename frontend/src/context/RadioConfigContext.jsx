import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../config/api";
import { useAudio } from "./AudioContext";


const RadioConfigContext = createContext({ configRadio: null });

export const RadioConfigProvider = ({ children }) => {
  const [configRadio, setConfigRadio] = useState(null);
  const { setStreamUrl } = useAudio();

  useEffect(() => {
    apiFetch("/api/radio")
      .then((res) => res.json())
      .then((data) => {
        if (data.exito && data.datos) {
          setConfigRadio(data.datos);
          if (data.datos.streamUrl) setStreamUrl(data.datos.streamUrl);
        }
      })
      .catch((err) => console.error("Error al cargar configuración inicial de radio:", err));

    apiFetch("/api/redes-sociales")
      .then((res) => res.json())
      .then((data) => {
        if (data.exito) {
          const redesSociales = data.datos.reduce(
            (redes, red) => ({ ...redes, [red.nombre.toLowerCase()]: red.url }),
            {}
          );
          setConfigRadio((actual) => ({ ...actual, redesSociales }));
        }
      })
      .catch((err) => console.error("Error al cargar redes sociales:", err));
  }, [setStreamUrl]);

  const valor = useMemo(() => ({ configRadio }), [configRadio]);
  return <RadioConfigContext.Provider value={valor}>{children}</RadioConfigContext.Provider>;
};

export const useRadioConfig = () => useContext(RadioConfigContext);
