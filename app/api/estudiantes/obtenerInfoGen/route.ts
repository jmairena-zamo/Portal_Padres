// Creado por Diego Castro
// Obtener información general del estudiante (nombre, carrera, codiig, etc)

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
