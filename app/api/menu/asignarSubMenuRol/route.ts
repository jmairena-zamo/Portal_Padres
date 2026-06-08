import { NextRequest, NextResponse } from "next/server";

//POST /api/menu/asignarSubMenuRol
//Asigna un rol a un submenu
//Crea el registro en la tabla Tbl_SubMenu_Rol
export async function POST(request: NextRequest){

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

    const body = await request.json();

    const res = await fetch('https://localhost:7233/portalpadres/v1/submenurol/Crear',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            subMenu_ID: body.subMenu_ID,
            rol_ID: body.rol_ID,
            usuario: usuario
        })
    });

    if(!res.ok){
        return NextResponse.json({error: "Error al asignar Rol"}, {status: 500})
    }

    return NextResponse.json({ok: true})
}

//PUT /api/menu/asignarSubMenuRol
//Activa o desactiva un rol en un submenu
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

    const body = await request.json();

    const res = await fetch(`https://localhost:7233/portalpadres/v1/submenurol/Actualizar`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                iD_Menu_Rol: body.iD_Menu_Rol,
                habilitado: body.habilitado,
                usuario: usuario
            })
        }
    );

    if(!res.ok){
        return NextResponse.json({error: 'Error al quitar Rol'}, {status: 500})
    }

    return NextResponse.json({ok: true});
}