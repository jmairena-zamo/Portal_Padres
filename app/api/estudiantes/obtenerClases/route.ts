import { ClasesPeriodo } from "@/app/interfaces/clases";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const data = JSON.parse(session.value);
  const bannerID = data.bannerID;
  return NextResponse.json(ClasesPeriodo);
}
