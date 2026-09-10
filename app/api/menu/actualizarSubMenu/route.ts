// Creado por Diego Castro
// Actualiza los datos de un submenu existente

import { API_URL } from "@/app/config/api";
import { updateSubMenuSchema } from "@/app/utils/validations";
import { NextResponse, NextRequest } from "next/server";

//PUT /api/menu/actualizarSubMenu
//Actualizar ls datos de un submenu existente
export async function PUT(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  // Validar y extraer los datos de la sesión
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

  //Se obtiene la peticion
  const body = await request.json();

  // Revalidación de los datos del body usando zod
  const parsed = updateSubMenuSchema.safeParse(body);
  if (!parsed.success) {
    console.log("Error Zod:", parsed.error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { iD_SubMenu, opcion, posicion, menu_ID, habilitado, estado, icono } =
    parsed.data;

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
