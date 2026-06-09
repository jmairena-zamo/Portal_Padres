//Creado por Diego Castro
//Recupera la sesion para mostrar información del lado del cliente
//la session al crearse con httpOnly no se puede obtener del lado del cliente

import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const session = request.cookies.get('session');

    if(!session){
        return NextResponse.json(
            { error: 'No hay sesion'},
            { status: 400 }
        )
    }

    if (!session) return NextResponse.json(null, { status: 401 });

    const data = JSON.parse(session.value);
    return NextResponse.json(data);
}