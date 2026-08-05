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
  const MIN_LOADING_MS = 300;
  const esperar = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await esperar(MIN_LOADING_MS);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();

  // Se convierte la respuesta en lista de Historial Academico
  return (data.response as CursoHistorial[]).map(mapearCurso);
};

// Hook personalizado para manejar el historial academico
export function useHistorialAcademico() {
  const { hijoActivo } = useEstudiante();

  // Se usa SWR para traer y mantener actualizados los datos
  // Se quita la validación automatica para que el Loading
  // no aparesca momentaneamente en la pantalla
  const { data, error, isLoading, mutate } = useSWR<FilaHistorial[]>(
    hijoActivo ? "/api/estudiantes/obtenerHistorialAcademico" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  // Se devuelven los datos listos para usar en los componentes
  return {
    historialAcademico: data ?? [],
    cargandoHistorialAcademico: isLoading,
    errorHistorialAcademico: !!error,
    reintentarHistorialAcademico: mutate,
  };
}
