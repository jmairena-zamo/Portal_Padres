// Creado por Diego Castro
// Componente para obtener el estado de cuenta del estudiante
// Actualmente solo se realiza una simulación del estado de cuenta,
// ya que no se tiene acceso a la API para obtener el estado de cuenta real del estudiante.

import { EstadoCuenta } from "@/app/interfaces/estadoCuenta";
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

  const dataEC = EstadoCuenta;
  return NextResponse.json(dataEC);
}
