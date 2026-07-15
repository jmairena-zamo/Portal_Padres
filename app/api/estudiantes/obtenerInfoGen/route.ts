// Creado por Diego Castro
// Obtener información general del estudiante (nombre, carrera, codiig, etc)
// Actualmente solo se realiza una simulación de la información general del estudiante,
// ya que no se tiene acceso a la API para obtener la información general real del estudiante.

import { inforEstudiante } from "@/app/interfaces/infoEstudiante";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const data = JSON.parse(session.value);
  console.log(data);

  const bannerID = data.bannerID;
  console.log(bannerID);

  return NextResponse.json(inforEstudiante);
}
