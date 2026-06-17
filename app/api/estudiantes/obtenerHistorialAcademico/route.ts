import { HistorialAcademico } from "@/app/respuestasAPI/historialAcademico";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(HistorialAcademico);
  //Aqui tiene que ir la logica real para obtener la información de
  // historial academico desde la api
  //const res = await fetch("URL_API")
}
