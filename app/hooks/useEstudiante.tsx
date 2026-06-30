"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { infoEstudiante } from "../respuestasAPI/infoEstudiante";
import {
  CursoHistorial,
  FilaHistorial,
  mapearCurso,
} from "../respuestasAPI/historialAcademico";
import {
  FilaCuenta,
  mapearMovimiento,
  MovimientoCuenta,
} from "../respuestasAPI/estadoCuenta";

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

  historialAcademico: FilaHistorial[];
  cargandoHistorialAca: boolean;
  errorHistorialAca: boolean;

  estadoCuenta: FilaCuenta[];
  cargandoEstadoCuenta: boolean;
  errorEstadoCuenta: boolean;
  balance: number;

  cargarEstudiante: () => Promise<void>;
  reintentarHistorialAca: () => void;
  reintentarEstadoCuenta: () => void;
  // cargarEstadoCuenta: () => Promise<void>;
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

  // Constantes Historial Academico
  const [historialAcademico, setHistorialAcademico] = useState<FilaHistorial[]>(
    [],
  );
  const [cargandoHistorialAca, setCargandoHistorialAca] =
    useState<boolean>(true);
  const [errorHistorialAca, setErrorHistorialAca] = useState<boolean>(false);
  const [intentoHistorialAca, setIntentoHistorialAca] = useState(0);

  // Constantes Estado de Cuenta
  const [estadoCuenta, setEstadoCuenta] = useState<FilaCuenta[]>([]);
  const [cargandoEstadoCuenta, setCargandoEstadoCuenta] =
    useState<boolean>(true);
  const [errorEstadoCuenta, setErrorEstadoCuenta] = useState<boolean>(false);
  const [intentoEstadoCuenta, setIntentoEstadoCuenta] = useState(0);
  const [balance, setBalance] = useState(0);

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
    cargarHistorialAca();
    cargarEstadoCuenta();
  }, [hijoActivo, intentoHistorialAca, intentoEstadoCuenta]);

  const reintentarHistorialAca = () =>
    setIntentoHistorialAca((prev) => prev + 1);

  const reintentarEstadoCuenta = () =>
    setIntentoEstadoCuenta((prev) => prev + 1);

  const cargarEstudiante = async () => {
    setCargando(true);
    try {
      const inicio = Date.now();
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
  };

  const cargarHistorialAca = async () => {
    setCargandoHistorialAca(true);
    setErrorHistorialAca(false);
    try {
      const inicio = Date.now();
      const res = await fetch(`/api/estudiantes/obtenerHistorialAcademico`);

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      const filas = (data.response as CursoHistorial[]).map(mapearCurso);
      setHistorialAcademico(filas);

      const transcurrido = Date.now() - inicio;
      const restante = 1000 - transcurrido;
      if (restante > 0) await new Promise((r) => setTimeout(r, restante));
    } catch (error) {
      console.error("Error cargando historial:", error);
      setErrorHistorialAca(true);
    } finally {
      setCargandoHistorialAca(false);
    }
  };

  const cargarEstadoCuenta = async () => {
    setCargandoEstadoCuenta(true);
    setErrorEstadoCuenta(false);
    try {
      const inicio = Date.now();
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
      const transcurrido = Date.now() - inicio;
      const restante = 1000 - transcurrido;
      if (restante > 0) {
        await new Promise((resolve) => setTimeout(resolve, restante));
      }
    } catch (error) {
      console.log("Error de conexión. Intenta de nuevo.");
      setErrorEstadoCuenta(true);
    } finally {
      setCargandoEstadoCuenta(false);
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

        historialAcademico,
        cargandoHistorialAca,
        errorHistorialAca,

        estadoCuenta,
        cargandoEstadoCuenta,
        errorEstadoCuenta,
        balance,

        cargarEstudiante,
        reintentarHistorialAca,
        reintentarEstadoCuenta,
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
