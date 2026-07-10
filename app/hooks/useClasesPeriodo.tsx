// Creado por Diego Castro
// Estado para obtener las clases del periodo actual del estudiante

import useSWR from "swr";
import { useEstudiante } from "./useEstudiante";
import {
  ClasesPeriodoActual,
  FilaClase,
  mapearClasesPeriodo,
} from "../interfaces/clases";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return (data.response as ClasesPeriodoActual[]).map(mapearClasesPeriodo);
};

export function useClasesPeriodo() {
  // constantes
  const { hijoActivo } = useEstudiante();
  const { data, error, isLoading, mutate } = useSWR<FilaClase[]>(
    hijoActivo ? `/api/estudiantes/obtenerClases` : null, // null = no fetch hasta tener hijoActivo
    fetcher,
  );

  return {
    clasesPeriodo: data ?? [],
    cargandoClases: isLoading,
    errorClases: !!error,
    reintentarClase: () => mutate(), // revalida sin necesidad del contador "intento"
  };
}
