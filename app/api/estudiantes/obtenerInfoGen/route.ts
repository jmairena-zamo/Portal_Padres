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

  let bannerID: string;
  try {
    const usuarioData = JSON.parse(session.value);
    bannerID = usuarioData.bannerID;

    if (!bannerID) {
      throw new Error("Datos de sesión incompletos");
    }
  } catch {
    return NextResponse.json(
      { error: "Sesión inválida o corrupta" },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(
      `${API_URL_ZAMO}/padres/v1/Estudiante/ResumenEstudiante/${bannerID}`,
    );

    let data;
    try {
      data = await res.json();
    } catch {
      const textResponse = await res.text();
      console.error("Error parsing JSON. Raw response:", textResponse);
      return NextResponse.json(
        {
          error: "La API externa retornó una respuesta inválida",
          detalle: textResponse,
        },
        { status: 502 },
      );
    }

    console.log("Respuesta ResumenEstudiante:", data);

    if (!res.ok || !data?.status || data?.status !== 200) {
      return NextResponse.json(
        {
          error: data?.message ?? "Error desde API externa",
          detalle: data?.response,
        },
        { status: res.ok ? 404 : res.status },
      );
    }

    // Retornar la respuesta oficial tal cual llega
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo resumen estudiante:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
