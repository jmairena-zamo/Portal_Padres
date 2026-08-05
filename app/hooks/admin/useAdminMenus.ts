// Creado por Diego Castro
// Estados para la administración de menus

import { useCallback, useState } from "react";
import { Menu, SubMenu } from "@/app/interfaces/menus";
import { menuData, subMenuData, menuSchema } from "@/app/utils/validations";
import { useMenu } from "@/app/hooks/useMenu";
import {
  posicionMenuOcupada,
  posicionSubMenuOcupada,
} from "@/app/utils/posiciones";

type MostrarToast = (msg: string) => void;

const normalizarTexto = (texto: string) =>
  texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const esMenuProtegido = (texto: string) => normalizarTexto(texto) === "administracion";

export function useAdminMenus(
  mostrarExito: MostrarToast,
  mostrarError: MostrarToast,
) {
  const { cargarMenus } = useMenu();

  //----DATOS PRINCIPALES----------------------------------------------------
  const [menus, setMenus] = useState<Menu[]>([]);
  const [cargando, setCargando] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [posicionesEditando, setPosicionesEditando] = useState<
    Record<string, number>
  >({});

  //----MODALES DE CONFIRMACIÓN----------------------------------------------
  const [confirmModalMenu, setConfirmModalMenu] = useState<{
    visible: boolean;
    menu: Menu | null;
  }>({ visible: false, menu: null });

  const [confirmModalSub, setConfirmModalSub] = useState<{
    visible: boolean;
    sub: SubMenu | null;
  }>({ visible: false, sub: null });

  //----MODAL Y FORMULARIO DE MENU--------------------------------------------
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

  //----MODAL Y FORMULARIO DE SUBMENU-----------------------------------------
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
  const [errorMenus, setErrorMenus] = useState<boolean>(false);

  //----Carga inicial----------------------------------------------------------
  /** Carga menús desde la API.*/
  const cargarDatos = useCallback(async () => {
    const inicio = Date.now();
    setCargando(true);
    setErrorMenus(false);
    try {
      const res = await fetch("/api/menu/adminMenuRol");

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setMenus(data.menus);
      const transcurrido = Date.now() - inicio;
      const restante = 1000 - transcurrido;
      if (restante > 0) {
        await new Promise((resolve) => setTimeout(resolve, restante));
      }
      return data;
    } catch {
      mostrarError("Error de conexión. Intenta de nuevo.");
      setErrorMenus(true);
      return null;
    } finally {
      setCargando(false);
    }
  }, [mostrarError]);

  //----HABILITAR Y DESHABILITAR-----------------------------------------------
  const Habilitar = useCallback(
    async (menu: Menu) => {
      const nuevoHabilitado = menu.habilitado === 1 ? 0 : 1;

      if (esMenuProtegido(menu.opcion) && nuevoHabilitado === 0) {
        mostrarError("El menú Administración no puede desactivarse.");
        return;
      }

      // Se crean promesas para actualizar el menú y sus submenús (si los tiene) en paralelo
      const promesas: Promise<Response>[] = [
        fetch("/api/menu/actualizarMenu", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...menu, habilitado: nuevoHabilitado }),
        }),
      ];

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

      // Se verifica si todas las promesas se resolvieron correctamente
      if (res.every((r) => r.ok)) {
        mostrarExito(
          `${menu.opcion} ${nuevoHabilitado === 1 ? "habilitado" : "deshabilitado"}`,
        );
      } else {
        mostrarError(`Error al actualizar ${menu.opcion}`);
      }
      await cargarDatos();
      await cargarMenus();
    },
    [mostrarExito, mostrarError, cargarDatos, cargarMenus],
  );

  const HabilitarSUB = useCallback(
    async (submenu: SubMenu) => {
      const nuevoHabilitado = submenu.habilitado === 1 ? 0 : 1;

      const promesas: Promise<Response>[] = [
        fetch("/api/menu/actualizarSubMenu", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...submenu, habilitado: nuevoHabilitado }),
        }),
      ];

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
      await cargarDatos();
      await cargarMenus();
    },
    [menus, mostrarExito, mostrarError, cargarDatos, cargarMenus],
  );

  //----Cambio de posición-------------------------------------------------------
  const cambiarPosicion = async (menu: Menu, nuevaPosicion: number) => {
    if (posicionMenuOcupada(menus, nuevaPosicion, menu.iD_Menu)) {
      mostrarError(
        `La posición ${nuevaPosicion} ya está ocupada por otro menú`,
      );
      await cargarDatos();
      return;
    }

    const res = await fetch("/api/menu/actualizarMenu", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...menu, posicion: nuevaPosicion }),
    });
    if (res.ok) {
      mostrarExito(`Cambio de Posicion de ${menu.opcion}`);
    } else {
      mostrarError(`Error al actualizar posición ${menu.opcion}`);
    }
    await cargarDatos();
    await cargarMenus();
  };

  const cambiarPosicionSUB = async (
    submenu: SubMenu,
    nuevaPosicion: number,
  ) => {
    if (
      posicionSubMenuOcupada(
        menus,
        nuevaPosicion,
        submenu.menu_ID,
        submenu.iD_SubMenu,
      )
    ) {
      mostrarError(`La posición ${nuevaPosicion} ya está ocupada en este menú`);
      await cargarDatos();
      return;
    }

    const res = await fetch("/api/menu/actualizarSubMenu", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...submenu, posicion: nuevaPosicion }),
    });
    if (res.ok) {
      mostrarExito(`Cambio de Posicion de ${submenu.opcion}`);
    } else {
      mostrarError(`Error al actualizar posición ${submenu.opcion}`);
    }
    await cargarDatos();
    await cargarMenus();
  };

  const gestionSubmenu = (idMenu: number) => {
    setMenuAbierto((e) => (e === idMenu ? null : idMenu));
  };

  //----Validación y handlers del formulario menu-----------------------------
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

  const cancelarModal = () => {
    setFormDataMenu({ opcion: "", posicion: 1, icono: "" });
    setEsValidoOpcion(true);
    setEsValidoPosicion(true);
    setEsValidoIcono(true);
    setErrorPosicionMenu("");
    setModalMenu(false);
  };

  //----Validación y handlers del formulario submenu----------------------------
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

    if (posicionMenuOcupada(menus, Number(formDataMenu.posicion))) {
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

    setFormDataMenu({ opcion: "", posicion: 1, icono: "" });
    setModalMenu(false);
    await cargarDatos();
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

    setFormDataMenu({ opcion: "", posicion: 1, icono: "" });
    setModalMenu(false);
    await cargarDatos();
    await cargarMenus();
  };

  const pedirConfirmacionEliminarMenu = (menu: Menu) => {
    setConfirmModalMenu({ visible: true, menu });
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
    await cargarDatos();
    await cargarMenus();
  };

  const confirmarEliminarMenu = async () => {
    if (!confirmModalMenu.menu) return;
    const menuAEliminar = confirmModalMenu.menu;
    // Cerrar el modal inmediatamente para evitar que reaparezca durante recargas
    setConfirmModalMenu({ visible: false, menu: null });
    await eliminarMenu(menuAEliminar);
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
      posicionSubMenuOcupada(
        menus,
        Number(formDataSubMenu.posicion),
        menuSeleccionado,
      )
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

    setFormDataSubMenu({ opcion: "", posicion: 1 });
    setModalSubMenu(false);
    await cargarDatos();
    await cargarMenus();
  };

  const editarSubMenu = async (sub: SubMenu | null) => {
    if (!formDataSubMenu.opcion.trim()) return;
    const res = await fetch("/api/menu/actualizarSubMenu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sub, opcion: formDataSubMenu.opcion }),
    });

    if (res.ok) {
      mostrarExito(
        `Submenú ${formDataSubMenu.opcion} actualizado correctamente`,
      );
    } else {
      mostrarError("Error al actualizar el submenú");
    }

    setFormDataSubMenu({ opcion: "", posicion: 1 });
    setModalSubMenu(false);
    await cargarDatos();
    await cargarMenus();
  };

  const pedirConfirmacionEliminarSub = (sub: SubMenu) => {
    setConfirmModalSub({ visible: true, sub });
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
    await cargarDatos();
    await cargarMenus();
  };

  const confirmarEliminarSub = async () => {
    if (!confirmModalSub.sub) return;
    const subAEliminar = confirmModalSub.sub;
    // Cerrar el modal inmediatamente para evitar que reaparezca durante recargas
    setConfirmModalSub({ visible: false, sub: null });
    await eliminarSubMenu(subAEliminar);
  };

  return {
    menus,
    cargando,
    cargarDatos,
    menuAbierto,
    gestionSubmenu,
    posicionesEditando,
    setPosicionesEditando,
    Habilitar,
    HabilitarSUB,
    cambiarPosicion,
    cambiarPosicionSUB,

    modalMenu,
    setModalMenu,
    modoMenu,
    setModoMenu,
    formDataMenu,
    setFormDataMenu,
    esValidoOpcion,
    esValidoPosicion,
    esValidoIcono,
    menuSeleccionadoEditar,
    setMenuSeleccionadoEditar,
    errorPosicionMenu,
    setErrorPosicionMenu,
    handlerOnChangeMenu,
    handlerOnChangeIcon,
    validationOpcion,
    validationPosicion,
    cancelarModal,
    crearMenu,
    editarMenu,
    confirmModalMenu,
    setConfirmModalMenu,
    pedirConfirmacionEliminarMenu,
    confirmarEliminarMenu,

    modalSubMenu,
    setModalSubMenu,
    modoSubMenu,
    setModoSubMenu,
    formDataSubMenu,
    setFormDataSubMenu,
    esValidoOpcionSub,
    esValidoPosicionSub,
    menuSeleccionado,
    setMenuSeleccionado,
    subMenuSeleccionadoEditar,
    setSubMenuSeleccionadoEditar,
    errorPosicionSub,
    setErrorPosicionSub,
    handlerOnChangeSubMenu,
    validationOpcionSub,
    validationPosicionSub,
    cancelarModalSub,
    crearSubMenu,
    editarSubMenu,
    confirmModalSub,
    setConfirmModalSub,
    pedirConfirmacionEliminarSub,
    confirmarEliminarSub,
    errorMenus,
  };
}
