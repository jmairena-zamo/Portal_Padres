// Creado por Diego Castro
// Actualiza los datos de un menu existente

import { API_URL } from "@/app/config/api";
import { updateMenuSchema } from "@/app/utils/validations";
import { NextResponse, NextRequest } from "next/server";

//PUT /api/menu/actualizarMenu
//Actualiza los datos de un menu existente
export async function PUT(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 401 });
  }

  let usuario: string;
  try {
    const usuarioData = JSON.parse(session.value);
    usuario = usuarioData.email;

    if (!usuario) {
      throw new Error("Datos de sesión incompletos");
    }
  } catch {
    return NextResponse.json(
      { error: "Sesión inválida o corrupta" },
      { status: 401 },
    );
  }

  //Se obtiene la peticion y se desestructura el body
  const body = await request.json();

  const parsed = updateMenuSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Error Zod:", parsed.error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { iD_Menu, opcion, posicion, habilitado, icono } = parsed.data;

  //Se hace el llamado al endpoint de actualizar menu
  const res = await fetch(`${API_URL}/menu/Actualizar/${iD_Menu}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      opcion,
      posicion,
      habilitado,
      icono,
      usuario: usuario,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Error al Actualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
