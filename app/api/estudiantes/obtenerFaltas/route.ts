import { FaltasEstudiante } from "@/app/interfaces/faltas";
import { NextRequest, NextResponse } from "next/server";

//Aqui tiene que ir la logica real para obtener la información de
// estado de cuenta desde la api
//const res = await fetch("URL_API")
export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const data = JSON.parse(session.value);

  const bannerID = data.bannerID;

  const dataF = FaltasEstudiante;
  const categoriaDisciplinaria = dataF.response.categoriaDisciplinaria;
  const totalFaltas = dataF.response.totalFaltas;
  const totalFaltasAnio = dataF.response.totalFaltasEsteAnio;
  const AccEst = dataF.response.accionesEstudiantiles;
  return NextResponse.json({
    CATdisc: categoriaDisciplinaria,
    Tfaltas: totalFaltas,
    TfaltasAnio: totalFaltasAnio,
    AccionesEstudiantiles: AccEst,
  });
}
