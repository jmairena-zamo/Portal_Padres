// Creado por Diego Castro
// Componente para obtener la lista de estudiantes del padre
// Actualmente solo se realiza una simulación de la lista de estudiantes,
// ya que no se tiene acceso a la API para obtener la lista real de estudiantes.

import { listaEstudiantes } from "./../../../interfaces/infoEstudiante";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const res = listaEstudiantes;

  return NextResponse.json(res);
}
