import { NextRequest, NextResponse } from 'next/server';
import { getRutasPermitidas } from './app/utils/menu';

export async function middleware(request: NextRequest) {

    const session = request.cookies.get('session');

    const path = request.nextUrl.pathname;

    if (!session) {
        return NextResponse.redirect(
            new URL('/', request.url)
        );
    }

    const rutasProtegidas = [
        '/resumenestudiante',
        '/estadocuenta',
        '/historialacademico',
        '/clases',
        '/historialdisciplinario',
        '/documentos',
        '/quejasosugerencias',
        '/administracion',
    ];

    const esRutaProtegida = rutasProtegidas.some((ruta) =>
        request.nextUrl.pathname.startsWith(ruta)
    );

    if (esRutaProtegida && !session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const rutaactual = rutasProtegidas.find((ruta) => path.startsWith(ruta));
    if (!rutaactual) return NextResponse.next();

    const usuario = JSON.parse(session.value);
    const ID_rol = 2;

    const rutaspermitidas = await getRutasPermitidas(ID_rol);

    const permiso = rutaspermitidas.includes(path);

    if (!permiso) return NextResponse.redirect(new URL('/noautorizado', request.url));

    return NextResponse.next();

    /*if (!session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;*/
}

export const config = {
    matcher: [
        '/resumenestudiante/:path*',
        '/estadocuenta/:path*',
        '/historialacademico/:path*',
        '/clases/:path*',
        '/historialdisciplinario/:path*',
        '/documentos/:path*',
        '/quejasosugerencias/:path*',
        '/administracion/:path*',
    ]
};