import { NextRequest, NextResponse } from "next/server";
import { getRutasPermitidas } from "./app/services/menu";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  const path = request.nextUrl.pathname;

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const rutasProtegidas = [
    "/resumenestudiante",
    "/estadodecuenta",
    "/historialacademico",
    "/clases",
    "/historialdisciplinario",
    "/documentos",
    "/quejasosugerencias",
    "/administracion",
  ];

  const esRutaProtegida = rutasProtegidas.some((ruta) =>
    request.nextUrl.pathname.startsWith(ruta),
  );

  if (esRutaProtegida && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const rutaactual = rutasProtegidas.find((ruta) => path.startsWith(ruta));
  if (!rutaactual) return NextResponse.next();

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const idrol = usuarioData.iD_Rol;

  const rutaspermitidas = await getRutasPermitidas(idrol);

  const permiso = rutaspermitidas.includes(path);

  if (!permiso)
    return NextResponse.redirect(new URL("/noautorizado", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/resumenestudiante/:path*",
    "/estadodecuenta/:path*",
    "/historialacademico/:path*",
    "/clases/:path*",
    "/historialdisciplinario/:path*",
    "/documentos/:path*",
    "/quejasosugerencias/:path*",
    "/administracion/:path*",
  ],
};
