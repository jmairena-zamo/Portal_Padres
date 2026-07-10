"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SesionUsuario {
  id: number;
  email: string;
  iD_Rol: number;
}

interface SessionContextType {
  sesion: SesionUsuario | null;
  cargando: boolean;
  recargarSesion: () => void;
  cerrarSesion: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<SesionUsuario | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarSesion = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        setSesion(null);
        return;
      }
      const data = await res.json();
      setSesion(data);
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      setSesion(null);
    } finally {
      setCargando(false);
    }
  }, []);

  const cerrarSesion = () => {
    setSesion(null);
    setCargando(false);
  };

  useEffect(() => {
    cargarSesion();
  }, []);

  const value = useMemo(
    () => ({
      sesion,
      cargando,
      recargarSesion: cargarSesion,
      cerrarSesion,
    }),
    [sesion, cargando],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = use(SessionContext);
  if (context === undefined) {
    throw new Error("useSession debe usarse dentro de un SessionProvider");
  }
  return context;
}
