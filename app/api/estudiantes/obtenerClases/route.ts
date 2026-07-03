import { ClasesPeriodo } from "@/app/respuestasAPI/clases";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(ClasesPeriodo);
}
