"use client"

import Link from 'next/link';
import styles from './Sidebar.module.css'
import Image from 'next/image';
import imagen from '../../img/Zamorano1.jpg'
import { usePathname, useRouter } from 'next/navigation';
import { FaChevronDown, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import { useState } from 'react';
import { iconos, generarRuta, getSubPath } from '@/app/utils/menu';
import { useMenu } from '@/app/hooks/useMenu';

export const Sidebar = () => {

    const pathname = usePathname();
    const route = useRouter();
    // const [menus, setMenus] = useState<Menu[]>([]);
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
    const { menus } = useMenu();
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    const cerrarSidebar = () => setSidebarAbierto(false);

    // useEffect(() => {
    //     fetch('api/menu/obtenerMenu').then(res => res.json())
    //     .then(data => {
    //         if (data.menus) setMenus(data.menus);
    //     })
    //     .catch(err => console.log('Error al cargar menús:', err));
    // }, [])

    const linkClass = (path: any) =>
        pathname === path ? styles.active : styles.link;

    const gestionSubmenu = (idMenu: number) => {
        setMenuAbierto(e => e === idMenu ? null : idMenu);
    }

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (res.ok) {
                route.replace('/');
                route.refresh();
            }

        } catch (error) {
            console.log("Error al cerrar sesión:", error);
        }
    }

    return (
        <>
            <button
                className={`${styles.hamburger} ${sidebarAbierto ? styles.open : ''}`}
                onClick={() => setSidebarAbierto(v => !v)}
                aria-label="Abrir menú"
            >
                <span /><span /><span />
            </button>

            <div
                className={`${styles.overlay} ${sidebarAbierto ? styles.visible : ''}`}
                onClick={cerrarSidebar}
            />
            <div className={`${styles.sidebar} ${sidebarAbierto ? styles.open : ''}`}>
                <div>
                    <div className={styles.tag}>
                        <div className={styles.contenttag}>
                            <Image src={imagen} alt="Logo Zamorano" />
                            <h4><strong>usuario</strong></h4>
                            <p>NombreAlumno</p>
                        </div>
                    </div>

                    <nav className={styles.nav}>

                        {/* <Link href="/resumenestudiante" className={linkClass("/resumenestudiante")}><FaHome size={20} />Home</Link >
                    <Link href="/estadodecuenta" className={linkClass("/estadodecuenta")}><FaCoins size={20} />Estado de Cuenta</Link>
                    <Link href="/historialacademico" className={linkClass("/historialacademico")}><FaFileAlt size={20} />Historial Academico</Link >
                    <Link href="/clases" className={linkClass("/clases")}><FaBook size={20} />Clases</Link >
                    <Link href="/historialdisciplinario" className={linkClass("/historialdisciplinario")}><FaFolder size={20} />Historial Disciplinario</Link >
                    <Link href="/documentos" className={linkClass("/documentos")}><FaFile size={20} />Documentos</Link >
                    <Link href="/quejasosugerencias" className={linkClass("/quejasosugerencias")}><FaClipboardCheck size={20} />Quejas o Sugerencias</Link > */}

                        {
                            menus.map((menu) => {
                                const path = generarRuta(menu.opcion);
                                const tieneSubmenus = menu.submenus && menu.submenus.length > 0;
                                const estaAbierto = menuAbierto === menu.iD_Menu;
                                const Icono = iconos[menu.icono];
                                return (
                                    <div key={menu.iD_Menu}>
                                        {tieneSubmenus ? (
                                            <>
                                                <button
                                                    className={`${styles.link} ${styles.menuBtn}`}
                                                    onClick={() => gestionSubmenu(menu.iD_Menu)}
                                                >
                                                    {Icono && <Icono size={20} />}
                                                    {menu.opcion}
                                                    {estaAbierto
                                                        ? <FaChevronDown size={12} />
                                                        : <FaChevronRight size={12} />
                                                    }
                                                </button>

                                                {estaAbierto && (
                                                    <div className={styles.submenus}>
                                                        {menu.submenus
                                                            .sort((a, b) => a.posicion - b.posicion)
                                                            .map(sub => {
                                                                const subPath = getSubPath(menu.opcion, sub.opcion);
                                                                return (
                                                                    <Link
                                                                        key={sub.iD_SubMenu}
                                                                        href={subPath}
                                                                        onClick={cerrarSidebar}
                                                                        className={linkClass(subPath)}
                                                                    >
                                                                        {sub.opcion}
                                                                    </Link>
                                                                );
                                                            })}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link href={path} onClick={cerrarSidebar} className={linkClass(path)}>
                                                {Icono && <Icono size={20} />}
                                                {menu.opcion}
                                            </Link>
                                        )}
                                    </div>

                                );
                            })
                        }
                    </nav>

                </div>

                <div className={styles.logout}>
                    <button className={styles.logoutBTN} onClick={handleLogout}>Cerrar Sesion <FaSignOutAlt size={25} /></button>
                </div>
            </div>
        </>

    )
}