import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

    const session = request.cookies.get('session');

    const path = request.nextUrl.pathname;

    if (path === '/' && session) {
        return NextResponse.redirect(
            new URL('/resumenEstudiante', request.url)
        );
    }

    const rutasProtegidas = [
        '/resumenEstudiante',
        '/estadoCuenta',
        '/historialAcademico',
        '/clases',
        '/historialDisciplinario',
        '/documentos',
        '/quejasSugerencias',
    ];

    const esRutaProtegida = rutasProtegidas.some((ruta) =>
        request.nextUrl.pathname.startsWith(ruta)
    );

    if (esRutaProtegida && !session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

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
        '/',
        '/resumenEstudiante/:path*',
        '/estadoCuenta/:path*',
        '/historialAcademico/:path*',
        '/clases/:path*',
        '/historialDisciplinario/:path*',
        '/documentos/:path*',
        '/quejasSugerencias/:path*',
    ]
};