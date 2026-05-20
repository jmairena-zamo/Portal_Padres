import { NextResponse, NextRequest } from "next/server";

export async function GET(){
    try {
        const resmenus = await fetch('https://localhost:7233/portalpadres/v1/menu/Listar');
        const datamenus = await resmenus.json();

        const roles = await fetch('https://localhost:7233/portalpadres/v1/roles/Listar');
        const dataroles = await roles.json();

        const menus = await Promise.all(
            datamenus.response.map( async (menu: any) => {
                const resMenurol = await fetch(`https://localhost:7233/portalpadres/v1/menurol/ListarPorMenu/${menu.iD_Menu}`);
                const dataMenurol = await resMenurol.json();
                const resSubmenurol = await fetch(`https://localhost:7233/portalpadres/v1/submenu/ListarPorMenu/${menu.iD_Menu}`);
                const dataSubmenu = await resSubmenurol.json();

                return {
                    ...menu,
                    rolesAsignados: dataMenurol.response || [],
                    submenus: dataSubmenu.response || []
                };
            })
        )

        return NextResponse.json({
            menus: menus.sort((a: any, b: any) => a.posicion - b.posicion),
            roles: dataroles.response
        });
    } catch (error) {
        return NextResponse.json({error: 'Error de conexion'}, {status: 500})
    }
}