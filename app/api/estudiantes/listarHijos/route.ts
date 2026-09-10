// Creado por Diego Castro
// Lista los hijos (estudiantes) asociados al usuario en sesión,
// combinando el listado de bannerIDs con el nombre de cada uno

import { API_URL, API_URL_ZAMO } from "@/app/config/api";
import { NextRequest, NextResponse } from "next/server";

interface Hijo {
  bannerID: number;
  Nombre: string;
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  let UserID: string;
  try {
    const usuarioData = JSON.parse(session.value);
    UserID = usuarioData.id;

    if (!UserID) {
      throw new Error("Datos de sesión incompletos");
    }
  } catch {
    return NextResponse.json(
      { error: "Sesión inválida o corrupta" },
      { status: 401 },
    );
  }

  try {
    // 1. Obtener la lista de bannerIDs asociados al usuario
    const resListado = await fetch(
      `${API_URL}/intdetalle/ListarPorUsuario/${UserID}`,
    );

    let dataListado;
    try {
      dataListado = await resListado.json();
    } catch {
      const textResponse = await resListado.text();
      console.error("Error parsing JSON. Raw response:", textResponse);
      return NextResponse.json(
        {
          error: "La API externa retornó una respuesta inválida",
          detalle: textResponse,
        },
        { status: 502 },
      );
    }

    if (
      !resListado.ok ||
      !dataListado?.response ||
      !Array.isArray(dataListado.response)
    ) {
      return NextResponse.json(
        { error: dataListado?.message ?? "No se pudo obtener el listado" },
        { status: resListado.ok ? 404 : resListado.status },
      );
    }

    const bannerIDs: number[] = dataListado.response.map(
      (item: { bannerID: number }) => item.bannerID,
    );

    // 2. Obtener el nombre de cada estudiante en paralelo
    const hijos = await Promise.all(
      bannerIDs.map(async (bannerID): Promise<Hijo | null> => {
        try {
          const resResumen = await fetch(
            `${API_URL_ZAMO}/padres/v1/Estudiante/ResumenEstudiante/${bannerID}`,
          );
          const dataResumen = await resResumen.json();

          if (!resResumen.ok || dataResumen?.status !== 200) {
            console.error(
              `No se pudo obtener el nombre del bannerID ${bannerID}`,
            );
            return null;
          }

          return {
            bannerID,
            Nombre: dataResumen.response.nombreCompleto,
          };
        } catch (error) {
          console.error(`Error obteniendo resumen de ${bannerID}:`, error);
          return null;
        }
      }),
    );

    // Se descartan los hijos que fallaron al obtener su nombre
    const hijosValidos = hijos.filter((h): h is Hijo => h !== null);

    return NextResponse.json(
      { status: 200, message: "Proceso exitoso", response: hijosValidos },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error obteniendo lista de hijos:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de estudiantes" },
      { status: 500 },
    );
  }
}
