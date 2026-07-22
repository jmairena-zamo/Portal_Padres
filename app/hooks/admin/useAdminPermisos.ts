// Creado por Diego Castro
// Estados para la administración de permisos

import { useState } from "react";
import { Menu, SubMenu } from "@/app/interfaces/menus";
import { useMenu } from "@/app/hooks/useMenu";

type MostrarToast = (msg: string) => void;

export function useAdminPermisos(
  menus: Menu[],
  recargarDatos: () => Promise<void>,
  mostrarExito: MostrarToast,
) {
  const { cargarMenus } = useMenu();

  const [modalPermisos, setModalPermisos] = useState(false);
  const [itemPermisos, setItemPermisos] = useState<Menu | SubMenu | null>(null);
  const [rolesTemp, setRolesTemp] = useState<number[]>([]);
  const [guardandoPermisos, setGuardandoPermisos] = useState(false);

  const abrirPermisos = (item: Menu | SubMenu) => {
    setItemPermisos(item);
    const rolesHabilitados: number[] = [];

    for (const rol of item.rolesAsignados) {
      if (rol.habilitado === 1) {
        rolesHabilitados.push(rol.rol_ID);
      }
    }

    setRolesTemp(rolesHabilitados);
    setModalPermisos(true);
  };

  const toggleRolTemp = (idRol: number) => {
    setRolesTemp((prev) =>
      prev.includes(idRol)
        ? prev.filter((id) => id !== idRol)
        : [...prev, idRol],
    );
  };

  /**
   * Guarda los permisos del modal aplicando un diff entre el estado original y el temporal:
   * - POST: roles nuevos que no tenían registro previo.
   * - PUT habilitado=1: roles que existían pero estaban desactivados.
   * - PUT habilitado=0: roles que se desactivaron.
   *
   * Lógica de cascada:
   * - Submenú activado → habilita el rol en el menú padre si no estaba.
   * - Menú desactivado → deshabilita el rol en todos sus submenús hijos.
   */
  const guardarPermisos = async () => {
    if (!itemPermisos) return;
    setGuardandoPermisos(true);

    const esMenu = "iD_Menu" in itemPermisos;
    const rolesConRegistro = itemPermisos.rolesAsignados;
    const rolesTempSet = new Set(rolesTemp);

    const activar = rolesTemp.filter((idRol) => {
      const registro = rolesConRegistro.find((r) => r.rol_ID === idRol);
      return !registro || registro.habilitado === 0;
    });

    const desactivar = rolesConRegistro.filter(
      (r) => r.habilitado === 1 && !rolesTempSet.has(r.rol_ID),
    );

    const nuevos = activar.filter(
      (idRol) => !rolesConRegistro.find((r) => r.rol_ID === idRol),
    );

    const reactivar = activar.filter((idRol) =>
      rolesConRegistro.find((r) => r.rol_ID === idRol && r.habilitado === 0),
    );

    // Cascada hacia arriba: al activar un rol en un submenú, asegurar que el padre también lo tenga
    const activarPadre: Promise<Response>[] = [];

    if (!esMenu) {
      const sub = itemPermisos as SubMenu;
      const menuPadre = menus.find((m) => m.iD_Menu === sub.menu_ID);

      if (menuPadre) {
        const rolesPadreMap = new Map(
          menuPadre.rolesAsignados.map((r) => [r.rol_ID, r]),
        );

        for (const idRol of activar) {
          const rolenPadre = rolesPadreMap.get(idRol);

          if (!rolenPadre) {
            activarPadre.push(
              fetch("/api/menu/asignarMenuRol", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  menu_ID: menuPadre.iD_Menu,
                  rol_ID: idRol,
                }),
              }),
            );
          } else if (rolenPadre.habilitado === 0) {
            activarPadre.push(
              fetch("/api/menu/asignarMenuRol", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  iD_Menu_Rol: rolenPadre.iD_Menu_Rol,
                  habilitado: 1,
                  rol_ID: idRol,
                }),
              }),
            );
          }
        }
      }
    }

    // Cascada hacia abajo: al desactivar un rol en un menú, desactivarlo en sus submenús hijos
    const desactivarHijos: Promise<Response>[] = [];

    if (esMenu) {
      const menu = itemPermisos as Menu;
      const rolesDesactivarSet = new Set(desactivar.map((r) => r.rol_ID));

      for (const sub of menu.submenus ?? []) {
        const rolesMap = new Map(sub.rolesAsignados.map((r) => [r.rol_ID, r]));

        for (const rolID of rolesDesactivarSet) {
          const rolenHijo = rolesMap.get(rolID);

          if (rolenHijo && rolenHijo.habilitado === 1) {
            desactivarHijos.push(
              fetch("/api/menu/asignarSubMenuRol", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  iD_Menu_Rol: rolenHijo.iD_Menu_Rol,
                  habilitado: 0,
                  rol_ID: rolID,
                }),
              }),
            );
          }
        }
      }
    }

    const endpoint = `/api/menu/${esMenu ? "asignarMenuRol" : "asignarSubMenuRol"}`;

    const promesasAgregar = nuevos.map((idRol) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          esMenu
            ? { menu_ID: (itemPermisos as Menu).iD_Menu, rol_ID: idRol }
            : {
                subMenu_ID: (itemPermisos as SubMenu).iD_SubMenu,
                rol_ID: idRol,
              },
        ),
      }),
    );

    const promesasReactivar = reactivar.map((idRol) => {
      const registro = rolesConRegistro.find((r) => r.rol_ID === idRol)!;
      return fetch(
        `/api/menu/${esMenu ? "asignarMenuRol" : "asignarSubMenuRol"}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            iD_Menu_Rol: registro.iD_Menu_Rol,
            habilitado: 1,
            rol_ID: idRol,
          }),
        },
      );
    });

    const promesasDesactivar = desactivar.map((r) =>
      fetch(`/api/menu/${esMenu ? "asignarMenuRol" : "asignarSubMenuRol"}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iD_Menu_Rol: r.iD_Menu_Rol,
          habilitado: 0,
          rol_ID: r.rol_ID,
        }),
      }),
    );

    await Promise.all([
      ...promesasAgregar,
      ...promesasDesactivar,
      ...promesasReactivar,
      ...activarPadre,
      ...desactivarHijos,
    ]);

    mostrarExito(`Permisos de "${itemPermisos.opcion}" actualizados`);
    setModalPermisos(false);
    setItemPermisos(null);
    setGuardandoPermisos(false);
    await recargarDatos();
    await cargarMenus();
  };

  return {
    modalPermisos,
    setModalPermisos,
    itemPermisos,
    rolesTemp,
    guardandoPermisos,
    abrirPermisos,
    toggleRolTemp,
    guardarPermisos,
  };
}
