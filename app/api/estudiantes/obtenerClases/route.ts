// Creado por Diego Castro
// Componente para obtener las clases del estudiante
// Actualmente solo se realiza una simulación de las clases,
// ya que no se tiene acceso a la API para obtener las clases reales del estudiante.

import { ClasesPeriodo } from "@/app/interfaces/clases";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Validar que exista una sesión activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  // Obtener id banner para obtener las clases del estudiante
  const data = JSON.parse(session.value);
  const bannerID = data.bannerID;

  return NextResponse.json(ClasesPeriodo);
}
