"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { infoEstudiante } from "../respuestasAPI/infoEstudiante";

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
  setHijoActivo: React.Dispatch<React.SetStateAction<Hijo | null>>;

  cargarEstudiante: () => Promise<void>;
}

const EstudianteContext = createContext<EstudianteContextType | null>(null);

export const EstudianteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
    cargarEstudiante(hijoActivo?.bannerID);
  }, []);

  const cargarEstudiante = async (estudianteId?: number) => {
    setCargando(true);
    try {
      const [resFoto, resFaltas, resInfo] = await Promise.all([
        fetch("/api/estudiantes/obtenerFoto"),
        fetch("/api/estudiantes/obtenerFaltas"),
        fetch("/api/estudiantes/obtenerInfoGen"),
      ]);

      const dataFoto = await resFoto.json();
      const dataFaltas = await resFaltas.json();
      const dataInfo = await resInfo.json();

      setFoto(dataFoto.foto ?? null);
      setFaltasTotales(dataFaltas.Tfaltas);
      setFaltasTotalesAnio(dataFaltas.TfaltasAnio);
      setCategoriaDisc(dataFaltas.CATdisc);
      setEstudiante(dataInfo.response);
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
  };

  return (
    <EstudianteContext.Provider
      value={{
        cargando,
        foto,
        faltasTotales,
        faltasTotalesAnio,
        categoriaDisc,
        estudiante,

        hijos,
        hijoActivo,
        setHijoActivo,

        cargarEstudiante,
      }}
    >
      {children}
    </EstudianteContext.Provider>
  );
};

export const useEstudiante = () => {
  const context = useContext(EstudianteContext);

  if (!context) {
    throw new Error("useFotoEstudiante debe usarse dentro de FotoProvider");
  }

  return context;
};
