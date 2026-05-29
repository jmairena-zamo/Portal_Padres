import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const idrol = 2;

    try {
        const resRol = await fetch(`https://localhost:7233/portalpadres/v1/menurol/ListarPorRol/${idrol}`);

        const datarol = await resRol.json();
        const menuIDs: number[] = datarol.response.filter((item: any) => item.habilitado === 1).map((item: any) => item.menu_ID);

        const resSubRol = await fetch(`https://localhost:7233/portalpadres/v1/submenurol/ListarPorRol/${idrol}`);

        const datasubrol = await resSubRol.json();
        const submenuIDs: number[] = (datasubrol.response || []).filter((item: any) => item.habilitado === 1).map((item: any) => item.subMenu_ID);

        const menus = await Promise.all(
            menuIDs.map(async (id) => {
                const res = await fetch(`https://localhost:7233/portalpadres/v1/menu/Listar/${id}`);
                if (!res.ok) return null;
                const data = await res.json();
                const menu = data.response;

                const resSub = await fetch(`https://localhost:7233/portalpadres/v1/submenu/ListarPorMenu/${id}`);
                if (!resSub.ok){
                    return { ...menu, submenus: [] };
                };
                const dataSub = await resSub.json();

                const submenus = (dataSub.response || []).filter((sub: any) =>
                    submenuIDs.includes(sub.iD_SubMenu) && sub.habilitado === 1
                );

                return { ...menu, submenus };
            })
        )

        const menusfiltrados = menus.filter(m => m !== null && m.habilitado === 1)
            .sort((a, b) => a.posicion - b.posicion);

        return NextResponse.json({ menus: menusfiltrados })
    } catch (error) {
        console.log("❌ Error exacto:", error);
        return NextResponse.json({ error: 'Error al obtener menús' }, { status: 500 });
    }
}