// Creado por Diego Castro
// Activa o desactiva un rol en un submenu

import { API_URL } from "@/app/config/api";
import {
  actualizarMenuRolSchema,
  asignarsubMenuRolSchema,
} from "@/app/utils/validations";
import { NextRequest, NextResponse } from "next/server";

//POST /api/menu/asignarSubMenuRol
//Asigna un rol a un submenu
//Crea el registro en la tabla Tbl_SubMenu_Rol
export async function POST(request: NextRequest) {
  //Requiere sesion activa; Se obtiene la sesion activa
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

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

  const parsed = asignarsubMenuRolSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Error Zod:", parsed.error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { subMenu_ID, rol_ID } = parsed.data;

  const res = await fetch(`${API_URL}/submenurol/Crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subMenu_ID: subMenu_ID,
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

//PUT /api/menu/asignarSubMenuRol
//Activa o desactiva un rol en un submenu
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

  const res = await fetch(`${API_URL}/submenurol/Actualizar`, {
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
