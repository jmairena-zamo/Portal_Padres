//Creado por Dieg Castro

import { API_URL } from "@/app/config/api";
import { NextResponse, NextRequest } from "next/server";

//GET /api/menus/adminMenuRol
//Retorna todos los menús con sus roles asignados
// y submenús (cada uno con sus propios roles).
export async function GET() {
  try {
    // Obtener lista base de menús y roles en paralelo
    const [resMenus, resRoles] = await Promise.all([
      fetch(`${API_URL}/menu/Listar`),
      fetch(`${API_URL}/roles/Listar`),
    ]);

    const datamenus = await resMenus.json();
    const dataroles = await resRoles.json();

    // Por cada menú, obtener sus roles asignados y sus submenús en paralelo
    const menus = await Promise.all(
      datamenus.response.map(async (menu: any) => {
        const [resMenuRol, resSubmenu] = await Promise.all([
          fetch(`${API_URL}/menurol/ListarPorMenu/${menu.iD_Menu}`),
          fetch(`${API_URL}/submenu/ListarPorMenu/${menu.iD_Menu}`),
        ]);

        const dataMenuRol = await resMenuRol.json();
        const dataSubmenu = await resSubmenu.json();

        // Por cada submenú, obtener sus roles asignados
        const submenusData = await Promise.all(
          (dataSubmenu.response || []).map(async (submenu: any) => {
            const resSubmenuRol = await fetch(
              `${API_URL}/submenurol/ListarPorSubMenu/${submenu.iD_SubMenu}`,
            );

            const dataSubmenuRol = await resSubmenuRol.json();

            return {
              ...submenu,
              rolesAsignados: dataSubmenuRol.response || [],
            };
          }),
        );

        return {
          ...menu,
          rolesAsignados: dataMenuRol.response || [],
          submenus: submenusData,
        };
      }),
    );

    //Devulve la lista de menus ordenados y de roles
    return NextResponse.json({
      menus: menus.sort((a: any, b: any) => a.posicion - b.posicion),
      roles: dataroles.response,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error de conexion" }, { status: 500 });
  }
}
