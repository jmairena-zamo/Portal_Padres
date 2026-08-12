// Creado por Diego Castro
// Obtener información general del estudiante (nombre, carrera, codiig, etc)
// Actualmente solo se realiza una simulación de la información general del estudiante,
// ya que no se tiene acceso a la API para obtener la información general real del estudiante.

import { API_URL_ZAMO } from "@/app/config/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const datasession = JSON.parse(session.value);
  console.log(datasession);

  const bannerID = datasession.bannerID;
  console.log(bannerID);
  try {
    const res = await fetch(
      `${API_URL_ZAMO}/padres/v1/Estudiante/ResumenEstudiante/${bannerID}`,
    );

    const data = await res.json();
    console.log("Respuesta ResumenEstudiante:", data);

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message ?? "Error desde API externa" },
        { status: res.status },
      );
    }

    // Retornar la respuesta oficial tal cual llega
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo resumen estudiante:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
