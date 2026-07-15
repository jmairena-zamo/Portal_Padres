// Creado por Diego Castro
// Componente para cerrar sesión del usuario

import { NextResponse } from "next/server";

//POST /api/auth/logout
//Eliminar la sesion
export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
