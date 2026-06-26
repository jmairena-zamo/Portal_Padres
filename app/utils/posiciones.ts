// Creado por Diego Castro

import { Menu } from "@/app/interfaces/menus";

// Retorna true si la posicion del menu ya esta ocupada
export const posicionMenuOcupada = (
  menus: Menu[],
  posicion: number,
  excluirId?: number,
): boolean => {
  return menus.some((m) => m.posicion === posicion && m.iD_Menu !== excluirId);
};

// Retorna true si la posicion dentro del menu padres ya esta ocupada
export const posicionSubMenuOcupada = (
  menus: Menu[],
  posicion: number,
  menuPadreId: number,
  excluirId?: number,
): boolean => {
  const padre = menus.find((m) => m.iD_Menu === menuPadreId);
  return (
    padre?.submenus?.some(
      (s) => s.posicion === posicion && s.iD_SubMenu !== excluirId,
    ) ?? false
  );
};
