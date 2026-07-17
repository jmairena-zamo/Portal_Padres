// Creado por Diego Castro
// Estado para obtener la información de historial disciplinario

import {
  accionesEstudiantiles,
  FilaHistorialDisciplinario,
  mapearHistorialDisciplinario,
} from "../interfaces/faltas";
import { useEstudiante } from "./useEstudiante";
import useSWR from "swr";

// Función que trae los datos desde la API y los transforma
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();

  // Se convierte la respuesta en una lista de acciones disciplinarias
  return (data.AccionesEstudiantiles as accionesEstudiantiles[]).map(
    mapearHistorialDisciplinario,
  );
};

// Hook personalizado para manejar el historial disciplinario
export function useHistorialDisciplinario() {
  const { hijoActivo } = useEstudiante();

  // Se usa SWR para traer y mantener actualizados los datos
  const { data, error, isLoading, mutate } = useSWR<
    FilaHistorialDisciplinario[]
  >(hijoActivo ? "/api/estudiantes/obtenerFaltas" : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // Se devuelven los datos listos para usar en los componentes
  return {
    historialDisciplinario: data ?? [],
    cargandoDisciplinario: isLoading,
    errorDisciplinario: !!error,
    reintentarDisciplinario: mutate,
  };
}
