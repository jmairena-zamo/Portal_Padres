// Creado por Diego Castro
// Contexto y Hook para la información del estudiante/hijo

"use client";

import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { infoEstudiante } from "../interfaces/infoEstudiante";

// Tipo de dato para representar a un hijo
interface Hijo {
  bannerID: number;
  Nombre: string;
}

// Tipo de dato que define todo lo que guardará y compartirá el contexto
interface EstudianteContextType {
  cargando: boolean;
  estudiante: infoEstudiante | null;
  error: string | null;

  hijos: Hijo[];
  hijoActivo: Hijo | null;
  seleccionarEstudiante: (hijo: Hijo) => Promise<void>;

  cargarEstudiante: () => Promise<void>;
}

// Se crea el contexto que compartirá la información
const EstudianteContext = createContext<EstudianteContextType | null>(null);

export const EstudianteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Constantes Información general
  const [cargando, setCargando] = useState<boolean>(false);
  const [estudiante, setEstudiante] = useState<infoEstudiante | null>(null);

  const [hijos, setHijos] = useState<Hijo[]>([]);
  const [hijoActivo, setHijoActivo] = useState<Hijo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Al iniciar, se cargan unos hijos de prueba
  useEffect(() => {
    const hijosMock = [
      { bannerID: 27027, Nombre: "ISABELA EUGENIA MARENCO GUTIÉRREZ" },
      { bannerID: 26029, Nombre: "CAMILO GUILLERMO MORALES PALACIOS" },
      { bannerID: 26024, Nombre: "ARIANA JASMIN REYES PINEDA" },
      { bannerID: 27030, Nombre: "LUIS EDUARDO LORENZO ESPINAL" },
    ];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHijos(hijosMock);

    // Se selecciona el primer hijo por defecto
    if (hijosMock.length > 0) {
      setHijoActivo(hijosMock[0]);
    }
  }, []);

  // Cada vez que cambia el hijo activo, se cargan sus datos
  useEffect(() => {
    if (!hijoActivo) return;
    // eslint-disable-next-line react-hooks/immutability
    cargarEstudiante();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hijoActivo]);

  // Función para cambiar de hijo y avisar al backend
  const seleccionarEstudiante = async (hijo: Hijo) => {
    await fetch("/api/auth/seleccionarEstudiante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bannerID: hijo.bannerID }),
    });
    setHijoActivo(hijo);
  };

  // Función para traer la información del estudiante desde la API
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const cargarEstudiante = useCallback(async () => {
    setCargando(true);
    try {
      const resInfo = await fetch("/api/estudiantes/obtenerInfoGen");

      const dataInfo = await resInfo.json();

      if (
        !resInfo.ok ||
        !dataInfo?.response ||
        typeof dataInfo.response !== "object"
      ) {
        setEstudiante(null);
        setError(dataInfo?.error ?? "Estudiante no encontrado");
        return;
      }

      setEstudiante(dataInfo.response);
    } catch (error) {
      console.log("Error cargando información:", error);
      setEstudiante(null);
    } finally {
      setCargando(false);
    }
  }, []);

  // Se prepara el valor que se compartirá en el contexto
  const value = useMemo(
    () => ({
      cargando,
      estudiante,
      hijoActivo,
      hijos,
      error,
      seleccionarEstudiante,
      cargarEstudiante,
    }),
    [cargando, estudiante, hijoActivo, hijos, error, cargarEstudiante],
  );

  // Se devuelve el proveedor del contexto
  return (
    <EstudianteContext.Provider value={value}>
      {children}
    </EstudianteContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useEstudiante = () => {
  const context = use(EstudianteContext);

  if (!context) {
    throw new Error("useFotoEstudiante debe usarse dentro de FotoProvider");
  }

  return context;
};
