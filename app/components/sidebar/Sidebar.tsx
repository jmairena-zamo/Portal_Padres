"use client"

import Link from 'next/link';
import styles from './Sidebar.module.css'
import Image from 'next/image';
import imagen from '../../img/Zamorano1.jpg'
import { usePathname } from 'next/navigation';
import { FaSignOutAlt, FaFile, FaFileAlt, FaHome, FaCoins, FaBook, FaRibbon, FaClipboardCheck } from "react-icons/fa";


export const Sidebar = () => {

    const pathname = usePathname();

    const linkClass = (path: any) =>
        pathname === path ? styles.active : styles.link;

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

                    <Link href="/resumenEstudiante" className={linkClass("/resumenEstudiante")}><FaHome size={20} />Home</Link >
                    <Link href="/estadoCuenta" className={linkClass("/estadoCuenta")}><FaCoins size={20} />Estado de Cuenta</Link>
                    <Link href="/historialAcademico" className={linkClass("/historialAcademico")}><FaFileAlt size={20} />Historial Academico</Link >
                    <Link href="/clases" className={linkClass("/clases")}><FaBook size={20} />Clases</Link >
                    <Link href="/historialDisciplinario" className={linkClass("/historialDisciplinario")}><FaRibbon size={20} />Historial Disciplinario</Link >
                    <Link href="/documentos" className={linkClass("/documentos")}><FaFile size={20} />Documentos</Link >
                    <Link href="/quejasSugerencias" className={linkClass("/quejasSugerencias")}><FaClipboardCheck size={20} />Quejas o Sugerencias</Link >
                </nav>

            </div>

            <div className={styles.logout}>
                <a>Cerrar Sesion <FaSignOutAlt size={25} /></a>
            </div>
        </div>
    )
}