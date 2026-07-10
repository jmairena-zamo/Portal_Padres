// Creado por Diego Castro
// Estado para el Estado de Cuenta

import useSWR from "swr";
import { useEstudiante } from "./useEstudiante";
import {
  FilaCuenta,
  mapearMovimiento,
  MovimientoCuenta,
} from "../interfaces/estadoCuenta";

interface EstadoCuentaResponse {
  filas: FilaCuenta[];
  balance: number;
}

const fetcher = async (url: string): Promise<EstadoCuentaResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  const filas = (data.response.details as MovimientoCuenta[])
    .map(mapearMovimiento)
    .sort((a, b) => a.id - b.id);

  return { filas, balance: data.response.balance };
};

export function useEstadoCuenta() {
  // Constantes
  const { hijoActivo } = useEstudiante();
  const { data, error, isLoading, mutate } = useSWR<EstadoCuentaResponse>(
    hijoActivo ? "/api/estudiantes/obtenerEstadoCuenta" : null,
    fetcher,
  );

  return {
    estadoCuenta: data?.filas ?? [],
    balance: data?.balance ?? 0,
    cargandoEstadoCuenta: isLoading,
    errorEstadoCuenta: !!error,
    reintentarEstadoCuenta: () => mutate(),
  };
}
