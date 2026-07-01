import { useEffect, useState } from "react";
import { useEstudiante } from "./useEstudiante";
import {
  FilaCuenta,
  mapearMovimiento,
  MovimientoCuenta,
} from "../respuestasAPI/estadoCuenta";

export function useEstadoCuenta() {
  const { hijoActivo } = useEstudiante();
  const [estadoCuenta, setEstadoCuenta] = useState<FilaCuenta[]>([]);
  const [cargandoEstadoCuenta, setCargandoEstadoCuenta] =
    useState<boolean>(true);
  const [errorEstadoCuenta, setErrorEstadoCuenta] = useState<boolean>(false);
  const [intentoEstadoCuenta, setIntentoEstadoCuenta] = useState(0);
  const [balance, setBalance] = useState(0);

  const cargarEstadoCuenta = async () => {
    setCargandoEstadoCuenta(true);
    setErrorEstadoCuenta(false);
    const inicio = Date.now();
    try {
      const res = await fetch("/api/estudiantes/obtenerEstadoCuenta");

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      const filas = (data.response.details as MovimientoCuenta[])
        .map(mapearMovimiento)
        .sort((a, b) => a.id - b.id);
      setEstadoCuenta(filas);
      setBalance(data.response.balance);
    } catch (error) {
      console.log("Error de conexión. Intenta de nuevo.");
      setErrorEstadoCuenta(true);
    } finally {
      const transcurrido = Date.now() - inicio;
      const restante = Math.max(0, 400 - transcurrido);
      setTimeout(() => setCargandoEstadoCuenta(false), restante);
    }
  };

  useEffect(() => {
    if (!hijoActivo) return;
    cargarEstadoCuenta();
  }, [hijoActivo, intentoEstadoCuenta]);

  const reintentarEstadoCuenta = () =>
    setIntentoEstadoCuenta((prev) => prev + 1);

  return {
    estadoCuenta,
    cargandoEstadoCuenta,
    errorEstadoCuenta,
    reintentarEstadoCuenta,
    balance,
  };
}
