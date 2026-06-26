import { inforEstudiante } from "@/app/respuestasAPI/infoEstudiante";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(inforEstudiante);
}
