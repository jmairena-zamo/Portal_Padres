import { NextResponse, NextRequest } from "next/server";
import { rolSchema } from "@/app/utils/validations";
import { API_URL } from "@/app/config/api";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const parsed = rolSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Error Zod:", parsed.error);
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { rol } = parsed.data;

  const res = await fetch(`${API_URL}/roles/Crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rol: rol,
      usuario: "STRING",
    }),
  });

  if (!res.ok)
    return NextResponse.json({ error: "Error al crear Rol" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
