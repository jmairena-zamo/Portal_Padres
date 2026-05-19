import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){

    const idrol = 2;

    const resRol = await fetch(`https://localhost:7233/portalpadres/v1/menurol/ListarPorRol/${idrol}`);

    if(!resRol.ok){
        return NextResponse.json(
            {error: 'Error a obtener menus'},
            {status: 500}
        )
    }

    const datarol = await resRol.json();
    const menuIDs: number[] = datarol.response.map((item: any) => item.menu_ID);

    const menus = await Promise.all(
        menuIDs.map(async (id) => {
            const res = await fetch(`https://localhost:7233/portalpadres/v1/menu/Listar/${id}`);
            if(!res.ok) return null;
            const data = await res.json();
            return data.response;
        } )
    )

    const menusfiltrados = menus.filter(m => m !== null && m.habilitado === 1)
                                .sort((a,b) => a.posicion - b.posicion);
                                
    return NextResponse.json({menus: menusfiltrados})
}