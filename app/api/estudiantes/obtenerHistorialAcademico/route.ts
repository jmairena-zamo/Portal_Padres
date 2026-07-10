// Creado por Diego Castro
// Obtener la información del historial academico del estudiante

import { HistorialAcademico } from "@/app/interfaces/historialAcademico";
import { NextRequest, NextResponse } from "next/server";

//Aqui tiene que ir la logica real para obtener la información de
// historial academico desde la api
//const res = await fetch("URL_API")
export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const data = JSON.parse(session.value);
  console.log(data);

  const bannerID = data.bannerID;
  console.log(bannerID);

  return NextResponse.json(HistorialAcademico);
}
