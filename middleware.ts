// Creado por Diego Castro
// Procetccion de paginas

import { NextRequest, NextResponse } from "next/server";
import { getRutasPermitidas } from "./app/services/menu";

// Middleware: se ejecuta antes de entrar a ciertas páginas
export async function middleware(request: NextRequest) {
  // Obtener la sesison
  const session = request.cookies.get("session");

  const path = request.nextUrl.pathname;

  // Si no hay sesión, se redirige al inicio
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Lista de rutas que requieren estar autenticado
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

  // Verifica si la ruta actual está dentro de las protegidas
  const esRutaProtegida = rutasProtegidas.some((ruta) =>
    request.nextUrl.pathname.startsWith(ruta),
  );

  // Si la ruta es protegida y no hay sesión, se manda al inicio
  if (esRutaProtegida && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Se busca la ruta actual dentro de las protegidas
  const rutaactual = rutasProtegidas.find((ruta) => path.startsWith(ruta));
  if (!rutaactual) return NextResponse.next();

  // Si no hay sesión, se devuelve un error
  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  // Se obtiene la información del usuario desde la cookie
  const usuarioData = JSON.parse(session.value);
  const idrol = usuarioData.iD_Rol;

  // Se consultan las rutas permitidas según el rol del usuario
  const rutaspermitidas = await getRutasPermitidas(idrol);

  // Se revisa si la ruta actual está dentro de las permitidas
  const permiso = rutaspermitidas.includes(path);

  // Si no tiene permiso, se redirige a la página de "No autorizado"
  if (!permiso)
    return NextResponse.redirect(new URL("/noautorizado", request.url));

  return NextResponse.next();
}

// Configuración: define qué rutas serán vigiladas por este middleware
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
