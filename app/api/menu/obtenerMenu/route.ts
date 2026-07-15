// Creado por Diego Castro
// Retorna los menús y submenús habilitados para el rol del usuario en sesión.
// Se utiliza para crear el sidebar dinamico

import { API_URL } from "@/app/config/api";
import { NextRequest, NextResponse } from "next/server";

//GET /api/menu/obtenerMenu
export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.json({ error: "No hay sesion" }, { status: 400 });
  }

  const usuarioData = JSON.parse(session.value);
  const idrol = usuarioData.iD_Rol;

  try {
    // Obtener los menús y submenús habilitados para el rol, en paralelo
    const [resMenuRol, resSubMenuRol] = await Promise.all([
      fetch(`${API_URL}/menurol/ListarPorRol/${idrol}`),
      fetch(`${API_URL}/submenurol/ListarPorRol/${idrol}`),
    ]);

    const dataMenuRol = await resMenuRol.json();
    const dataSubMenuRol = await resSubMenuRol.json();

    // Extraer solo los IDs que estén habilitados
    const menuIDs: number[] = [];

    // Extraer solo los IDs de menús habilitados
    for (const item of dataMenuRol.response || []) {
      if (item.habilitado === 1) {
        menuIDs.push(item.menu_ID);
      }
    }

    const submenuIDsSet = new Set<number>();

    // Extraer solo los IDs de submenús habilitados
    for (const item of dataSubMenuRol.response || []) {
      if (item.habilitado === 1) {
        submenuIDsSet.add(item.subMenu_ID);
      }
    }

    // Por cada menú habilitado, obtener su detalle y filtrar sus submenús
    const menus = await Promise.all(
      menuIDs.map(async (id) => {
        const [res, resSub] = await Promise.all([
          fetch(`${API_URL}/menu/Listar/${id}`),
          fetch(`${API_URL}/submenu/ListarPorMenu/${id}`),
        ]);
        if (!res.ok) return null;
        const data = await res.json();
        const menu = data.response;

        if (!resSub.ok) {
          return { ...menu, submenus: [] };
        }
        const dataSub = await resSub.json();

        // Filtrar los submenús que estén habilitados y que pertenezcan al rol
        const submenus = (dataSub.response || []).filter(
          (sub: any) =>
            submenuIDsSet.has(sub.iD_SubMenu) && sub.habilitado === 1,
        );

        return { ...menu, submenus };
      }),
    );

    // Descartar nulos (menús que fallaron) y menús deshabilitados; ordenar por posición
    const menusfiltrados = menus
      .filter((m) => m !== null && m.habilitado === 1)
      .sort((a, b) => a.posicion - b.posicion);

    return NextResponse.json({ menus: menusfiltrados });
  } catch (error) {
    console.log("Error exacto:", error);
    return NextResponse.json(
      { error: "Error al obtener menús" },
      { status: 500 },
    );
  }
}
