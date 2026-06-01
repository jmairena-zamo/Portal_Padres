import { NextResponse, NextRequest } from "next/server";

export async function PUT(request: NextRequest){

    const session = request.cookies.get('session');

    if(!session){
        return NextResponse.json(
            { error: 'No hay sesion'},
            { status: 400 }
        )
    }

    const usuarioData = JSON.parse(session.value);
    const usuario = usuarioData.email;

    const body = await request.json();
    const {iD_SubMenu, opcion, posicion,menu_ID, habilitado, estado, icono} = body;

    const res = await fetch(`https://localhost:7233/portalpadres/v1/submenu/Actualizar/${iD_SubMenu}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({opcion, posicion,menu_ID, habilitado, estado, icono, usuario: usuario})
        }
    )

    if(!res.ok) {
        return NextResponse.json({error: 'Error al Actualizar'}, { status:500 })
    }

    return NextResponse.json({ ok: true });
}