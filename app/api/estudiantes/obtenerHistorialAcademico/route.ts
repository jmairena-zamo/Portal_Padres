// Creado por Diego Castro
// Obtener la información del historial academico del estudiante

import { API_URL_ZAMO } from "@/app/config/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Validar que exista sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  // Obtener id banner para obtener las clases del estudiante
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
      `${API_URL_ZAMO}/padres/v1/Estudiante/HistorialAcademico/${bannerID}`,
    );

    const data = await res.json();
    console.log("Respuesta HistorialAcademico:", data);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data?.message ?? "Error desde API externa",
        },
        { status: res.ok ? 404 : res.status },
      );
    }

    // Retornar la respuesta oficial tal cual llega
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo historial academico:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
