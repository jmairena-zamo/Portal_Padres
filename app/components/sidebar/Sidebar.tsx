"use client"

import Link from 'next/link';
import styles from './Sidebar.module.css'
import Image from 'next/image';
import imagen from '../../img/Zamorano1.jpg'
import { usePathname, useRouter } from 'next/navigation';
import { FaChevronDown, FaChevronRight, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { iconos, generarRuta, getSubPath } from '@/app/utils/menu';
import { useMenu } from '@/app/hooks/useMenu';

interface Props {
    colapsado: boolean;
    onToggle: () => void;
}

export const Sidebar = ({ colapsado, onToggle }: Props) => {

    const pathname = usePathname();
    const route = useRouter();
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
    const { menus } = useMenu();
    const [sidebarAbierto, setSidebarAbierto] = useState(false);
    const [email, setEmail] = useState<string>('');

    // Lee el email del usuario desde la cookie httpOnly vía la ruta /api/auth/session
    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => { if (data?.email) setEmail(data.email); })
            .catch(() => { });
    }, []);

    // Cierra el sidebar en móvil (usado al navegar o al hacer clic en el overlay)
    const cerrarSidebar = () => setSidebarAbierto(false);

    // Aplica la clase activa si la ruta actual coincide con el path del link
    const linkClass = (path: any) =>
        pathname === path ? styles.active : styles.link;

    // Alterna el submenú abierto; si se presiona el mismo, lo cierra
    const gestionSubmenu = (idMenu: number) => {
        setMenuAbierto(e => e === idMenu ? null : idMenu);
    }

    // Llama al endpoint de logout y redirige al login al tener éxito
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
            {/* Botón hamburguesa — visible solo en <800px */}
            <button
                className={`${styles.hamburger} ${sidebarAbierto ? styles.open : ''}`}
                onClick={() => setSidebarAbierto(v => !v)}
                aria-label="Abrir menú"
            >
                <span /><span /><span />
            </button>

            {/* Overlay oscuro detrás del sidebar en móvil; cierra al hacer clic */}
            <div
                className={`${styles.overlay} ${sidebarAbierto ? styles.visible : ''}`}
                onClick={cerrarSidebar}
            />
            <div className={`${styles.sidebar} ${sidebarAbierto ? styles.open : ''} ${colapsado ? styles.colapsado : ''}`} >
                {/* Botón para colapsar/expandir el sidebar en desktop */}
                <div className={`${styles.contentToggle} ${colapsado ? styles.contentToggleColapsado : ''}`}>
                    <button className={styles.toggleBtn} onClick={onToggle} aria-label="Colapsar menú">
                        <FaBars size={25} />
                    </button>
                </div>

                <div className={styles.sidebarInner}>

                    {/* Foto y email del usuario; se ocultan cuando el sidebar está colapsado */}
                    <div className={styles.tag}>
                        <div className={styles.contenttag}>
                            <Image src={imagen} alt="Logo Zamorano" />
                            {
                                !colapsado && (
                                    <>                                        
                                        <p>{email}</p>
                                        <p>Nombre Usuario</p>
                                    </>
                                )
                            }

                        </div>

                    </div>

                    <nav className={styles.nav}>
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
                                                {/* Menú con submenús: botón que expande/colapsa la lista hija */}
                                                <button
                                                    className={`${styles.link} ${styles.menuBtn}`}
                                                    onClick={() => gestionSubmenu(menu.iD_Menu)}
                                                    title={colapsado ? menu.opcion : ''}
                                                >
                                                    {Icono && <Icono size={20} />}
                                                    {!colapsado && menu.opcion}
                                                    {!colapsado && (estaAbierto ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
                                                </button>

                                                {/* Submenús — solo visibles cuando el menú padre está abierto y no colapsado */}
                                                {estaAbierto && !colapsado && (
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
                                            // Menú sin hijo, link directo a la ruta
                                            <Link href={path} onClick={cerrarSidebar} className={linkClass(path)} title={colapsado ? menu.opcion : ''}>
                                                {Icono && <Icono size={20} />}
                                                {!colapsado && menu.opcion}
                                            </Link>
                                        )}
                                    </div>

                                );
                            })
                        }
                    </nav>

                </div>

                {/* Botón de cierre de sesión,  muestra solo el icono cuando está colapsado */}
                <div className={styles.logout}>
                    <button className={styles.logoutBTN} onClick={handleLogout} title={colapsado ? 'Cerrar Sesión' : ''}>
                        {!colapsado && 'Cerrar Sesion'} <FaSignOutAlt size={25} /></button>
                </div>
            </div>
        </>

    )
}