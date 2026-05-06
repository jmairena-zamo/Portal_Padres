import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

    const session = request.cookies.get('session');

    if (!session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/resumenEstudiante/:path*',
        '/estadoCuenta/:path*',
        '/historialAcademico/:path*',
        '/clases/:path*',
        '/historialDisciplinario/:path*',
        '/documentos/:path*',
        '/quejasSugerencias/:path*',
    ]
};