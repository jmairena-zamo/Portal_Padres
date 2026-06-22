// Creado por Diego Castro
// hooks useRol para obtener el id del rol del usuario actual
"use client";
import { useEffect, useState } from "react";

export function useRol() {
  const [rol, setRol] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRol = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setRol(data?.iD_Rol ?? null);
      } catch (error) {
        console.error("Error al cargar rol:", error);
        setRol(null);
      } finally {
        setLoading(false);
      }
    };
    cargarRol();
  }, []);

  return { rol, loading };
}
