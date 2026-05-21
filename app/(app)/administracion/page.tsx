"use client"

import { useEffect, useState } from "react";
import styles from './page.module.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import React from "react";


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

    const [menus, setMenus] = useState<Menu[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

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

        await fetch('/api/menu/actualizarMenu', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...menu,
                habilitado: nuevoHabilitado
            })
        });

        mostrarMensaje(`${menu.opcion} ${nuevoHabilitado === 1 ? 'habilitado' : 'deshabilitado'}`);
        cargarDatos();
    }

    const HabilitarSUB = async (submenu: SubMenu) => {
        const nuevoHabilitado = submenu.habilitado === 1 ? 0 : 1;

        await fetch('/api/menu/actualizarSubMenu', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...submenu,
                habilitado: nuevoHabilitado
            })
        });

        mostrarMensaje(`${submenu.opcion} ${nuevoHabilitado === 1 ? 'habilitado' : 'deshabilitado'}`);
        cargarDatos();
    }

    const cambiarPosicion = async (menu: Menu, nuevaPosicion: number) => {
        await fetch('/api/menu/actualizarMenu',
            {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...menu,
                    posicion: nuevaPosicion
                })
            }
        );
        mostrarMensaje(`Posición de ${menu.opcion} actualizada`);
        cargarDatos();
    }

    const cambiarPosicionSUB = async (submenu: SubMenu, nuevaPosicion: number) => {
        await fetch('/api/menu/actualizarSubMenu',
            {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...submenu,
                    posicion: nuevaPosicion
                })
            }
        );
        mostrarMensaje(`Posición de ${submenu.opcion} actualizada`);
        cargarDatos();
    }

    const gestionRoles = async (menu: Menu, rol: Rol) => {
        const rolAsignado = menu.rolesAsignados.find(r => r.rol_ID === rol.iD_Rol);

        if (rolAsignado) {
            await fetch('/api/menu/asignarMenuRol',
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ iD_Menu_Rol: rolAsignado.iD_Menu_Rol })
                }
            );
            mostrarMensaje(`Rol ${rol.rol} quitado de ${menu.opcion}`);
        } else {
            await fetch('api/menu/asignarMenuRol',
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
            mostrarMensaje(`Rol ${rol.rol} asignado a ${menu.opcion}`);
        }
        cargarDatos();
    }

    const gestionRolesSUB = async (submenu: SubMenu, rol: Rol) => {
        const rolAsignado = submenu.rolesAsignados.find(r => r.rol_ID === rol.iD_Rol);

        if (rolAsignado) {
            await fetch('/api/menu/asignarSubMenuRol',
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ iD_Menu_Rol: rolAsignado.iD_Menu_Rol })
                }
            );
            mostrarMensaje(`Rol ${rol.rol} quitado de ${submenu.opcion}`);
        } else {
            await fetch('api/menu/asignarMenuRol',
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
            mostrarMensaje(`Rol ${rol.rol} asignado a ${submenu.opcion}`);
        }
        cargarDatos();
    }

    const mostrarMensaje = (msg: string) => {
        setMensaje(msg);
        setTimeout(() => setMensaje(''), 3000);
    }

    const gestionSubmenu = (idMenu: number) => {
        setMenuAbierto(e => e === idMenu ? null : idMenu);
    }

    return (
        <div className={styles.cards}>

            <div className={styles.card}>
                <h2>Administración de Menú</h2>
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
                                            className={menu.habilitado === 1 ? styles.btnHabilitar : styles.btnDeshabilitar}
                                        >
                                            {menu.habilitado === 1 ? 'Deshabilitar' : 'Habilitar'}
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
                                                        className={sub.habilitado === 1 ? styles.btnHabilitar : styles.btnDeshabilitar}
                                                    >
                                                        {sub.habilitado === 1 ? 'Deshabilitar' : 'Habilitar'}
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
            </div>
        </div>
    )
}