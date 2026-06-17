import { EstadoCuenta } from "@/app/respuestasAPI/estadoCuenta";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(EstadoCuenta);
  //Aqui tiene que ir la logica real para obtener la información de
  // estado de cuenta desde la api
  //const res = await fetch("URL_API")
}
