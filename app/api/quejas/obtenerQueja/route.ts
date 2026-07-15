// Creado por Diego Castro
// Retorna las quejas y sugerencias del usuario en sesión

import { API_URL } from "@/app/config/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Obtener la sesión activa del usuario
  const session = request.cookies.get("session");
  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 401 });
  }

  const usuarioData = JSON.parse(session.value);
  const idUsuario = usuarioData.id;

  // Obtener las quejas y sugerencias del usuario desde la API
  try {
    const res = await fetch(
      `${API_URL}/quejassugerencias/ListarPorUsuario/${idUsuario}`,
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const data = await res.json();

    // Retornar las quejas y sugerencias del usuario
    return NextResponse.json(data);
  } catch (error) {
    console.log("Error exacto:", error);
    return NextResponse.json(
      { error: "Error al obtener quejas" },
      { status: 500 },
    );
  }
}
