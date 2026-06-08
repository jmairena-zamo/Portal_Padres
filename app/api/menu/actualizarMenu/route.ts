//Creado por Diego Castro

import { NextResponse, NextRequest } from "next/server";

//PUT /api/menu/actualizarMenu
//Actualiza los datos de un menu existente
export async function PUT(request: NextRequest){

    //Requiere sesion activa; Se obtiene la sesion activa 
    const session = request.cookies.get('session');

    if(!session){
        return NextResponse.json(
            { error: 'No hay sesion'},
            { status: 400 }
        )
    }

    const usuarioData = JSON.parse(session.value);
    const usuario = usuarioData.email;

    //Se obtiene la peticion y se desestructura el body 
    const body = await request.json();
    const {iD_Menu, opcion, posicion, habilitado, estado, icono} = body;

    //Se hace el llamado al endpoint de actualizar menu
    const res = await fetch(`https://localhost:7233/portalpadres/v1/menu/Actualizar/${iD_Menu}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({opcion, posicion, habilitado, icono, usuario: usuario})
        }
    )

    if(!res.ok) {
        return NextResponse.json({error: 'Error al Actualizar'}, { status:500 })
    }

    return NextResponse.json({ ok: true });
}