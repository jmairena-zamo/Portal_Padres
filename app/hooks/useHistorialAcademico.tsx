// Creado por Diego Castro
// Estado para obtener el Historial Academico

import useSWR from "swr";
import {
  CursoHistorial,
  FilaHistorial,
  mapearCurso,
} from "../interfaces/historialAcademico";
import { useEstudiante } from "./useEstudiante";

// Función para obtener el historial académico desde la API
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return (data.response as CursoHistorial[]).map(mapearCurso);
};

export function useHistorialAcademico() {
  const { hijoActivo } = useEstudiante();

  const { data, error, isLoading, mutate } = useSWR<FilaHistorial[]>(
    hijoActivo ? "/api/estudiantes/obtenerHistorialAcademico" : null,
    fetcher,
  );

  return {
    historialAcademico: data ?? [],
    cargandoHistorialAcademico: isLoading,
    errorHistorialAcademico: !!error,
    reintentarHistorialAcademico: mutate(),
  };
}
