import { useEffect, useState } from "react";
import {
  CursoHistorial,
  FilaHistorial,
  mapearCurso,
} from "../respuestasAPI/historialAcademico";
import { useEstudiante } from "./useEstudiante";

export function useHistorialAcademico() {
  const { hijoActivo } = useEstudiante();
  const [historialAcademico, setHistorialAcademico] = useState<FilaHistorial[]>(
    [],
  );
  const [cargandoHistorialAcademico, setCargandoHistorialAcademico] =
    useState<boolean>(true);
  const [errorHistorialAcademico, setErrorHistorialAcademico] =
    useState<boolean>(false);
  const [intentoHistorialAcademico, setIntentoHistorialAcademico] = useState(0);

  const cargarHistorialAcademico = async () => {
    setCargandoHistorialAcademico(true);
    setErrorHistorialAcademico(false);
    const inicio = Date.now();
    try {
      const res = await fetch(`/api/estudiantes/obtenerHistorialAcademico`);

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      const filas = (data.response as CursoHistorial[]).map(mapearCurso);
      setHistorialAcademico(filas);
    } catch (error) {
      console.error("Error cargando historial:", error);
      setErrorHistorialAcademico(true);
    } finally {
      const transcurrido = Date.now() - inicio;
      const restante = Math.max(0, 400 - transcurrido);
      setTimeout(() => setCargandoHistorialAcademico(false), restante);
    }
  };

  useEffect(() => {
    if (!hijoActivo) return;
    cargarHistorialAcademico();
  }, [hijoActivo, intentoHistorialAcademico]);

  const reintentarHistorialAcademico = () =>
    setIntentoHistorialAcademico((prev) => prev + 1);

  return {
    historialAcademico,
    cargandoHistorialAcademico,
    errorHistorialAcademico,
    reintentarHistorialAcademico,
  };
}
