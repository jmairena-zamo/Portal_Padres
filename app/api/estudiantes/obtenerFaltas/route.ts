import { FaltasEstudiante } from "@/app/respuestasAPI/faltas";
import { NextResponse } from "next/server";

export async function GET() {
  const data = FaltasEstudiante;
  const categoriaDisciplinaria = data.response.categoriaDisciplinaria;
  const totalFaltas = data.response.totalFaltas;
  const totalFaltasAnio = data.response.totalFaltasEsteAnio;
  const AccEst = data.response.accionesEstudiantiles;
  return NextResponse.json({
    CATdisc: categoriaDisciplinaria,
    Tfaltas: totalFaltas,
    TfaltasAnio: totalFaltasAnio,
    AccionesEstudiantiles: AccEst,
  });
  //Aqui tiene que ir la logica real para obtener la información de
  // estado de cuenta desde la api
  //const res = await fetch("URL_API")
}
