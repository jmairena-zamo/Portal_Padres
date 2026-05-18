"use client"

import Link from 'next/link';
import styles from './Sidebar.module.css'
import Image from 'next/image';
import imagen from '../../img/Zamorano1.jpg'
import { usePathname, useRouter } from 'next/navigation';
import { FaSignOutAlt, FaFile, FaFileAlt, FaHome, FaCoins, FaBook, FaFolder, FaClipboardCheck } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { getPath, getIcono } from '@/app/utils/menu';

interface Menu {
    iD_Menu: number;
    opcion: string;
    posicion: number;
}

export const Sidebar = () => {

    const pathname = usePathname();
    const route = useRouter();
    const [menus, setMenus] = useState<Menu[]>([]);

    useEffect(() => {
        fetch('api/menu/obtenerMenu').then(res => res.json())
        .then(data => {
            if (data.menus) setMenus(data.menus);
        })
        .catch(err => console.log('Error al cargar menús:', err));
    }, [])

    const linkClass = (path: any) =>
        pathname === path ? styles.active : styles.link;

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
        <div className={styles.sidebar}>
            {/*
            <div>
                <Image src={imagen} alt="Logo Zamorano"
                    width={200}
                    height={200} />
            </div>
            */}
            <div>
                <div className={styles.tag}>
                    <div className={styles.contenttag}>
                        <Image src={imagen} alt="Logo Zamorano" />
                        <h4><strong>NombreUsuario</strong></h4>
                        <p>NombreAlumno</p>
                    </div>
                </div>

                <nav className={styles.nav}>

                    {/*<Link href="/resumenEstudiante" className={linkClass("/resumenEstudiante")}><FaHome size={20} />Home</Link >
                    <Link href="/estadoCuenta" className={linkClass("/estadoCuenta")}><FaCoins size={20} />Estado de Cuenta</Link>
                    <Link href="/historialAcademico" className={linkClass("/historialAcademico")}><FaFileAlt size={20} />Historial Academico</Link >
                    <Link href="/clases" className={linkClass("/clases")}><FaBook size={20} />Clases</Link >
                    <Link href="/historialDisciplinario" className={linkClass("/historialDisciplinario")}><FaFolder size={20} />Historial Disciplinario</Link >
                    <Link href="/documentos" className={linkClass("/documentos")}><FaFile size={20} />Documentos</Link >
                    <Link href="/quejasSugerencias" className={linkClass("/quejasSugerencias")}><FaClipboardCheck size={20} />Quejas o Sugerencias</Link >*/}
                    {
                        menus.map((menu)=> {
                            const path = getPath(menu.opcion)
                            return (
                            <Link
                                key={menu.iD_Menu}
                                href={path}
                                className={linkClass(path)}
                            >
                                {getIcono(menu.opcion)}
                                {menu.opcion}
                            </Link>
                        );
                        })
                    }
                </nav>

            </div>

            <div className={styles.logout}>
                <button className={styles.logoutBTN} onClick={handleLogout}>Cerrar Sesion <FaSignOutAlt size={25} /></button>
            </div>
        </div>
    )
}