// Creado por Diego Castro
// Estado para obtener la información de historial disciplinario

import { useEffect, useState } from "react";
import {
  accionesEstudiantiles,
  FilaHistorialDisciplinario,
  mapearHistorialDisciplinario,
} from "../interfaces/faltas";
import { useEstudiante } from "./useEstudiante";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return (data.AccionesEstudiantiles as accionesEstudiantiles[]).map(
    mapearHistorialDisciplinario,
  );
};

export function useHistorialDisciplinario() {
  const { hijoActivo } = useEstudiante();

  const { data, error, isLoading, mutate } = useSWR<
    FilaHistorialDisciplinario[]
  >(hijoActivo ? "/api/estudiantes/obtenerFaltas" : null, fetcher);

  return {
    historialDisciplinario: data ?? [],
    cargandoDisciplinario: isLoading,
    errorDisciplinario: !!error,
    reintentarDisciplinario: mutate(),
  };
}
