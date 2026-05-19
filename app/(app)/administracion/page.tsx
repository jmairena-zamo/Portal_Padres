"use client"

import { useEffect, useState } from "react";
import styles from './page.module.css';

interface Rol {
    iD_Rol: number;
    rol: string;
}

interface MenuRol {
    iD_Menu_Rol: number;
    menu_ID: number;
    rol_ID: number;
}

interface Menu {
    iD_Menu: number;
    opcion: string;
    posicion: number;
    habilitado: number;
    estado: number;
    icono: string;
    rolesAsignados: MenuRol[];
}

export default function Administracion() {

    const [menus, setMenus] = useState<Menu[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

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

    const mostrarMensaje = (msg: string) => {
        setMensaje(msg);
        setTimeout(() => setMensaje(''), 3000);
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
                            <tr key={menu.iD_Menu}>

                                <td>{menu.opcion}</td>

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
                                            checked={menu.rolesAsignados.some(r => r.rol_ID === rol.iD_Rol)}
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