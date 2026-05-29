"use client"

import { useEffect, useState } from "react";
import styles from './page.module.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import React from "react";
import { menuData, menuSchema, rolData, rolSchema } from "@/app/utils/validations";
import Toast from "@/app/components/toast/Toast";
import { useToast } from "@/app/hooks/useToast";
import { useMenu } from "@/app/hooks/useMenu";
import { Menu, Rol, SubMenu } from "@/app/interfaces/menus";
import ConfirmModal from "@/app/components/confirmModal/confirmModal";

export default function Administracion() {

    const { toast, mostrarExito, mostrarError, cerrarToast } = useToast();

    const [tabActiva, setTabActiva] = useState<'menus' | 'roles'>('menus');

    const [menus, setMenus] = useState<Menu[]>([]);
    const { cargarMenus } = useMenu();
    const [roles, setRoles] = useState<Rol[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

    const [confirmModal, setConfirmModal] = useState<{ visible: boolean; rol: Rol | null }>({
        visible: false,
        rol: null
    });

    //constantes para modal crear rol
    const [modalCrearRol, setModalCrearRol] = useState(false);
    const [modalEditarRol, setModalEditarRol] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
    const [formDataRol, setFormDataRol] = useState<rolData>({
        rol: '',
    });
    const [esValidoRol, setEsValidoRol] = useState(true);

    //constantes para modal menu
    const [modalMenu, setModalMenu] = useState(false);
    const [formDataMenu, setFormDataMenu] = useState<menuData>({
        opcion: '',
        posicion: 1,
    })
    const [esValidoOpcion, setEsValidoOpcion] = useState(true);
    const [esValidoPosicion, setEsValidoPosicion] = useState(true);

    //constantes para modal Submenu
    const [modalSubMenu, setModalSubMenu] = useState(false);
    const [formDataSubMenu, setFormDataSubMenu] = useState<menuData>({
        opcion: '',
        posicion: 1,
    })
    const [esValidoOpcionSub, setEsValidoOpcionSub] = useState(true);
    const [esValidoPosicionSub, setEsValidoPosicionSub] = useState(true);
    const [menuSeleccionado, setMenuSeleccionado] = useState<number | null>(null);

    //constantes para gestionar roles
    const [modalPermisos, setModalPermisos] = useState(false);
    const [itemPermisos, setItemPermisos] = useState<Menu | SubMenu | null>(null);
    const [rolesTemp, setRolesTemp] = useState<number[]>([]);
    const [guardandoPermisos, setGuardandoPermisos] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const res = await fetch('/api/menu/adminMenuRol');
            const data = await res.json();
            setRoles(data.roles);
            setMenus(data.menus)

        } catch (error) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    }

    const Habilitar = async (menu: Menu) => {
        const nuevoHabilitado = menu.habilitado === 1 ? 0 : 1;

        const res = await fetch('/api/menu/actualizarMenu', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...menu,
                habilitado: nuevoHabilitado
            })
        });

        if (res.ok) {
            mostrarExito(`${menu.opcion} ${nuevoHabilitado === 1 ? 'habilitado' : 'deshabilitado'}`);
        } else {
            mostrarError(`Error al actualizar ${menu.opcion}`);
        }
        cargarDatos();
        await cargarMenus();
    }

    const HabilitarSUB = async (submenu: SubMenu) => {
        const nuevoHabilitado = submenu.habilitado === 1 ? 0 : 1;

        const res = await fetch('/api/menu/actualizarSubMenu', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...submenu,
                habilitado: nuevoHabilitado
            })
        });

        if (res.ok) {
            mostrarExito(`${submenu.opcion} ${nuevoHabilitado === 1 ? 'habilitado' : 'deshabilitado'}`);
        } else {
            mostrarError(`Error al actualizar ${submenu.opcion}`);
        }
        cargarDatos();
        await cargarMenus();
    }

    const cambiarPosicion = async (menu: Menu, nuevaPosicion: number) => {
        const res = await fetch('/api/menu/actualizarMenu',
            {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...menu,
                    posicion: nuevaPosicion
                })
            }
        );
        if (res.ok) {
            mostrarExito(`Cambio de Posicion de ${menu.opcion}`);
        } else {
            mostrarError(`Error al actualizar posición ${menu.opcion}`);
        }
        cargarDatos();
        await cargarMenus();
    }

    const cambiarPosicionSUB = async (submenu: SubMenu, nuevaPosicion: number) => {
        const res = await fetch('/api/menu/actualizarSubMenu',
            {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...submenu,
                    posicion: nuevaPosicion
                })
            }
        );
        if (res.ok) {
            mostrarExito(`Cambio de Posicion de ${submenu.opcion}`);
        } else {
            mostrarError(`Error al actualizar posición ${submenu.opcion}`);
        }
        cargarDatos();
        await cargarMenus();
    }

    const gestionSubmenu = (idMenu: number) => {
        setMenuAbierto(e => e === idMenu ? null : idMenu);
    }

    //Gestion de roles
    const abrirPermisos = (item: Menu | SubMenu) => {
        setItemPermisos(item);
        setRolesTemp(item.rolesAsignados.filter(r => r.habilitado === 1).map(r => r.rol_ID));
        setModalPermisos(true);
    };

    const toggleRolTemp = (idRol: number) => {
        setRolesTemp(prev => prev.includes(idRol) ? prev.filter(id => id !== idRol) : [...prev, idRol]);
    };

    const guardarPermisos = async () => {
        if (!itemPermisos) return;
        setGuardandoPermisos(true);

        const esMenu = 'iD_Menu' in itemPermisos;
        const rolesConRegistro = itemPermisos.rolesAsignados;

        const activar = rolesTemp.filter(idRol => {
            const registro = rolesConRegistro.find(r => r.rol_ID === idRol);
            return !registro || registro.habilitado === 0;
        });

        const desactivar = rolesConRegistro.filter(r =>
            r.habilitado === 1 && !rolesTemp.includes(r.rol_ID)
        );

        const nuevos = activar.filter(idRol =>
            !rolesConRegistro.find(r => r.rol_ID === idRol)
        );

        const reactivar = activar.filter(idRol =>
            rolesConRegistro.find(r => r.rol_ID === idRol && r.habilitado === 0)
        );

        const promesasAgregar = nuevos.map(idRol =>
            fetch(`/api/menu/${esMenu ? 'asignarMenuRol' : 'asignarSubMenuRol'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    esMenu
                        ? { menu_ID: (itemPermisos as Menu).iD_Menu, rol_ID: idRol }
                        : { subMenu_ID: (itemPermisos as SubMenu).iD_SubMenu, rol_ID: idRol }
                )
            })
        );

        const promesasReactivar = reactivar.map(idRol => {
            const registro = rolesConRegistro.find(r => r.rol_ID === idRol)!;
            return fetch(`/api/menu/${esMenu ? 'asignarMenuRol' : 'asignarSubMenuRol'}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ iD_Menu_Rol: registro.iD_Menu_Rol, habilitado: 1 })
            });
        });

        const promesasDesactivar = desactivar.map(r =>
            fetch(`/api/menu/${esMenu ? 'asignarMenuRol' : 'asignarSubMenuRol'}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ iD_Menu_Rol: r.iD_Menu_Rol, habilitado: 0 })
            })
        );

        await Promise.all([...promesasAgregar, ...promesasDesactivar, ...promesasReactivar]);

        mostrarExito(`Permisos de "${itemPermisos.opcion}" actualizados`);
        setModalPermisos(false);
        setItemPermisos(null);
        setGuardandoPermisos(false);
        cargarDatos();
        await cargarMenus();
    };

    //Validacion modal menu
    const handlerOnChangeMenu = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormDataMenu((values) => ({
            ...values,
            [name]: value,
        }));

        if (name === "opcion" && !esValidoOpcion) {
            setEsValidoOpcion(true);
        }

        if (name === "posicion" && !esValidoPosicion) {
            setEsValidoPosicion(true);
        }
    }

    const validationOpcion = () => {
        const result = menuSchema.shape.opcion.safeParse(formDataMenu.opcion);
        setEsValidoOpcion(result.success)
    }

    const validationPosicion = () => {
        const result = menuSchema.shape.posicion.safeParse(formDataMenu.posicion);
        setEsValidoPosicion(result.success)
    }

    const cancelarModal = () => {
        setFormDataMenu({
            opcion: '',
            posicion: 1
        })
        setModalMenu(false)
    }

    //Validacion modal Submenu
    const handlerOnChangeSubMenu = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "opcionSub") {
            setFormDataSubMenu(prev => ({ ...prev, opcion: value }));
            if (!esValidoOpcionSub) setEsValidoOpcionSub(true);
        }

        if (name === "posicionSub") {
            setFormDataSubMenu(prev => ({ ...prev, posicion: Number(value) }));
            if (!esValidoPosicionSub) setEsValidoPosicionSub(true);
        }
    }


    const validationOpcionSub = () => {
        const result = menuSchema.shape.opcion.safeParse(formDataSubMenu.opcion);
        setEsValidoOpcionSub(result.success);
    }

    const validationPosicionSub = () => {
        const result = menuSchema.shape.posicion.safeParse(formDataSubMenu.posicion);
        setEsValidoPosicionSub(result.success);
    }

    const cancelarModalSub = () => {
        setFormDataSubMenu({
            opcion: '',
            posicion: 1
        })
        setModalSubMenu(false)
    }

    const crearMenu = async () => {
        if (!formDataMenu.opcion.trim()) return;
        const res = await fetch('/api/menu/crearMenu',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    opcion: formDataMenu.opcion,
                    posicion: formDataMenu.posicion
                }
                )
            }
        );

        if (res.ok) {
            mostrarExito(`Menú ${formDataMenu.opcion} creado correctamente`);
        } else {
            mostrarError('Error al crear el menú');
        }

        setFormDataMenu({
            opcion: '',
            posicion: 1
        })
        setModalMenu(false);
        cargarDatos();
        await cargarMenus();
    }

    const crearSubMenu = async () => {
        if (!formDataSubMenu.opcion.trim()) {
            mostrarError('Ingrese un nombre para el submenu');
            return;
        }

        if (!menuSeleccionado) {
            mostrarError('Seleccione un menú padre');
            return;
        }
        const res = await fetch('api/menu/crearSubmenu',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    opcion: formDataSubMenu.opcion,
                    posicion: formDataSubMenu.posicion,
                    menu_ID: menuSeleccionado
                })
            }
        );
        if (res.ok) {
            mostrarExito(`Submenú ${formDataSubMenu.opcion} creado correctamente`);
        } else {
            mostrarError('Error al crear el Submenú');
        }

        setFormDataSubMenu({
            opcion: '',
            posicion: 1
        })
        setModalSubMenu(false);
        cargarDatos();
        await cargarMenus();
    }

    //validar Rol
    const handlerOnChangeRol = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormDataRol((values) => ({
            ...values,
            [name]: value,
        }));

        if (name === "rol" && !esValidoRol) {
            setEsValidoRol(true);
        }
    }

    const validationRol = () => {
        const result = rolSchema.shape.rol.safeParse(formDataRol.rol);
        setEsValidoRol(result.success)
    }

    const cancelarModalRol = () => {
        setFormDataRol({
            rol: ''
        });
        setModalCrearRol(false);
        setModalEditarRol(false);
    }

    //CRUD Rol
    const crearRol = async () => {
        if (!formDataRol.rol.trim()) return;

        const res = await fetch('/api/roles/crearRoles',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rol: formDataRol.rol
                })
            }
        );

        if (res.ok) {
            mostrarExito(`Rol ${formDataMenu.opcion} creado correctamente`);
        } else {
            mostrarError('Error al crear el Rol');
        }

        setFormDataRol({
            rol: ''
        })
        setModalCrearRol(false);
        cargarDatos();
    }

    const pedirConfirmacionEliminar = (rol: Rol) => {
        setConfirmModal({ visible: true, rol });
    };

    const confirmarEliminar = async () => {
        if (!confirmModal.rol) return;
        await eliminarRol(confirmModal.rol);
        setConfirmModal({ visible: false, rol: null });
    };

    const eliminarRol = async (rol: Rol) => {
        const res = await fetch('/api/roles/eliminarRoles', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ iD_Rol: rol.iD_Rol })
        });
        if (res.ok) {
            mostrarExito(`Rol "${rol.rol}" eliminado`);
        } else {
            mostrarError('Error al eliminar el rol');
        }
        cargarDatos();
        await cargarMenus();
    };

    const abrirEditarRol = (rol: Rol) => {
        setRolSeleccionado(rol);
        setFormDataRol({ rol: rol.rol });
        setModalEditarRol(true);
    };

    const actualizarRol = async () => {
        if (!rolSeleccionado || !formDataRol.rol.trim()) return;

        const res = await fetch('/api/roles/actualizarRoles', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                iD_Rol: rolSeleccionado.iD_Rol,
                rol: formDataRol.rol
            })
        });

        if (res.ok) {
            mostrarExito(`Rol actualizado correctamente`);
        } else {
            mostrarError('Error al actualizar el rol');
        }

        setFormDataRol({ rol: '' });
        setRolSeleccionado(null);
        setModalEditarRol(false);
        cargarDatos();
    }

    return (
        <div className={styles.cards}>

            {toast && (
                <Toast
                    mensaje={toast.mensaje}
                    tipo={toast.tipo}
                    onClose={cerrarToast}
                />
            )}

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${tabActiva === 'menus' ? styles.tabActive : ''}`}
                    onClick={() => setTabActiva('menus')}>
                    Administrar Menu
                </button>
                <button className={`${styles.tab} ${tabActiva === 'roles' ? styles.tabActive : ''}`}
                    onClick={() => setTabActiva('roles')}>
                    Administrar Roles
                </button>
            </div>

            {
                tabActiva === 'menus' && (
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <h2>Administración de Menú</h2>
                            <div className={styles.headerBtn}>
                                <button onClick={() => setModalMenu(true)} className={styles.Btncrear}>+ Menu</button>
                                <button onClick={() => setModalSubMenu(true)} className={styles.Btncrear}>+ SubMenu</button>
                                {/* <button className={styles.Btncrear}>+ Submenu</button> */}
                            </div>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Menú</th>
                                    <th>Posición</th>
                                    <th>Roles</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.map(menu => (
                                    <React.Fragment key={menu.iD_Menu}>

                                        <tr key={menu.iD_Menu}>

                                            <td>
                                                <button
                                                    className={styles.menuBtn}
                                                    onClick={() => gestionSubmenu(menu.iD_Menu)}
                                                >
                                                    {menu.opcion}
                                                    {menu.submenus?.length > 0 && (
                                                        menuAbierto === menu.iD_Menu
                                                            ? <FaChevronDown size={12} />
                                                            : <FaChevronRight size={12} />
                                                    )}
                                                </button>
                                            </td>

                                            <td>
                                                <input
                                                    type="number"
                                                    defaultValue={menu.posicion}
                                                    className={styles.inputPos}
                                                    onBlur={(e) => {
                                                        const nueva = Number(e.target.value);
                                                        if (nueva !== menu.posicion) {
                                                            cambiarPosicion(menu, nueva);
                                                        }
                                                    }}
                                                />
                                            </td>

                                            <td>
                                                <button
                                                    className={styles.Btnpermisos}
                                                    onClick={() => abrirPermisos(menu)}>
                                                    {menu.rolesAsignados.filter(r => r.habilitado === 1).length} de {roles.length}
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    onClick={() => Habilitar(menu)}
                                                    className={menu.habilitado === 1 ? styles.btnDeshabilitar : styles.btnHabilitar}
                                                >
                                                    {menu.habilitado === 1 ? 'Habilitado' : 'Deshabilitado'}
                                                </button>
                                            </td>
                                        </tr>
                                        {
                                            menuAbierto === menu.iD_Menu && menu.submenus?.length > 0 && (
                                                menu.submenus.map(sub => (
                                                    <tr key={sub.iD_SubMenu} className={styles.submenurow}>
                                                        <td>{sub.opcion}</td>
                                                        <td><input
                                                            type="number"
                                                            defaultValue={sub.posicion}
                                                            className={styles.inputPos}
                                                            onBlur={(e) => {
                                                                const nueva = Number(e.target.value);
                                                                if (nueva !== sub.posicion) {
                                                                    cambiarPosicionSUB(sub, nueva);
                                                                }
                                                            }}
                                                        />
                                                        </td>
                                                        <td>
                                                            <button
                                                                className={styles.Btnpermisos}
                                                                onClick={() => abrirPermisos(sub)}>
                                                                {sub.rolesAsignados.filter(r => r.habilitado === 1).length} de {roles.length}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => HabilitarSUB(sub)}
                                                                className={sub.habilitado === 1 ? styles.btnDeshabilitar : styles.btnHabilitar}
                                                            >
                                                                {sub.habilitado === 1 ? 'Habilitado' : 'Deshabilitado'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )
                                        }
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        {
                            modalMenu && (
                                <div className={styles.modalOverlay}>
                                    <div className={styles.modal}>
                                        <div className={styles.headModal}>
                                            <h2>Nuevo Menú</h2>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Nombre:</label>
                                            <input
                                                type="text"
                                                name="opcion"
                                                className={!esValidoOpcion ? styles.inputError : styles.input}
                                                value={formDataMenu.opcion}
                                                onChange={handlerOnChangeMenu}
                                                onBlur={validationOpcion}
                                                placeholder="Ingrese el nombre de la nueva opción"
                                            />
                                            <span className={`${styles.spanError} ${!esValidoOpcion ? styles.err : ""}`}>La Opción no es válida</span>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Posición:</label>
                                            <input
                                                type="number"
                                                name="posicion"
                                                className={!esValidoPosicion ? styles.inputError : styles.input}
                                                value={formDataMenu.posicion}
                                                onChange={handlerOnChangeMenu}
                                                onBlur={validationPosicion}
                                                placeholder="Ingrese el posicion de la nueva opción"
                                            />
                                            <span className={`${styles.spanError} ${!esValidoPosicion ? styles.err : ""}`}>La Posicion no es válida</span>
                                        </div>
                                        <div className={styles.modalBtns}>
                                            <button className={styles.Btncrear}
                                                disabled={!esValidoOpcion || !esValidoPosicion}
                                                onClick={crearMenu}>
                                                Crear
                                            </button>
                                            <button onClick={cancelarModal} className={styles.Btncancelar}>Cancelar</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            modalSubMenu && (
                                <div className={styles.modalOverlay}>
                                    <div className={styles.modal}>
                                        <div className={styles.headModal}>
                                            <h2>Nuevo SubMenú</h2>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Menú padre:</label>
                                            <select
                                                value={menuSeleccionado || ''}
                                                onChange={e => setMenuSeleccionado(Number(e.target.value))}
                                            >
                                                <option value="">Selecciona un menú</option>
                                                {menus.map(m => (
                                                    <option key={m.iD_Menu} value={m.iD_Menu}>{m.opcion}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Nombre:</label>
                                            <input
                                                type="text"
                                                name="opcionSub"
                                                className={!esValidoOpcionSub ? styles.inputError : styles.input}
                                                value={formDataSubMenu.opcion}
                                                onChange={handlerOnChangeSubMenu}
                                                onBlur={validationOpcionSub}
                                                placeholder="Ingrese el nombre de el nuevo submenu"
                                            />
                                            <span className={`${styles.spanError} ${!esValidoOpcionSub ? styles.err : ""}`}>La Opción no es válido</span>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Posición:</label>
                                            <input
                                                type="number"
                                                name="posicionSub"
                                                className={!esValidoPosicionSub ? styles.inputError : styles.input}
                                                value={formDataSubMenu.posicion}
                                                onChange={handlerOnChangeSubMenu}
                                                onBlur={validationPosicionSub}
                                                placeholder="Ingrese posicion del nuevo submenu"
                                            />
                                            <span className={`${styles.spanError} ${!esValidoPosicionSub ? styles.err : ""}`}>La Posicion no es válida</span>
                                        </div>
                                        <div className={styles.modalBtns}>
                                            <button className={styles.Btncrear}
                                                disabled={!esValidoOpcionSub}
                                                onClick={crearSubMenu}>
                                                Crear
                                            </button>
                                            <button onClick={cancelarModalSub} className={styles.Btncancelar}>Cancelar</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            modalPermisos && itemPermisos && (
                                <div className={styles.modalOverlay}>
                                    <div className={styles.modal}>
                                        <div className={styles.headModal}>
                                            <h2>Permisos</h2>
                                            <h2>{itemPermisos.opcion}</h2>
                                        </div>

                                        <div className={styles.listaRoles}>
                                            {roles.map(rol => (
                                                <label key={rol.iD_Rol} className={styles.rolItem}>
                                                    <span>{rol.rol}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={rolesTemp.includes(rol.iD_Rol)}
                                                        onChange={() => toggleRolTemp(rol.iD_Rol)}
                                                    />

                                                </label>
                                            ))
                                            }
                                        </div>

                                        <div className={styles.modalBtns}>
                                            <button
                                                className={styles.Btncrear}
                                                onClick={guardarPermisos}
                                                disabled={guardandoPermisos}
                                            >
                                                {guardandoPermisos ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button
                                                className={styles.Btncancelar}
                                                onClick={() => setModalPermisos(false)}
                                                disabled={guardandoPermisos}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                )
            }

            {
                tabActiva === 'roles' && (
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <h2>Administración de Roles</h2>
                            <div className={styles.headerBtn}>
                                <button className={styles.Btncrear} onClick={() => setModalCrearRol(true)}>+ Rol</button>
                            </div>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map(rol => (
                                    <React.Fragment key={rol.iD_Rol}>

                                        <tr key={rol.iD_Rol}>

                                            <td className={styles.rol}>
                                                {rol.rol}
                                            </td>

                                            <td className={styles.acciones}>
                                                <button className={styles.Btncancelar}
                                                    onClick={() => pedirConfirmacionEliminar(rol)}>
                                                    Eliminar
                                                </button>
                                                <button className={styles.Btncrear}
                                                    onClick={() => abrirEditarRol(rol)}>
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        {
                            modalCrearRol && (
                                <div className={styles.modalOverlay}>
                                    <div className={styles.modal}>
                                        <div className={styles.headModal}>
                                            <h2>Nuevo Rol</h2>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Nombre del Rol:</label>
                                            <input
                                                type="text"
                                                name="rol"
                                                className={!esValidoRol ? styles.inputError : styles.input}
                                                value={formDataRol.rol}
                                                onChange={handlerOnChangeRol}
                                                onBlur={validationRol}
                                                placeholder="Ingrese el nombre del nuevo Rol"
                                            />
                                            <span className={`${styles.spanError} ${!esValidoRol ? styles.err : ""}`}>El Rol no es válido</span>
                                        </div>
                                        <div className={styles.modalBtns}>
                                            <button className={styles.Btncrear}
                                                disabled={!esValidoRol}
                                                onClick={crearRol}
                                            >
                                                Crear
                                            </button>
                                            <button
                                                onClick={cancelarModalRol}
                                                className={styles.Btncancelar}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            modalEditarRol && (
                                <div className={styles.modalOverlay}>
                                    <div className={styles.modal}>
                                        <div className={styles.headModal}>
                                            <h2>Editar Rol</h2>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Nombre del Rol:</label>
                                            <input
                                                type="text"
                                                name="rol"
                                                className={!esValidoRol ? styles.inputError : styles.input}
                                                value={formDataRol.rol}
                                                onChange={handlerOnChangeRol}
                                                onBlur={validationRol}
                                                placeholder="Ingrese el nuevo nombre del nuevo Rol"
                                            />
                                            <span className={`${styles.spanError} ${!esValidoRol ? styles.err : ""}`}>El Rol no es válido</span>
                                        </div>
                                        <div className={styles.modalBtns}>
                                            <button className={styles.Btncrear}
                                                disabled={!esValidoRol}
                                                onClick={actualizarRol}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={cancelarModalRol}
                                                className={styles.Btncancelar}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {confirmModal.visible && (
                            <ConfirmModal
                                mensaje={`¿Eliminar el rol "${confirmModal.rol?.rol}"? Esta acción no se puede deshacer.`}
                                onConfirmar={confirmarEliminar}
                                onCancelar={() => setConfirmModal({ visible: false, rol: null })}
                            />
                        )}
                    </div>

                )


            }
        </div>
    )
}