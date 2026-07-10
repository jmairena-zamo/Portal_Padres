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

interface Hijo {
  bannerID: number;
  Nombre: string;
}

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

  useEffect(() => {
    const hijosMock = [
      { bannerID: 1, Nombre: "Carlos Martínez" },
      { bannerID: 2, Nombre: "Sofía Martínez" },
      { bannerID: 3, Nombre: "Luis Martínez" },
    ];

    setHijos(hijosMock);

    if (hijosMock.length > 0) {
      setHijoActivo(hijosMock[0]);
    }
  }, []);

  useEffect(() => {
    if (!hijoActivo) return;
    cargarEstudiante();
  }, [hijoActivo]);

  const seleccionarEstudiante = async (hijo: Hijo) => {
    await fetch("/api/auth/seleccionarEstudiante", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bannerID: hijo.bannerID }),
    });
    setHijoActivo(hijo);
  };

  const cargarEstudiante = useCallback(async () => {
    setCargando(true);
    try {
      const inicio = Date.now();
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
      foto,
      faltasTotales,
      faltasTotalesAnio,
      categoriaDisc,
      estudiante,
      hijoActivo,
      hijos,
    ],
  );

  return (
    <EstudianteContext.Provider value={value}>
      {children}
    </EstudianteContext.Provider>
  );
};

export const useEstudiante = () => {
  const context = use(EstudianteContext);

  if (!context) {
    throw new Error("useFotoEstudiante debe usarse dentro de FotoProvider");
  }

  return context;
};
