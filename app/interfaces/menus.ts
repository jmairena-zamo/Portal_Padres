// Creado por Diego Castro
// Interfaces para menus y roles

export interface Rol {
  iD_Rol: number;
  rol: string;
}

export interface MenuRol {
  iD_Menu_Rol: number;
  menu_ID: number;
  rol_ID: number;
  habilitado: number;
}

export interface SubMenuRol {
  iD_Menu_Rol: number;
  subMenu_ID: number;
  rol_ID: number;
  habilitado: number;
}

export interface SubMenu {
  iD_SubMenu: number;
  opcion: string;
  posicion: number;
  menu_ID: number;
  habilitado: number;
  estado: number;
  icono: string;
  rolesAsignados: SubMenuRol[];
}

export interface Menu {
  iD_Menu: number;
  opcion: string;
  posicion: number;
  habilitado: number;
  estado: number;
  icono: string;
  rolesAsignados: MenuRol[];
  submenus: SubMenu[];
}
