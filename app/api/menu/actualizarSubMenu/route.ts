// Creado por Diego Castro
// Actualiza los datos de un submenu existente

import { API_URL } from "@/app/config/api";
import { NextResponse, NextRequest } from "next/server";

//PUT /api/menu/actualizarSubMenu
//Actualizar ls datos de un submenu existente
export async function PUT(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const usuario = usuarioData.email;

  //Se obtiene la peticion y se desestructura el body
  const body = await request.json();
  const { iD_SubMenu, opcion, posicion, menu_ID, habilitado, estado, icono } =
    body;

  //Se hace el llamado al endpoint de actualizar submenu
  const res = await fetch(`${API_URL}/submenu/Actualizar/${iD_SubMenu}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      opcion,
      posicion,
      menu_ID,
      habilitado,
      estado,
      icono,
      usuario: usuario,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Error al Actualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
