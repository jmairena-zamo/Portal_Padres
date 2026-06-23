import { EstadoCuenta } from "@/app/respuestasAPI/estadoCuenta";
import { NextResponse } from "next/server";

export async function GET() {
  const data = EstadoCuenta;
  return NextResponse.json(data);
  //Aqui tiene que ir la logica real para obtener la información de
  // estado de cuenta desde la api
  //const res = await fetch("URL_API")
}
