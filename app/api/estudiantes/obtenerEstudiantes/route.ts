import { listaEstudiantes } from "./../../../interfaces/infoEstudiante";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const res = listaEstudiantes;

  return NextResponse.json(res);
}
