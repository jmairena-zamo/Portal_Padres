// Creado por Diego Castro
// Estado para obtener quejas y sugerencias

import { useState, useEffect, useCallback } from "react";

export interface Queja {
  iD_QuejaSugerencia: number;
  iD_UserEmail: number;
  telefono: string;
  tipo: string;
  asunto: string;
  mensaje: string;
  fechaCreacion: string;
  fechaRespuesta?: string;
}

export function useQueja() {
  const [quejas, setQuejas] = useState<Queja[]>([]);
  const [cargandoQS, setCargandoQS] = useState(true);
  const [errorQS, setErrorQS] = useState(false);
  const [intento, setIntento] = useState(0);

  // llamada al endpoint para obtener quejas
  const cargarQuejas = useCallback(async () => {
    setCargandoQS(true);
    setErrorQS(false);
    const inicio = Date.now();

    try {
      const res = await fetch(`/api/quejas/obtenerQueja`);
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudieron cargar las quejas");
      }

      setQuejas(data.response ?? []);
    } catch {
      setErrorQS(true);
    } finally {
      // Delay mínimo para evitar parpadeo del loading, igual que en el resto del proyecto
      const transcurrido = Date.now() - inicio;
      const restante = Math.max(0, 1000 - transcurrido);
      setTimeout(() => setCargandoQS(false), restante);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarQuejas();
  }, [cargarQuejas, intento]);

  // Aumenta intento para disparar el useEffect
  const reintentar = () => setIntento((prev) => prev + 1);

  return { quejas, cargandoQS, errorQS, reintentar };
}
