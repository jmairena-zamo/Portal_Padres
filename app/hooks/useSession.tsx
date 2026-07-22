// Creado por Diego Castro
// Contexto y hookk para session

"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// Información básica de la sesión del usuario
interface SesionUsuario {
  id: number;
  email: string;
  iD_Rol: number;
  rolNombre?: string | null;
}

// Lo que compartirá el contexto de sesión
interface SessionContextType {
  sesion: SesionUsuario | null;
  cargando: boolean;
  recargarSesion: () => void;
  cerrarSesion: () => void;
}

// Se crea el contexto de sesión
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<SesionUsuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Función para traer los datos de sesión desde la API
  const cargarSesion = useCallback(async () => {
    try {
      // Se consulta la sesión
      const res = await fetch("/api/auth/session");

      // Si no hay sesión, se limpia
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

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setSesion(null);
    setCargando(false);
  };

  // Al iniciar el componente, se carga la sesión automáticamente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarSesion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se prepara el valor que se compartirá en el contexto
  const value = useMemo(
    () => ({
      sesion,
      cargando,
      recargarSesion: cargarSesion,
      cerrarSesion,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sesion, cargando],
  );

  // Se devuelve el proveedor del contexto
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

// Hook para usar la sesión en cualquier componente
export function useSession() {
  const context = use(SessionContext);
  if (context === undefined) {
    throw new Error("useSession debe usarse dentro de un SessionProvider");
  }
  return context;
}
