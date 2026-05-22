"use client"

import { useEffect, useState } from "react";
import styles from './page.module.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import React from "react";
import { menuData, menuSchema } from "@/app/utils/validations";
import Toast from "@/app/components/toast/Toast";
import { useToast } from "@/app/hooks/useToast";


interface Rol {
    iD_Rol: number;
    rol: string;
}

interface MenuRol {
    iD_Menu_Rol: number;
    menu_ID: number;
    rol_ID: number;
}

interface SubMenuRol {
    iD_Menu_Rol: number;
    subMenu_ID: number;
    rol_ID: number;
}

interface SubMenu {
    iD_SubMenu: number;
    opcion: string;
    posicion: number;
    menu_ID: number;
    habilitado: number;
    estado: number;
    icono: string;
    rolesAsignados: SubMenuRol[];
}

interface Menu {
    iD_Menu: number;
    opcion: string;
    posicion: number;
    habilitado: number;
    estado: number;
    icono: string;
    rolesAsignados: MenuRol[];
    submenus: SubMenu[];
}

export default function Administracion() {

    const { toast, mostrarExito, mostrarError, cerrarToast } = useToast();

    const [menus, setMenus] = useState<Menu[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

    //constantes para modal menu
    const [modalMenu, setModalMenu] = useState(false);
    const [formDataMenu, setFormDataMenu] = useState<menuData>({
        opcion: '',
        posicion: 1,
    })
    const [esValidoOpcion, setEsValidoOpcion] = useState(true);
    const [esValidoPosicion, setEsValidoPosicion] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const res = await fetch('/api/menu/adminMenuRol');
            const data = await res.json();
            setMenus(data.menus);
            setRoles(data.roles);
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
    }

    const gestionRoles = async (menu: Menu, rol: Rol) => {
        const rolAsignado = menu.rolesAsignados.find(r => r.rol_ID === rol.iD_Rol);

        if (rolAsignado) {
            const res = await fetch('/api/menu/asignarMenuRol',
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ iD_Menu_Rol: rolAsignado.iD_Menu_Rol })
                }
            );
            if (res.ok) {
                mostrarExito(`Rol ${rol.rol} eliminado de ${menu.opcion}`);
            } else {
                mostrarError(`Error al Eliminar Rol ${rol.rol} de ${menu.opcion}`);
            }
        } else {
            const res = await fetch('api/menu/asignarMenuRol',
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        menu_ID: menu.iD_Menu,
                        rol_ID: rol.iD_Rol,
                        usuario: 'ADMIN',
                    })
                }
            );
            if (res.ok) {
                mostrarExito(`Rol ${rol.rol} Asignado a ${menu.opcion}`);
            } else {
                mostrarError(`Error al Asignar Rol ${rol.rol} a ${menu.opcion}`);
            }
        }
        cargarDatos();
    }

    const gestionRolesSUB = async (submenu: SubMenu, rol: Rol) => {
        const rolAsignado = submenu.rolesAsignados.find(r => r.rol_ID === rol.iD_Rol);

        if (rolAsignado) {
            const res = await fetch('/api/menu/asignarSubMenuRol',
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ iD_Menu_Rol: rolAsignado.iD_Menu_Rol })
                }
            );
            if (res.ok) {
                mostrarExito(`Rol ${rol.rol} eliminado de ${submenu.opcion}`);
            } else {
                mostrarError(`Error al Eliminar Rol ${rol.rol} de ${submenu.opcion}`);
            }
        } else {
            const res = await fetch('api/menu/asignarSubMenuRol',
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        subMenu_ID: submenu.iD_SubMenu,
                        rol_ID: rol.iD_Rol,
                        usuario: 'ADMIN',
                    })
                }
            );
            if (res.ok) {
                mostrarExito(`Rol ${rol.rol} Asignado a ${submenu.opcion}`);
            } else {
                mostrarError(`Error al Asignar Rol ${rol.rol} a ${submenu.opcion}`);
            }
        }
        cargarDatos();
    }

    const gestionSubmenu = (idMenu: number) => {
        setMenuAbierto(e => e === idMenu ? null : idMenu);
    }

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

        setModalMenu(false);
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

            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Administración de Menú</h2>
                    <div className={styles.headerBtn}>
                        <button onClick={() => setModalMenu(true)} className={styles.Btncrear}>+ Menu</button>
                        {/* <button className={styles.Btncrear}>+ Submenu</button> */}
                    </div>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Menú</th>
                            <th>Posición</th>
                            {roles.map(rol => (
                                <th key={rol.iD_Rol}>{rol.rol}</th>
                            ))}
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

                                    {roles.map(rol => (
                                        <td key={rol.iD_Rol} style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={menu.rolesAsignados.some(r => r.rol_ID === rol.iD_Rol) || false}
                                                onChange={() => gestionRoles(menu, rol)}
                                            />
                                        </td>
                                    ))}

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
                                                {roles.map(rol => (
                                                    <td key={rol.iD_Rol} style={{ textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={sub.rolesAsignados.some(r => r.rol_ID === rol.iD_Rol) || false}
                                                            onChange={() => gestionRolesSUB(sub, rol)}
                                                        />
                                                    </td>
                                                ))}
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
                {/*
                    {mensaje && (
                    <p>{mensaje}</p>
                )}
                */}
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
                                    <span className={`${styles.spanError} ${!esValidoOpcion ? styles.err : ""}`}>La Opción no es válido</span>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Posición:</label>
                                    <input
                                        type="number"
                                        name="posicion"
                                        className={!esValidoPosicion ? styles.inputError : styles.input}
                                        value={formDataMenu.posicion}
                                        onChange={handlerOnChangeMenu}
                                    />
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
            </div>
        </div>
    )
}