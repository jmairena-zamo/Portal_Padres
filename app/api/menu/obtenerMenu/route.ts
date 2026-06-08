import { NextRequest, NextResponse } from "next/server";

//GET /api/menu/obtenerMenu
//Retorna los menús y submenús habilitados para el rol del usuario en sesión.
//Se utiliza para crear el sidebar dinamico
export async function GET(request: NextRequest) {

    const session = request.cookies.get('session');

    if(!session){
        return NextResponse.json(
            { error: 'No hay sesion'},
            { status: 400 }
        )
    }

    const usuarioData = JSON.parse(session.value);
    const idrol = usuarioData.iD_Rol;

    try {
        // Obtener los menús y submenús habilitados para el rol, en paralelo
        const [resMenuRol, resSubMenuRol] = await Promise.all([
            fetch(`https://localhost:7233/portalpadres/v1/menurol/ListarPorRol/${idrol}`),
            fetch(`https://localhost:7233/portalpadres/v1/submenurol/ListarPorRol/${idrol}`)
        ]);

        const dataMenuRol    = await resMenuRol.json();
        const dataSubMenuRol = await resSubMenuRol.json();

        // Extraer solo los IDs que estén habilitados
        const menuIDs: number[]    = dataMenuRol.response
            .filter((item: any) => item.habilitado === 1)
            .map((item: any) => item.menu_ID);

        const submenuIDs: number[] = (dataSubMenuRol.response || [])
            .filter((item: any) => item.habilitado === 1)
            .map((item: any) => item.subMenu_ID);

        // Por cada menú habilitado, obtener su detalle y filtrar sus submenús
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

                // Solo submenús que estén en la lista de habilitados para el rol
                const submenus = (dataSub.response || []).filter((sub: any) =>
                    submenuIDs.includes(sub.iD_SubMenu) && sub.habilitado === 1
                );

                return { ...menu, submenus };
            })
        )

        // Descartar nulos (menús que fallaron) y menús deshabilitados; ordenar por posición
        const menusfiltrados = menus.filter(m => m !== null && m.habilitado === 1)
            .sort((a, b) => a.posicion - b.posicion);

        return NextResponse.json({ menus: menusfiltrados })
    } catch (error) {
        console.log("Error exacto:", error);
        return NextResponse.json({ error: 'Error al obtener menús' }, { status: 500 });
    }
}