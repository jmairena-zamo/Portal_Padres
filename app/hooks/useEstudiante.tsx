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
  foto: string | null;
  faltasTotales: number;
  faltasTotalesAnio: number;
  categoriaDisc: string | null;
  estudiante: infoEstudiante | null;

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
  const [foto, setFoto] = useState<string | null>(null);
  const [faltasTotales, setFaltasTotales] = useState<number>(0);
  const [faltasTotalesAnio, setFaltasTotalesAnio] = useState<number>(0);
  const [categoriaDisc, setCategoriaDisc] = useState<string | null>(null);
  const [estudiante, setEstudiante] = useState<infoEstudiante | null>(null);

  const [hijos, setHijos] = useState<Hijo[]>([]);
  const [hijoActivo, setHijoActivo] = useState<Hijo | null>(null);

  // Al iniciar, se cargan unos hijos de prueba
  useEffect(() => {
    const hijosMock = [
      { bannerID: 1, Nombre: "Carlos Martínez" },
      { bannerID: 2, Nombre: "Sofía Martínez" },
      { bannerID: 3, Nombre: "Luis Martínez" },
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
      const inicio = Date.now();

      // Se hacen varias peticiones al mismo tiempo
      const [resFoto, resFaltas, resInfo] = await Promise.all([
        fetch("/api/estudiantes/obtenerFoto"),
        fetch("/api/estudiantes/obtenerFaltas"),
        fetch("/api/estudiantes/obtenerInfoGen"),
      ]);

      const [dataFoto, dataFaltas, dataInfo] = await Promise.all([
        resFoto.json(),
        resFaltas.json(),
        resInfo.json(),
      ]);

      // Se guardan los datos en las variables
      setFoto(dataFoto.foto ?? null);
      setFaltasTotales(dataFaltas.Tfaltas);
      setFaltasTotalesAnio(dataFaltas.TfaltasAnio);
      setCategoriaDisc(dataFaltas.CATdisc);
      setEstudiante(dataInfo.response);
      const transcurrido = Date.now() - inicio;
      const restante = 1000 - transcurrido;
      if (restante > 0) {
        await new Promise((resolve) => setTimeout(resolve, restante));
      }
    } catch (error) {
      // Si algo falla, se limpian los datos
      console.log("Error cargando foto:", error);
      setFoto(null);
      setEstudiante(null);
      setFaltasTotales(0);
      setFaltasTotalesAnio(0);
      setCategoriaDisc(null);
    } finally {
      setCargando(false);
    }
  }, []);

  // Se prepara el valor que se compartirá en el contexto
  const value = useMemo(
    () => ({
      cargando,
      foto,
      faltasTotales,
      faltasTotalesAnio,
      categoriaDisc,
      estudiante,
      hijoActivo,
      hijos,
      seleccionarEstudiante,
      cargarEstudiante,
    }),
    [
      cargando,
      foto,
      faltasTotales,
      faltasTotalesAnio,
      categoriaDisc,
      estudiante,
      hijoActivo,
      hijos,
      cargarEstudiante,
    ],
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
