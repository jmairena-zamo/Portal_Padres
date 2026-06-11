//Creado por Diego Castro

//  * Página de administración de menús y roles.
//  *
//  * Permite:
//  * - Crear, editar y eliminar menús y submenús.
//  * - Habilitar/deshabilitar menús y submenús (con lógica de cascada).
//  * - Asignar roles a menús y submenús (con propagación al padre o hijos).
//  * - Crear, editar y eliminar roles.

"use client";

import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import React from "react";
import {
  menuData,
  menuSchema,
  subMenuData,
  subMenuSchema,
  rolData,
  rolSchema,
} from "@/app/utils/validations";
import { useToast } from "@/app/hooks/useToast";
import { useMenu } from "@/app/hooks/useMenu";
import { Menu, Rol, SubMenu } from "@/app/interfaces/menus";
import ModalForm from "../../components/modals/ModalForm";
import ModalPermisos from "@/app/components/modals/ModalPermisos";
import {
  BtnPrimario,
  BtnPeligro,
  BtnOutline,
  BtnTab,
  Buscador,
  ComboBoxFiltro,
  Tabla,
  Toast,
  Paginacion,
  Vacio,
  Loading,
  SelectorIconos,
  Input,
  SpanError,
  ToggleSwitch,
} from "@/app/components/ui/";

export default function Administracion() {
  //----PAGINACIÓN-----------------------------------------------------------
  const [paginaActualMenus, setPaginaActualMenus] = useState(1);
  const [paginaActualRoles, setPaginaActualRoles] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

  //----FILTROS--------------------------------------------------------------
  const [rolFiltro, setRolFiltro] = useState<number | "todos">("todos");
  const [menusFiltradosBuscador, setMenusFiltradosBuscador] = useState<Menu[]>(
    [],
  );
  const [rolesFiltradosBuscador, setRolesFiltradosBuscador] = useState<Rol[]>(
    [],
  );

  //----TOAST Y TAB----------------------------------------------------------
  const { toast, mostrarExito, mostrarError, cerrarToast } = useToast();
  const [tabActiva, setTabActiva] = useState<"menus" | "roles">("menus");

  //----DATOS PRINCIPALES----------------------------------------------------
  const [menus, setMenus] = useState<Menu[]>([]);
  const { cargarMenus } = useMenu();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Controla qué menú tiene sus submenús expandidos en la tabla
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  //----MODALES DE CONFIRMACIÓN----------------------------------------------
  const [confirmModalMenu, setConfirmModalMenu] = useState<{
    visible: boolean;
    menu: Menu | null;
  }>({
    visible: false,
    menu: null,
  });

  const [confirmModalSub, setConfirmModalSub] = useState<{
    visible: boolean;
    sub: SubMenu | null;
  }>({
    visible: false,
    sub: null,
  });

  const [confirmModalRol, setConfirmModalRol] = useState<{
    visible: boolean;
    rol: Rol | null;
  }>({
    visible: false,
    rol: null,
  });

  //----MODAL Y FORMULARIO DE ROL--------------------------------------------
  const [modalRol, setModalRol] = useState(false);
  const [modoRol, setModoRol] = useState<"crear" | "editar">("crear");
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
  const [formDataRol, setFormDataRol] = useState<rolData>({
    rol: "",
  });
  const [esValidoRol, setEsValidoRol] = useState(true);

  //----MODAL Y FOMULARIO DE MENU--------------------------------------------
  const [modalMenu, setModalMenu] = useState(false);
  const [modoMenu, setModoMenu] = useState<"crear" | "editar">("crear");
  const [formDataMenu, setFormDataMenu] = useState<menuData>({
    opcion: "",
    posicion: 1,
    icono: "",
  });
  const [esValidoOpcion, setEsValidoOpcion] = useState(true);
  const [esValidoPosicion, setEsValidoPosicion] = useState(true);
  const [menuSeleccionadoEditar, setMenuSeleccionadoEditar] =
    useState<Menu | null>(null);
  const [errorPosicionMenu, setErrorPosicionMenu] = useState("");
  const [esValidoIcono, setEsValidoIcono] = useState(true);

  //----MODAL Y FORMULARIO DE SUBMENU
  const [modalSubMenu, setModalSubMenu] = useState(false);
  const [modoSubMenu, setModoSubMenu] = useState<"crear" | "editar">("crear");
  const [formDataSubMenu, setFormDataSubMenu] = useState<subMenuData>({
    opcion: "",
    posicion: 1,
  });
  const [esValidoOpcionSub, setEsValidoOpcionSub] = useState(true);
  const [esValidoPosicionSub, setEsValidoPosicionSub] = useState(true);
  const [menuSeleccionado, setMenuSeleccionado] = useState<number | null>(null);
  const [subMenuSeleccionadoEditar, setSubMenuSeleccionadoEditar] =
    useState<SubMenu | null>(null);
  const [errorPosicionSub, setErrorPosicionSub] = useState("");

  //----MODAL DE PERMISOS (roles por menu y submenu)
  const [modalPermisos, setModalPermisos] = useState(false);
  const [itemPermisos, setItemPermisos] = useState<Menu | SubMenu | null>(null);
  const [rolesTemp, setRolesTemp] = useState<number[]>([]);
  const [guardandoPermisos, setGuardandoPermisos] = useState(false);

  // Posiciones editadas en los inputs inline de la tabla (clave: "menu-{id}" o "sub-{id}")
  const [posicionesEditando, setPosicionesEditando] = useState<
    Record<string, number>
  >({});

  //----Carga inicial de los datos
  useEffect(() => {
    cargarDatos();
  }, []);

  /** Carga menús y roles desde la API y sincroniza los estados del buscador. */
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/menu/adminMenuRol");
      const data = await res.json();
      setRoles(data.roles);
      setMenus(data.menus);

      setRolesFiltradosBuscador(data.roles);
      setMenusFiltradosBuscador(data.menus);
    } catch (error) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  //----HABILITAR Y DESHABILITAR---------------------------------------------
  /**
   * Alterna el estado habilitado de un menú.
   * Si se deshabilita, también deshabilita todos sus submenús en paralelo.
   */
  const Habilitar = async (menu: Menu) => {
    const nuevoHabilitado = menu.habilitado === 1 ? 0 : 1;

    const promesas: Promise<Response>[] = [
      fetch("/api/menu/actualizarMenu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...menu, habilitado: nuevoHabilitado }),
      }),
    ];

    // Cascada: deshabilitar/habilitar todos los submenús junto con el menú padre
    if (menu.submenus?.length > 0) {
      for (const sub of menu.submenus) {
        promesas.push(
          fetch("/api/menu/actualizarSubMenu", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...sub, habilitado: nuevoHabilitado }),
          }),
        );
      }
    }

    const res = await Promise.all(promesas);

    if (res.every((r) => r.ok)) {
      mostrarExito(
        `${menu.opcion} ${nuevoHabilitado === 1 ? "habilitado" : "deshabilitado"}`,
      );
    } else {
      mostrarError(`Error al actualizar ${menu.opcion}`);
    }
    cargarDatos();
    await cargarMenus();
  };

  /**
   * Alterna el estado habilitado de un submenú.
   * Si se habilita y su menú padre está deshabilitado, habilita el padre también.
   */
  const HabilitarSUB = async (submenu: SubMenu) => {
    const nuevoHabilitado = submenu.habilitado === 1 ? 0 : 1;

    const promesas: Promise<Response>[] = [
      fetch("/api/menu/actualizarSubMenu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...submenu, habilitado: nuevoHabilitado }),
      }),
    ];

    // Si se habilita el submenú y el padre está deshabilitado, habilitar el padre
    if (nuevoHabilitado === 1) {
      const menuPadre = menus.find((m) => m.iD_Menu === submenu.menu_ID);
      if (menuPadre && menuPadre.habilitado === 0) {
        promesas.push(
          fetch("/api/menu/actualizarMenu", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...menuPadre, habilitado: 1 }),
          }),
        );
      }
    }

    const resultados = await Promise.all(promesas);

    if (resultados.every((r) => r.ok)) {
      mostrarExito(
        `${submenu.opcion} ${nuevoHabilitado === 1 ? "habilitado" : "deshabilitado"}`,
      );
    } else {
      mostrarError(`Error al actualizar ${submenu.opcion}`);
    }
    cargarDatos();
    await cargarMenus();
  };

  //----Validación de posiciones duplicadas------------------------
  /** Retorna true si la posición ya está ocupada por otro menú (excluye el menú que se está editando). */
  const posicionMenuOcupada = (
    posicion: number,
    excluirId?: number,
  ): boolean => {
    return menus.some(
      (m) => m.posicion === posicion && m.iD_Menu !== excluirId,
    );
  };

  /** Retorna true si la posición ya está ocupada dentro del mismo menú padre. */
  const posicionSubMenuOcupada = (
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

  //----Cambio de posición-------------------------------------------------------
  /** Guarda la nueva posición de un menú si no está ocupada; de lo contrario muestra un error. */
  const cambiarPosicion = async (menu: Menu, nuevaPosicion: number) => {
    if (posicionMenuOcupada(nuevaPosicion, menu.iD_Menu)) {
      mostrarError(
        `La posición ${nuevaPosicion} ya está ocupada por otro menú`,
      );
      cargarDatos();
      return;
    }

    const res = await fetch("/api/menu/actualizarMenu", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...menu,
        posicion: nuevaPosicion,
      }),
    });
    if (res.ok) {
      mostrarExito(`Cambio de Posicion de ${menu.opcion}`);
    } else {
      mostrarError(`Error al actualizar posición ${menu.opcion}`);
    }
    cargarDatos();
    await cargarMenus();
  };

  /** Guarda la nueva posición de un submenú si no está ocupada dentro del mismo padre. */
  const cambiarPosicionSUB = async (
    submenu: SubMenu,
    nuevaPosicion: number,
  ) => {
    if (
      posicionSubMenuOcupada(nuevaPosicion, submenu.menu_ID, submenu.iD_SubMenu)
    ) {
      mostrarError(`La posición ${nuevaPosicion} ya está ocupada en este menú`);
      cargarDatos();
      return;
    }

    const res = await fetch("/api/menu/actualizarSubMenu", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...submenu,
        posicion: nuevaPosicion,
      }),
    });
    if (res.ok) {
      mostrarExito(`Cambio de Posicion de ${submenu.opcion}`);
    } else {
      mostrarError(`Error al actualizar posición ${submenu.opcion}`);
    }
    cargarDatos();
    await cargarMenus();
  };

  /** Abre o cierra la fila expandida de submenús para el menú dado. */
  const gestionSubmenu = (idMenu: number) => {
    setMenuAbierto((e) => (e === idMenu ? null : idMenu));
  };

  //----Gestion de roles------------------------------------------------
  const abrirPermisos = (item: Menu | SubMenu) => {
    setItemPermisos(item);
    setRolesTemp(
      item.rolesAsignados
        .filter((r) => r.habilitado === 1)
        .map((r) => r.rol_ID),
    );
    setModalPermisos(true);
  };

  /** Agrega o quita un rol del estado temporal (antes de guardar). */
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

    // Diff: qué roles se activaron, desactivaron, son completamente nuevos o se reactivan
    const activar = rolesTemp.filter((idRol) => {
      const registro = rolesConRegistro.find((r) => r.rol_ID === idRol);
      return !registro || registro.habilitado === 0;
    });

    const desactivar = rolesConRegistro.filter(
      (r) => r.habilitado === 1 && !rolesTemp.includes(r.rol_ID),
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
        for (const idRol of activar) {
          const rolenPadre = menuPadre.rolesAsignados.find(
            (r) => r.rol_ID === idRol,
          );

          if (!rolenPadre) {
            // El padre no tiene registro: crear
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
            // El padre tiene el registro desactivado: reactivar
            activarPadre.push(
              fetch("/api/menu/asignarMenuRol", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  iD_Menu_Rol: rolenPadre.iD_Menu_Rol,
                  habilitado: 1,
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

      for (const rolDesactivar of desactivar) {
        for (const sub of menu.submenus ?? []) {
          const rolenHijo = sub.rolesAsignados.find(
            (r) => r.rol_ID === rolDesactivar.rol_ID,
          );

          if (rolenHijo && rolenHijo.habilitado === 1) {
            desactivarHijos.push(
              fetch("/api/menu/asignarSubMenuRol", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  iD_Menu_Rol: rolenHijo.iD_Menu_Rol,
                  habilitado: 0,
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
          }),
        },
      );
    });

    const promesasDesactivar = desactivar.map((r) =>
      fetch(`/api/menu/${esMenu ? "asignarMenuRol" : "asignarSubMenuRol"}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iD_Menu_Rol: r.iD_Menu_Rol, habilitado: 0 }),
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
    cargarDatos();
    await cargarMenus();
  };

  //----Validación y handlers del formulario menu---------------------------------------
  const handlerOnChangeMenu = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormDataMenu((values) => ({
      ...values,
      [name]: name === "posicion" ? (value === "" ? "" : Number(value)) : value,
    }));

    if (name === "opcion" && !esValidoOpcion) setEsValidoOpcion(true);
    if (name === "posicion" && !esValidoPosicion) setEsValidoPosicion(true);
  };

  const handlerOnChangeIcon = (iconName: string) => {
    setFormDataMenu((prev) => ({ ...prev, icono: iconName }));
    setEsValidoIcono(true);
  };

  const validationOpcion = () => {
    const result = menuSchema.shape.opcion.safeParse(formDataMenu.opcion);
    setEsValidoOpcion(result.success);
  };

  const validationPosicion = () => {
    if (formDataMenu.posicion === "") {
      setEsValidoPosicion(false);
      return;
    }
    const result = menuSchema.shape.posicion.safeParse(
      Number(formDataMenu.posicion),
    );
    setEsValidoPosicion(result.success);
  };

  /** Limpia el formulario y cierra el modal de menú. */
  const cancelarModal = () => {
    setFormDataMenu({ opcion: "", posicion: 1, icono: "" });
    setEsValidoOpcion(true);
    setEsValidoPosicion(true);
    setEsValidoIcono(true);
    setErrorPosicionMenu("");
    setModalMenu(false);
  };

  //----Validación y handlers del formulario submenu
  const handlerOnChangeSubMenu = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "opcionSub") {
      setFormDataSubMenu((prev) => ({ ...prev, opcion: value }));
      if (!esValidoOpcionSub) setEsValidoOpcionSub(true);
    }

    if (name === "posicionSub") {
      setFormDataSubMenu((prev) => ({
        ...prev,
        posicion: value === "" ? "" : Number(value),
      }));
      if (!esValidoPosicionSub) setEsValidoPosicionSub(true);
    }
  };

  const validationOpcionSub = () => {
    const result = menuSchema.shape.opcion.safeParse(formDataSubMenu.opcion);
    setEsValidoOpcionSub(result.success);
  };

  const validationPosicionSub = () => {
    if (formDataSubMenu.posicion === "") {
      setEsValidoPosicionSub(false);
      return;
    }
    const result = menuSchema.shape.posicion.safeParse(
      Number(formDataSubMenu.posicion),
    );
    setEsValidoPosicionSub(result.success);
  };

  /** Limpia el formulario y cierra el modal de submenú. */
  const cancelarModalSub = () => {
    setFormDataSubMenu({ opcion: "", posicion: 1 });
    setEsValidoOpcionSub(true);
    setEsValidoPosicionSub(true);
    setErrorPosicionSub("");
    setModalSubMenu(false);
  };

  //----CRUD MENU----------------------------------------------------------
  const crearMenu = async () => {
    if (!formDataMenu.opcion.trim()) return;

    if (!formDataMenu.icono) {
      setEsValidoIcono(false);
      return;
    }

    if (posicionMenuOcupada(Number(formDataMenu.posicion))) {
      setErrorPosicionMenu(
        `La posición ${formDataMenu.posicion} ya está en uso`,
      );
      return;
    }
    setErrorPosicionMenu("");

    const res = await fetch("/api/menu/crearMenu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opcion: formDataMenu.opcion,
        posicion: formDataMenu.posicion,
        icono: formDataMenu.icono,
      }),
    });

    if (res.ok) {
      mostrarExito(`Menú ${formDataMenu.opcion} creado correctamente`);
    } else {
      mostrarError("Error al crear el menú");
    }

    setFormDataMenu({
      opcion: "",
      posicion: 1,
      icono: "",
    });
    setModalMenu(false);
    cargarDatos();
    await cargarMenus();
  };

  const editarMenu = async (menu: Menu | null) => {
    if (!formDataMenu.opcion.trim()) return;
    const res = await fetch("/api/menu/actualizarMenu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iD_Menu: menu?.iD_Menu,
        opcion: formDataMenu.opcion,
        posicion: menu?.posicion,
        habilitado: menu?.habilitado,
        icono: formDataMenu.icono,
      }),
    });

    if (res.ok) {
      mostrarExito(`Menú ${formDataMenu.opcion} actualizado correctamente`);
    } else {
      mostrarError("Error al crear el menú");
    }

    setFormDataMenu({
      opcion: "",
      posicion: 1,
      icono: "",
    });
    setModalMenu(false);
    cargarDatos();
    await cargarMenus();
  };

  const pedirConfirmacionEliminarMenu = (menu: Menu) => {
    setConfirmModalMenu({ visible: true, menu });
  };

  const confirmarEliminarMenu = async () => {
    if (!confirmModalMenu.menu) return;
    await eliminarMenu(confirmModalMenu.menu);
    setConfirmModalMenu({ visible: false, menu: null });
  };

  const eliminarMenu = async (menu: Menu) => {
    const res = await fetch("/api/menu/eliminarMenu", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iD_Menu: menu.iD_Menu }),
    });
    if (res.ok) {
      mostrarExito(`Menu "${menu.opcion}" eliminado`);
    } else {
      mostrarError("Error al eliminar el rol");
    }
    cargarDatos();
    await cargarMenus();
  };

  //----CRUD SUBMENU-------------------------------------------------------
  const crearSubMenu = async () => {
    if (!formDataSubMenu.opcion.trim()) {
      mostrarError("Ingrese un nombre para el submenu");
      return;
    }

    if (!menuSeleccionado) {
      mostrarError("Seleccione un menú padre");
      return;
    }

    if (
      posicionSubMenuOcupada(Number(formDataSubMenu.posicion), menuSeleccionado)
    ) {
      setErrorPosicionSub(
        `La posición ${formDataSubMenu.posicion} ya está en uso en este menú`,
      );
      return;
    }
    setErrorPosicionSub("");

    const res = await fetch("/api/menu/crearSubmenu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opcion: formDataSubMenu.opcion,
        posicion: formDataSubMenu.posicion,
        menu_ID: menuSeleccionado,
      }),
    });
    if (res.ok) {
      mostrarExito(`Submenú ${formDataSubMenu.opcion} creado correctamente`);
    } else {
      mostrarError("Error al crear el Submenú");
    }

    setFormDataSubMenu({
      opcion: "",
      posicion: 1,
    });
    setModalSubMenu(false);
    cargarDatos();
    await cargarMenus();
  };

  const editarSubMenu = async (sub: SubMenu | null) => {
    if (!formDataSubMenu.opcion.trim()) return;
    const res = await fetch("/api/menu/actualizarSubMenu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...sub,
        opcion: formDataSubMenu.opcion,
      }),
    });

    if (res.ok) {
      mostrarExito(`Menú ${formDataMenu.opcion} actualizado correctamente`);
    } else {
      mostrarError("Error al crear el menú");
    }

    setFormDataSubMenu({
      opcion: "",
      posicion: 1,
    });
    setModalSubMenu(false);
    cargarDatos();
    await cargarMenus();
  };

  const pedirConfirmacionEliminarSub = (sub: SubMenu) => {
    setConfirmModalSub({ visible: true, sub });
  };

  const confirmarEliminarSub = async () => {
    if (!confirmModalSub.sub) return;
    await eliminarSubMenu(confirmModalSub.sub);
    setConfirmModalSub({ visible: false, sub: null });
  };

  const eliminarSubMenu = async (sub: SubMenu) => {
    const res = await fetch("/api/menu/eliminarSubMenu", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iD_SubMenu: sub.iD_SubMenu }),
    });
    if (res.ok) {
      mostrarExito(`SubMenu "${sub.opcion}" eliminado`);
    } else {
      mostrarError("Error al eliminar el rol");
    }
    cargarDatos();
    await cargarMenus();
  };

  //----Validación y handlers formulario rol
  const handlerOnChangeRol = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormDataRol((values) => ({
      ...values,
      [name]: value,
    }));

    if (name === "rol" && !esValidoRol) {
      setEsValidoRol(true);
    }
  };

  const validationRol = () => {
    const result = rolSchema.shape.rol.safeParse(formDataRol.rol);
    setEsValidoRol(result.success);
  };

  /** Limpia el formulario y cierra el modal de rol. */
  const cancelarModalRol = () => {
    setFormDataRol({ rol: "" });
    setEsValidoRol(true);
    setModalRol(false);
  };

  //----CRUD Rol--------------------------------------------
  const crearRol = async () => {
    if (!formDataRol.rol.trim()) return;

    const res = await fetch("/api/roles/crearRoles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rol: formDataRol.rol,
      }),
    });

    if (res.ok) {
      mostrarExito(`Rol ${formDataMenu.opcion} creado correctamente`);
    } else {
      mostrarError("Error al crear el Rol");
    }

    setFormDataRol({
      rol: "",
    });
    setModalRol(false);
    cargarDatos();
  };

  const pedirConfirmacionEliminar = (rol: Rol) => {
    setConfirmModalRol({ visible: true, rol });
  };

  const confirmarEliminar = async () => {
    if (!confirmModalRol.rol) return;
    await eliminarRol(confirmModalRol.rol);
    setConfirmModalRol({ visible: false, rol: null });
  };

  const eliminarRol = async (rol: Rol) => {
    const res = await fetch("/api/roles/eliminarRoles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iD_Rol: rol.iD_Rol }),
    });
    if (res.ok) {
      mostrarExito(`Rol "${rol.rol}" eliminado`);
    } else {
      mostrarError("Error al eliminar el rol");
    }
    cargarDatos();
    await cargarMenus();
  };

  /** Precarga el formulario con los datos del rol y abre el modal en modo editar. */
  const abrirEditarRol = (rol: Rol) => {
    setRolSeleccionado(rol);
    setFormDataRol({ rol: rol.rol });
    setModalRol(true);
    setModoRol("editar");
  };

  const editarRol = async () => {
    if (!rolSeleccionado || !formDataRol.rol.trim()) return;

    const res = await fetch("/api/roles/actualizarRoles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iD_Rol: rolSeleccionado.iD_Rol,
        rol: formDataRol.rol,
      }),
    });

    if (res.ok) {
      mostrarExito(`Rol actualizado correctamente`);
    } else {
      mostrarError("Error al actualizar el rol");
    }

    setFormDataRol({ rol: "" });
    setRolSeleccionado(null);
    setModalRol(false);
    cargarDatos();
  };

  //----Filtros y paginación-------------------------------------
  const menuFiltrados = menusFiltradosBuscador.filter((menu) =>
    rolFiltro === "todos"
      ? true
      : menu.rolesAsignados.some(
          (r) => r.rol_ID === rolFiltro && r.habilitado === 1,
        ) ||
        menu.submenus?.some((sub) =>
          sub.rolesAsignados.some(
            (r) => r.rol_ID === rolFiltro && r.habilitado === 1,
          ),
        ),
  );

  const handleCambiarRegistros = (cantidad: number) => {
    setRegistrosPorPagina(cantidad);
    setPaginaActualMenus(1);
    setPaginaActualRoles(1);
  };

  const indexInicioMenus = (paginaActualMenus - 1) * registrosPorPagina;
  const indexFinMenus = indexInicioMenus + registrosPorPagina;
  const datosPaginadosMenus = menuFiltrados.slice(
    indexInicioMenus,
    indexFinMenus,
  );

  const tieneMenus = datosPaginadosMenus && datosPaginadosMenus.length > 0;

  const indexInicioRoles = (paginaActualRoles - 1) * registrosPorPagina;
  const indexFinRoles = indexInicioRoles + registrosPorPagina;
  const datosPaginadosRoles = roles.slice(indexInicioRoles, indexFinRoles);

  const tieneRoles = datosPaginadosRoles && datosPaginadosRoles.length > 0;

  if (cargando) return <Loading />;

  //----RENDER----------------------------------------------------------
  return (
    <div className="mt-4 mx-4 mb-4 flex flex-col gap-4 sm:m-4 max-[420px]:m-2">
      {toast && (
        <Toast
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={cerrarToast}
        />
      )}

      <div className="flex gap-2.5 border-b border-gray-200 max-[420px]:flex-wrap">
        <BtnTab
          activa={tabActiva === "menus"}
          onClick={() => setTabActiva("menus")}
        >
          Administrar Menu
        </BtnTab>
        <BtnTab
          activa={tabActiva === "roles"}
          onClick={() => setTabActiva("roles")}
        >
          Administrar Roles
        </BtnTab>
      </div>

      {/* ── Tab: Menús ── */}
      {tabActiva === "menus" && (
        <div className="bg-white rounded-[5px] shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] p-4 max-[800px]:overflow-hidden">
          <div className="flex justify-between px-4 max-[800px]:flex-col max-[800px]:gap-2.5 max-[800px]:items-start max-[800px]:px-1.25">
            <div className="flex items-center gap-11.25 flex-wrap max-[800px]:w-full max-[800px]:justify-between max-[420px]:gap-3.75">
              <h2 className="font-bold text-center text-[22px] max-[420px]:text-[17px]">
                Administración de Menú
              </h2>
            </div>

            <div className="flex gap-2.5">
              <BtnPrimario
                onClick={() => {
                  setModalMenu(true);
                  setModoMenu("crear");
                }}
              >
                + Menu
              </BtnPrimario>
              <BtnPrimario
                onClick={() => {
                  setModalSubMenu(true);
                  setModoSubMenu("crear");
                }}
              >
                + SubMenu
              </BtnPrimario>
            </div>
          </div>
          <div className="mt-5 w-full flex gap-3.75 max-[420px]:flex-col">
            <div className="w-4/5 flex justify-center items-center max-[420px]:w-full">
              <Buscador
                datos={menus}
                campos={["opcion"]}
                placeholder="Buscar Menu..."
                onResultado={(resultados) => {
                  setMenusFiltradosBuscador(resultados);
                  setPaginaActualMenus(1);
                }}
              />
            </div>
            <div className="flex items-center gap-3.75 max-[420px]:gap-1.25">
              <h4>Rol:</h4>
              <ComboBoxFiltro
                valor={rolFiltro}
                placeholder="Todos los Roles"
                opciones={roles.map((rol) => ({
                  value: rol.iD_Rol,
                  label: rol.rol,
                }))}
                onChange={(value) => {
                  setRolFiltro(value);
                  setPaginaActualMenus(1);
                }}
              />
            </div>
          </div>

          <div className="w-full max-[800px]:overflow-x-auto">
            {!tieneMenus ? (
              <Vacio
                titulo="No hay Menus"
                descripcion="No se encontraron menus con ese nombre"
              />
            ) : (
              <Tabla
                datos={datosPaginadosMenus}
                keyExtractor={(menu) => menu.iD_Menu}
                estaExpandida={(menu) => menuAbierto === menu.iD_Menu}
                filaExpandida={(menu) =>
                  menu.submenus.map((sub) => (
                    <tr
                      key={sub.iD_SubMenu}
                      className="
                                                                bg-[rgb(216,216,216)]
                                                                [&>td]:text-center
                                                                [&>td]:p-2.5
                                                                [&>td]:border-b
                                                                [&>td]:border-b-black
                                                                max-[420px]:[&>td]:px-1
                                                                max-[420px]:[&>td]:py-1.5
                                                                max-[420px]:[&>td]:text-[12px]
                                                            "
                    >
                      <td>{sub.opcion}</td>
                      <td>
                        {/* Input inline para editar posición; valida al perder foco */}
                        <input
                          type="number"
                          className="w-15 p-1 text-center"
                          value={
                            posicionesEditando[`sub-${sub.iD_SubMenu}`] ??
                            sub.posicion
                          }
                          onChange={(e) => {
                            setPosicionesEditando((prev) => ({
                              ...prev,
                              [`sub-${sub.iD_SubMenu}`]: Number(e.target.value),
                            }));
                          }}
                          onBlur={async (e) => {
                            const nueva = Number(e.target.value);
                            if (nueva !== sub.posicion) {
                              if (
                                posicionSubMenuOcupada(
                                  nueva,
                                  sub.menu_ID,
                                  sub.iD_SubMenu,
                                )
                              ) {
                                mostrarError(
                                  `La posición ${nueva} ya está ocupada en este menú`,
                                );
                                setPosicionesEditando((prev) => ({
                                  ...prev,
                                  [`sub-${sub.iD_SubMenu}`]: sub.posicion,
                                }));
                                return;
                              }
                              await cambiarPosicionSUB(sub, nueva);
                            }
                            setPosicionesEditando((prev) => {
                              const nuevo = { ...prev };
                              delete nuevo[`sub-${sub.iD_SubMenu}`];
                              return nuevo;
                            });
                          }}
                        />
                      </td>
                      {/* estilo para el boton de gestionar roles */}
                      <td
                        className="border border-white flex flex-row justify-center align-center p-2.5 border-b border-b-black 
                                                    max-[420px]:px-1 max-[420px]:py-1.5 max-[420px]:text-[12px]"
                      >
                        <BtnOutline onClick={() => abrirPermisos(sub)}>
                          {
                            menu.rolesAsignados.filter(
                              (r) => r.habilitado === 1,
                            ).length
                          }{" "}
                          de {roles.length}
                        </BtnOutline>
                      </td>
                      <td>
                        <ToggleSwitch
                          checked={sub.habilitado === 1}
                          onChange={() => HabilitarSUB(sub)}
                        />
                      </td>
                      <td>
                        <div className="flex gap-3.75 justify-center items-center">
                          <BtnPrimario
                            type="button"
                            onClick={() => {
                              setSubMenuSeleccionadoEditar(sub);
                              setFormDataSubMenu({
                                opcion: sub.opcion,
                                posicion: sub.posicion,
                              });
                              setModalSubMenu(true);
                              setModoSubMenu("editar");
                            }}
                          >
                            <FaEdit />
                          </BtnPrimario>
                          <BtnPeligro
                            type="button"
                            onClick={() => pedirConfirmacionEliminarSub(sub)}
                          >
                            <FaTrash />
                          </BtnPeligro>
                        </div>
                      </td>
                    </tr>
                  ))
                }
                columnas={[
                  {
                    header: "Menú",
                    render: (menu) => (
                      // Chevron indica si el menú tiene submenús y si están expandidos
                      <button
                        className="bg-transparent border-none cursor-pointer font-bold flex items-center gap-1.5"
                        onClick={() => gestionSubmenu(menu.iD_Menu)}
                      >
                        {menu.opcion}
                        {menu.submenus?.length > 0 &&
                          (menuAbierto === menu.iD_Menu ? (
                            <FaChevronDown size={12} />
                          ) : (
                            <FaChevronRight size={12} />
                          ))}
                      </button>
                    ),
                  },
                  {
                    header: "Posición",
                    render: (menu) => (
                      <input
                        type="number"
                        className="w-15 p-1 text-center"
                        value={
                          posicionesEditando[`menu-${menu.iD_Menu}`] ??
                          menu.posicion
                        }
                        onChange={(e) => {
                          setPosicionesEditando((prev) => ({
                            ...prev,
                            [`menu-${menu.iD_Menu}`]: Number(e.target.value),
                          }));
                        }}
                        onBlur={async (e) => {
                          const nueva = Number(e.target.value);
                          if (nueva !== menu.posicion) {
                            if (posicionMenuOcupada(nueva, menu.iD_Menu)) {
                              mostrarError(
                                `La posición ${nueva} ya está ocupada por otro menú`,
                              );
                              setPosicionesEditando((prev) => ({
                                ...prev,
                                [`menu-${menu.iD_Menu}`]: menu.posicion,
                              }));
                              return;
                            }
                            await cambiarPosicion(menu, nueva);
                          }
                          setPosicionesEditando((prev) => {
                            const nuevo = { ...prev };
                            delete nuevo[`menu-${menu.iD_Menu}`];
                            return nuevo;
                          });
                        }}
                      />
                    ),
                  },
                  {
                    header: "Roles",
                    render: (menu) => (
                      <div className="flex gap-3.75 justify-center items-center">
                        <BtnOutline onClick={() => abrirPermisos(menu)}>
                          {
                            menu.rolesAsignados.filter(
                              (r) => r.habilitado === 1,
                            ).length
                          }{" "}
                          de {roles.length}
                        </BtnOutline>
                      </div>
                    ),
                  },
                  {
                    header: "Estado",
                    render: (menu) => (
                      <ToggleSwitch
                        checked={menu.habilitado === 1}
                        onChange={() => Habilitar(menu)}
                      />
                    ),
                  },
                  {
                    header: "Acciones",
                    render: (menu) => (
                      <div className="flex gap-3.75 justify-center items-center">
                        <BtnPrimario
                          type="button"
                          onClick={() => {
                            setMenuSeleccionadoEditar(menu);
                            setFormDataMenu({
                              opcion: menu.opcion,
                              icono: menu.icono,
                              posicion: menu.posicion,
                            });
                            setModalMenu(true);
                            setModoMenu("editar");
                          }}
                        >
                          <FaEdit />
                        </BtnPrimario>
                        <BtnPeligro
                          type="button"
                          onClick={() => pedirConfirmacionEliminarMenu(menu)}
                        >
                          <FaTrash />
                        </BtnPeligro>
                      </div>
                    ),
                  },
                ]}
              />
            )}

            <Paginacion
              totalRegistros={menus.length}
              registrosPorPagina={registrosPorPagina}
              paginaActual={paginaActualMenus}
              onCambiarPagina={setPaginaActualMenus}
              onCambiarRegistrosPorPagina={handleCambiarRegistros}
            />
          </div>
          {/* Modal crear/editar menú: campo posición solo aparece al crear */}
          {modalMenu && (
            <ModalForm
              titulo={modoMenu === "crear" ? "Nuevo Menú" : "Editar Menú"}
              txtConfirmar={modoMenu === "crear" ? "Crear" : "Editar"}
              deshabilitado={
                !esValidoOpcion ||
                !esValidoPosicion ||
                formDataMenu.posicion === "" ||
                !esValidoIcono
              }
              onConfirmar={() =>
                modoMenu === "crear"
                  ? crearMenu()
                  : editarMenu(menuSeleccionadoEditar)
              }
              onCancelar={cancelarModal}
            >
              {/* Campo: Nombre */}
              <div className="flex flex-col gap-1">
                <label>Nombre:</label>
                <Input
                  type="text"
                  name="opcion"
                  esValido={esValidoOpcion}
                  value={formDataMenu.opcion}
                  onChange={handlerOnChangeMenu}
                  onBlur={validationOpcion}
                  placeholder="Ingrese el nombre de la opción"
                />
                <SpanError
                  visible={!esValidoOpcion}
                  mensaje="La Opción no es válida"
                />
              </div>

              {/* Campo: Posición (solo en modo crear) */}
              {modoMenu === "crear" && (
                <div className="flex flex-col gap-1">
                  <label>Posición:</label>
                  <Input
                    type="number"
                    name="posicion"
                    esValido={esValidoPosicion && !errorPosicionMenu}
                    value={formDataMenu.posicion}
                    onChange={(e) => {
                      handlerOnChangeMenu(e);
                      setErrorPosicionMenu("");
                    }}
                    onBlur={validationPosicion}
                    placeholder="Ingrese la posición de la opción"
                  />
                  <SpanError
                    visible={!esValidoPosicion || !!errorPosicionMenu}
                    mensaje={errorPosicionMenu || "La Posición no es válida"}
                  />
                </div>
              )}

              {/* Campo: Ícono */}
              <div className="flex flex-col gap-1">
                <label>Ícono:</label>
                <SelectorIconos
                  selectedIcon={formDataMenu.icono}
                  onSelect={handlerOnChangeIcon}
                />
                <SpanError
                  visible={!esValidoIcono}
                  mensaje="Debe seleccionar un ícono"
                />
              </div>
            </ModalForm>
          )}
          {/* Modal crear/editar submenú: selector de menú padre solo al crear */}
          {modalSubMenu && (
            <ModalForm
              titulo={
                modoSubMenu === "crear" ? "Nuevo SubMenú" : "Editar SubMenú"
              }
              txtConfirmar={modoSubMenu === "crear" ? "Crear" : "Editar"}
              deshabilitado={
                !esValidoOpcionSub ||
                !esValidoPosicionSub ||
                formDataSubMenu.posicion === ""
              }
              onConfirmar={() =>
                modoSubMenu === "crear"
                  ? crearSubMenu()
                  : editarSubMenu(subMenuSeleccionadoEditar)
              }
              onCancelar={cancelarModalSub}
            >
              {modoSubMenu === "crear" && (
                <div className="flex flex-col gap-1">
                  <label>Menú Padre:</label>
                  <select
                    value={menuSeleccionado || ""}
                    onChange={(e) =>
                      setMenuSeleccionado(Number(e.target.value))
                    }
                  >
                    <option value="">Selecciona un menú</option>
                    {menus.map((m) => (
                      <option key={m.iD_Menu} value={m.iD_Menu}>
                        {m.opcion}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label>Nombre:</label>
                <Input
                  type="text"
                  name="opcionSub"
                  esValido={esValidoOpcionSub}
                  value={formDataSubMenu.opcion}
                  onChange={handlerOnChangeSubMenu}
                  onBlur={validationOpcionSub}
                  placeholder="Ingrese el nombre del submenu"
                />
                <SpanError
                  visible={!esValidoOpcionSub}
                  mensaje="La Opción no es válida"
                />
              </div>
              {modoSubMenu === "crear" && (
                <div className="flex flex-col gap-1">
                  <label>Posición:</label>
                  <Input
                    type="number"
                    name="posicionSub"
                    esValido={esValidoPosicionSub || !errorPosicionSub}
                    value={formDataSubMenu.posicion}
                    onChange={(e) => {
                      handlerOnChangeSubMenu(e);
                      setErrorPosicionSub("");
                    }}
                    onBlur={validationPosicionSub}
                    placeholder="Ingrese posicion del Submenu"
                  />
                  <SpanError
                    visible={!esValidoPosicionSub || !!errorPosicionSub}
                    mensaje="La Posición no es válida"
                  />
                </div>
              )}
            </ModalForm>
          )}
          {modalPermisos && itemPermisos && (
            <ModalPermisos
              titulo={itemPermisos.opcion}
              roles={roles}
              rolesSeleccionados={rolesTemp}
              onToggle={toggleRolTemp}
              onGuardar={guardarPermisos}
              onCancelar={() => setModalPermisos(false)}
              guardando={guardandoPermisos}
            />
          )}
          {confirmModalMenu.visible && (
            <ModalForm
              titulo="¿Estás seguro?"
              txtConfirmar="Aceptar"
              onConfirmar={confirmarEliminarMenu}
              onCancelar={() =>
                setConfirmModalMenu({ visible: false, menu: null })
              }
            >
              <p className="text-center text-[15px] text-[#333]">
                ¿Eliminar el Menú "{confirmModalMenu.menu?.opcion}"?
              </p>
            </ModalForm>
          )}
          {confirmModalSub.visible && (
            <ModalForm
              titulo="¿Estás seguro?"
              txtConfirmar="Aceptar"
              onConfirmar={confirmarEliminarSub}
              onCancelar={() =>
                setConfirmModalSub({ visible: false, sub: null })
              }
            >
              <p className="text-center text-[15px] text-[#333]">
                ¿Eliminar el Submenu "{confirmModalSub.sub?.opcion}"?
              </p>
            </ModalForm>
          )}
        </div>
      )}
      {/* ── Tab: Roles ── */}
      {tabActiva === "roles" && (
        <div className="bg-white rounded-[5px] shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] p-4 max-[800px]:overflow-hidden">
          <div className="flex justify-between px-4 max-[800px]:flex-col max-[800px]:gap-2.5 max-[800px]:items-start max-[800px]:px-1.25">
            <h2 className="font-bold text-center text-[22px] max-[420px]:text-[17px]">
              Administración de Roles
            </h2>
            <div className="flex gap-2.5">
              <BtnPrimario
                onClick={() => {
                  setModalRol(true);
                  setModoRol("crear");
                }}
              >
                + Rol
              </BtnPrimario>
            </div>
          </div>
          {!tieneRoles ? (
            <Vacio
              titulo="No hay Roles"
              descripcion="No se encontraron roles"
            />
          ) : (
            <Tabla
              datos={datosPaginadosRoles}
              keyExtractor={(rol) => rol.iD_Rol}
              columnas={[
                {
                  header: "Rol",
                  accessor: "rol",
                },
                {
                  header: "Acciones",
                  render: (rol) => (
                    <div className="flex gap-3.75 justify-center items-center">
                      <BtnPrimario onClick={() => abrirEditarRol(rol)}>
                        <FaEdit />
                      </BtnPrimario>
                      <BtnPeligro
                        onClick={() => pedirConfirmacionEliminar(rol)}
                      >
                        <FaTrash />
                      </BtnPeligro>
                    </div>
                  ),
                },
              ]}
            />
          )}

          <Paginacion
            totalRegistros={roles.length}
            registrosPorPagina={registrosPorPagina}
            paginaActual={paginaActualRoles}
            onCambiarPagina={setPaginaActualRoles}
            onCambiarRegistrosPorPagina={handleCambiarRegistros}
          />
          {modalRol && (
            <ModalForm
              titulo={modoRol === "crear" ? "Crear Rol" : "Editar Rol"}
              txtConfirmar={modoRol === "crear" ? "Crear" : "Editar"}
              deshabilitado={!esValidoRol}
              onConfirmar={() =>
                modoRol === "crear" ? crearRol() : editarRol()
              }
              onCancelar={cancelarModalRol}
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="">Nombre del Rol:</label>
                <Input
                  type="text"
                  name="rol"
                  esValido={esValidoRol}
                  value={formDataRol.rol}
                  onChange={handlerOnChangeRol}
                  onBlur={validationRol}
                  placeholder="Ingrese el nombre del nuevo Rol"
                />
                <SpanError
                  visible={!esValidoRol}
                  mensaje="El Rol no es válido"
                />
              </div>
            </ModalForm>
          )}
          {confirmModalRol.visible && (
            <ModalForm
              titulo="¿Estás seguro?"
              txtConfirmar="Aceptar"
              onConfirmar={confirmarEliminar}
              onCancelar={() =>
                setConfirmModalRol({ visible: false, rol: null })
              }
            >
              <p className="text-center text-[15px] text-[#333]">
                ¿Deseas eliminar este Rol?
              </p>
            </ModalForm>
          )}
        </div>
      )}
    </div>
  );
}
