// Creado por Diego Castro
// hooks useRol para obtener el id del rol del usuario actual
"use client";
import { useEffect, useState } from "react";
import { useSession } from "./useSession";

export function useRol() {
  const { sesion, cargando } = useSession();
  return { rol: sesion?.iD_Rol ?? null, cargando };
}
