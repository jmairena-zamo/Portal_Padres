// Creado por Diego Castro
// Activa o desactiva un rol en un menu

import { API_URL } from "@/app/config/api";
import {
  actualizarMenuRolSchema,
  asignarMenuRolSchema,
} from "@/app/utils/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
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

  const body = await request.json();
  const parsed = asignarMenuRolSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Error Zod:", parsed.error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { menu_ID, rol_ID } = parsed.data;

  // Se hace el llamado al endpoint de asignar rol a menu
  const res = await fetch(`${API_URL}/menurol/Crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      menu_ID: menu_ID,
      rol_ID: rol_ID,
      usuario: usuario,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error al asignar Rol" },
      { status: 500 },
    );
  }

  // invalidarCacheRol(body.rol_ID);

  return NextResponse.json({ ok: true });
}

//PUT /api/menu/asignarMenuRol
//Activa o desactiva un rol en un menu
export async function PUT(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
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

  const body = await request.json();
  const parsed = actualizarMenuRolSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Error Zod:", parsed.error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { iD_Menu_Rol, habilitado } = parsed.data;

  const res = await fetch(`${API_URL}/menurol/Actualizar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      iD_Menu_Rol: iD_Menu_Rol,
      habilitado: habilitado,
      usuario: usuario,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Error al quitar Rol" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
