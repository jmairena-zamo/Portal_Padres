import { NextRequest, NextResponse } from "next/server";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET(request: NextRequest) {
    const correo = request.nextUrl.searchParams.get('correo');

    if(!correo){
        return NextResponse.json(
            { error: 'Correo no válido'},
            { status: 500}
        )
    }

    const res = await fetch(`https://localhost:7233/portalpadres/v1/useremail/ListarPorCorreo/${correo}`);

    if (!res.ok) {
        return NextResponse.json(
            {error: 'Usuario no encontrado'},
            { status: 404}
        )
    }

    const data = await res.json();

    return NextResponse.json({
        id: data.response.iD_UserEmail,
        correo: data.response.correoElectronico,
        relacion: data.response.relacion,
        tipoUsuario: data.response.tipoUsuario,
        usuario: data.response.usuarioCreador,
    });
}