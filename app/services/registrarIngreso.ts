// Creado pr Diego Castro
// Registra los ingresos al sistema

import { API_URL } from "@/app/config/api";

export async function registrarIngreso(
  usuarioID: number,
  bannerID: number | null, //nulo cuando el admin se loguea (antes de escoger estudiante a suplantar)
  correo: string,
) {
  return fetch(`${API_URL}/registroingreso/Crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario_ID: usuarioID,
      bannerID,
      correoIngreso: correo,
    }),
  });
}
