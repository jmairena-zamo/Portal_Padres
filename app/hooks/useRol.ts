// Creado por Diego Castro
// hooks useRol para obtener el id del rol del usuario actual
"use client";
import { useSession } from "./useSession";

export function useRol() {
  const { sesion, cargando } = useSession();
  const rolId = sesion?.iD_Rol ?? null;
  const rolNombre = sesion?.rolNombre ?? null;
  const adminNames = ["administrador", "admin"];
  const esAdmin = Boolean(
    rolNombre && adminNames.includes(rolNombre.trim().toLowerCase()),
  );

  return { rol: rolId, rolNombre, cargandoRol: cargando, esAdmin };
}
