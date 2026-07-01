import { useEffect, useState } from "react";
import {
  accionesEstudiantiles,
  FilaHistorialDisciplinario,
  mapearHistorialDisciplinario,
} from "../respuestasAPI/faltas";
import { useEstudiante } from "./useEstudiante";

export function useHistorialDisciplinario() {
  const { hijoActivo } = useEstudiante();
  const [historialDisciplinario, setHistorialDisciplinario] = useState<
    FilaHistorialDisciplinario[]
  >([]);
  const [cargandoDisciplinario, setCargandoDisciplinario] = useState(true);
  const [errorDisciplinario, setErrorDisciplinario] = useState(false);
  const [intentoDisciplinario, setIntentoDisciplinario] = useState(0);

  const cargarHistorialDisciplinario = async () => {
    setCargandoDisciplinario(true);
    setErrorDisciplinario(false);
    const inicio = Date.now();
    try {
      const res = await fetch("/api/estudiantes/obtenerFaltas");

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      const filas = (data.AccionesEstudiantiles as accionesEstudiantiles[]).map(
        mapearHistorialDisciplinario,
      );
      setHistorialDisciplinario(filas);

      const transcurrido = Date.now() - inicio;
      const restante = 1000 - transcurrido;
      if (restante > 0) {
        await new Promise((resolve) => setTimeout(resolve, restante));
      }
    } catch (error) {
      setErrorDisciplinario(true);
    } finally {
      const transcurrido = Date.now() - inicio;
      const restante = Math.max(0, 400 - transcurrido);
      setTimeout(() => setCargandoDisciplinario(false), restante);
    }
  };

  useEffect(() => {
    if (!hijoActivo) return;
    cargarHistorialDisciplinario();
  }, [hijoActivo, intentoDisciplinario]);

  const reintentarDisciplinario = () =>
    setIntentoDisciplinario((prev) => prev + 1);

  return {
    historialDisciplinario,
    cargandoDisciplinario,
    errorDisciplinario,
    reintentarDisciplinario,
  };
}
