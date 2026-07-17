//Creado por Diego Castro

//  * Página de administración de menús y roles.
//  *
//  * Permite:
//  * - Crear, editar y eliminar menús y submenús.
//  * - Habilitar/deshabilitar menús y submenús (con lógica de cascada).
//  * - Asignar roles a menús y submenús (con propagación al padre o hijos).
//  * - Crear, editar y eliminar roles.

"use client";

import { useCallback, useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import { useToast } from "@/app/hooks/useToast";
import { Menu, Rol } from "@/app/interfaces/menus";
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
  Titulo,
  Label,
} from "@/app/components/ui/";

import {
  posicionMenuOcupada,
  posicionSubMenuOcupada,
} from "../../utils/posiciones";
import { useAdminRoles } from "@/app/hooks/admin/useAdminRoles";
import { useAdminMenus } from "@/app/hooks/admin/useAdminMenus";
import { useAdminPermisos } from "@/app/hooks/admin/useAdminPermisos";

export default function Administracion() {
  //----PAGINACIÓN-----------------------------------------------------------
  const [paginaActualRoles, setPaginaActualRoles] = useState(1);

  const [menusFiltradosBuscador, setMenusFiltradosBuscador] = useState<Menu[]>(
    [],
  );

  // Estado para manejar la búsqueda (si está activa y qué datos mostrar)
  const [busqueda, setBusqueda] = useState({
    dataFiltrada: [] as Menu[],
    busquedaActiva: false,
  });

  // Estado para manejar la paginación (qué página y cuántos registros mostrar)
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    registrosPorPagina: 10,
    rolFiltro: "todos" as number | string | "todos",
  });

  //----TOAST Y TAB----------------------------------------------------------
  const { toast, mostrarExito, mostrarError, cerrarToast } = useToast();
  const [tabActiva, setTabActiva] = useState<"menus" | "roles">("menus");

  //----DATOS PRINCIPALES----------------------------------------------------
  const adminRoles = useAdminRoles(mostrarExito, mostrarError);

  // Hook para administrar roles, menús y permisos
  const {
    roles,
    cargarRoles,
    modalRol,
    setModalRol,
    modoRol,
    setModoRol,
    rolSeleccionado,
    formDataRol,
    esValidoRol,
    confirmModalRol,
    setConfirmModalRol,
    handlerOnChangeRol,
    validationRol,
    cancelarModalRol,
    crearRol,
    abrirEditarRol,
    editarRol,
    pedirConfirmacionEliminar,
    confirmarEliminar,
    errorRoles,
  } = adminRoles;

  const adminMenus = useAdminMenus(mostrarExito, mostrarError);
  const {
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
  } = adminMenus;

  const adminPermisos = useAdminPermisos(menus, cargarDatos, mostrarExito);
  const {
    modalPermisos,
    setModalPermisos,
    itemPermisos,
    rolesTemp,
    guardandoPermisos,
    abrirPermisos,
    toggleRolTemp,
    guardarPermisos,
  } = adminPermisos;

  //----Carga inicial de los datos
  useEffect(() => {
    cargarDatos();
    cargarRoles();
  }, []);

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

  // Función que se ejecuta cuando se hace una búsqueda
  const handleResultadoBusqueda = useCallback((resultados: Menu[]) => {
    setBusqueda({ dataFiltrada: resultados, busquedaActiva: true });
    setPaginacion((prev) => ({ ...prev, paginaActual: 1 }));
  }, []);

  // Funcion para cambiar el filtro de rol
  const handleCambiarRolFiltro = useCallback(
    (value: number | string | "todos") => {
      setPaginacion((prev) => ({
        ...prev,
        rolFiltro: value,
        paginaActual: 1,
      }));
    },
    [],
  );

  // Funciones para cambiar la paginación
  const handleCambiarRegistros = useCallback((cantidad: number) => {
    setPaginacion((prev) => ({
      ...prev,
      registrosPorPagina: cantidad,
      paginaActual: 1,
    }));
  }, []);

  // funcion para cambiar la pagina actual
  const handleCambiarPagina = useCallback((pagina: number) => {
    setPaginacion((prev) => ({ ...prev, paginaActual: pagina }));
  }, []);

  // Extraemos valores actuales de paginación y búsqueda
  const { paginaActual, registrosPorPagina, rolFiltro } = paginacion;
  const { dataFiltrada, busquedaActiva } = busqueda;

  // Si hay búsqueda activa, mostramos los resultados filtrados; si no, todos los menús
  const datosBase = busquedaActiva ? dataFiltrada : menus;

  // Se aplica el filtro de rol sobre los datos base
  const datosAMostrar =
    rolFiltro === "todos"
      ? datosBase
      : datosBase.filter(
          (menu) =>
            menu.rolesAsignados.some(
              (r) => r.rol_ID === rolFiltro && r.habilitado === 1,
            ) ||
            menu.submenus?.some((sub) =>
              sub.rolesAsignados.some(
                (r) => r.rol_ID === rolFiltro && r.habilitado === 1,
              ),
            ),
        );

  // Calculamos los índices para la paginación de menús y roles
  const indexInicioMenus = (paginaActual - 1) * registrosPorPagina;
  const indexFinMenus = indexInicioMenus + registrosPorPagina;
  const datosPaginadosMenus = datosAMostrar.slice(
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
        <div className="bg-[#ffffff] rounded-[5px] shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] p-4 max-[800px]:overflow-hidden">
          <div className="flex justify-between px-4 max-[800px]:flex-col max-[800px]:gap-2.5 max-[800px]:items-start max-[800px]:px-1.25">
            <Titulo titulo="Administración de Menú" alineado={3} />

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
          {!errorMenus && (
            <div className="mt-5 w-full flex gap-3.75 max-[420px]:flex-col">
              <div className="w-4/5 flex justify-center items-center max-[420px]:w-full">
                <Buscador
                  datos={menus}
                  campos={["opcion"]}
                  placeholder="Buscar Menu..."
                  onResultado={handleResultadoBusqueda}
                />
              </div>
              <div className="flex items-center text-[#555555] gap-3.75 max-[420px]:gap-1.25">
                <h4>Rol:</h4>
                <ComboBoxFiltro
                  valor={rolFiltro}
                  placeholder="Todos los Roles"
                  opciones={roles.map((rol) => ({
                    value: rol.iD_Rol,
                    label: rol.rol,
                  }))}
                  onChange={handleCambiarRolFiltro}
                />
              </div>
            </div>
          )}

          {cargando ? (
            <Loading />
          ) : (
            <div className="w-full max-[800px]:overflow-x-auto">
              {errorMenus ? (
                <Vacio
                  titulo="Ocurrio un Error."
                  descripcion="No se pudieron cargar los menus."
                  onReintentar={cargarDatos}
                />
              ) : !tieneMenus ? (
                <Vacio
                  titulo="No hay datos disponibles"
                  descripcion="No se encontraron registros de Menus para mostrar"
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
                                [`sub-${sub.iD_SubMenu}`]: Number(
                                  e.target.value,
                                ),
                              }));
                            }}
                            onBlur={async (e) => {
                              const nueva = Number(e.target.value);
                              if (nueva !== sub.posicion) {
                                if (
                                  posicionSubMenuOcupada(
                                    menus,
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
                              sub.rolesAsignados.filter(
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
                          type="button"
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
                              if (
                                posicionMenuOcupada(menus, nueva, menu.iD_Menu)
                              ) {
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
                totalRegistros={datosAMostrar.length}
                registrosPorPagina={registrosPorPagina}
                paginaActual={paginaActual}
                onCambiarPagina={handleCambiarPagina}
                onCambiarRegistrosPorPagina={handleCambiarRegistros}
              />
            </div>
          )}

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
                <Label nombre="Nombre:" />
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
                  <Label nombre="Posición:" />
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
                <Label nombre="Ícono:" />
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
                <div className="flex flex-col gap-1 mb-4">
                  <Label nombre="Menú Padre:" />
                  <ComboBoxFiltro
                    opciones={menus.map((m) => ({
                      value: m.iD_Menu,
                      label: m.opcion,
                    }))}
                    valor={menuSeleccionado || ""}
                    onChange={(value) => setMenuSeleccionado(Number(value))}
                    placeholder="Selecciona un menú"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <Label nombre="Nombre:" />
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
                  <Label nombre="Posición:" />
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
            <Titulo titulo="Administración de Roles" alineado={3} />
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
          {cargando ? (
            <Loading />
          ) : (
            <div className="w-full max-[800px]:overflow-x-auto">
              {errorRoles ? (
                <Vacio
                  titulo="Ocurrio un Error."
                  descripcion="No se pudo cargar la información de roles."
                  onReintentar={cargarRoles}
                />
              ) : !tieneRoles ? (
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
            </div>
          )}

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
                <Label nombre="Nombre del Rol:" />
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
