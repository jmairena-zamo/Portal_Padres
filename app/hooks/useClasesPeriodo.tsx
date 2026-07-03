import { useEffect, useState } from "react";
import { useEstudiante } from "./useEstudiante";
import {
  ClasesPeriodoActual,
  FilaClase,
  mapearClasesPeriodo,
} from "../respuestasAPI/clases";

export function useClasesPeriodo() {
  const { hijoActivo } = useEstudiante();
  const [clasesPeriodo, setClasesPeriodo] = useState<FilaClase[]>([]);
  const [cargandoClases, setCargandoClases] = useState<boolean>(true);
  const [errorClases, setErrorClases] = useState<boolean>(false);
  const [intentoClases, setIntentoClases] = useState<number>(0);

  const cargarClasePeriodo = async () => {
    setCargandoClases(true);
    setErrorClases(false);
    const inicio = Date.now();
    try {
      const res = await fetch(`/api/estudiantes/obtenerClases`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const filas = (data.response as ClasesPeriodoActual[]).map(
        mapearClasesPeriodo,
      );
      setClasesPeriodo(filas);
    } catch (error) {
      setErrorClases(true);
    } finally {
      const transcurrido = Date.now() - inicio;
      const restante = Math.max(0, 400 - transcurrido);
      setTimeout(() => setCargandoClases(false), restante);
    }
  };

  useEffect(() => {
    if (!hijoActivo) return;
    cargarClasePeriodo();
  }, [hijoActivo, intentoClases]);

  const reintentarClase = () => setIntentoClases((prev) => prev + 1);

  return { clasesPeriodo, cargandoClases, errorClases, reintentarClase };
}
