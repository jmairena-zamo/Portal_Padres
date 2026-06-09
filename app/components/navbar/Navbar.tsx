'use client'

import styles from './Navbar.module.css'
import zamorano from '../../img/Logo-Universidad-Zamorano.png'
import user from '../../img/logo-user.png'
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

// Simulación — reemplaza con tus datos reales
const hijos = [
    { id: 1, nombre: 'Carlos Martínez' },
    { id: 2, nombre: 'Sofía Martínez' },
    { id: 3, nombre: 'Luis Martínez' },
];

interface Props {
    colapsado: boolean;
}

export const Navbar = ({ colapsado }: Props) => {
    const tieneVariosHijos = hijos.length > 1;
    const [dropdownAbierto, setDropdownAbierto] = useState(false);
    const [hijoActivo, setHijoActivo] = useState(hijos[0]);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setDropdownAbierto(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const seleccionarHijo = (hijo: typeof hijos[0]) => {
        setHijoActivo(hijo);
        setDropdownAbierto(false);
    };

    return (
        <header className={`${styles.header} ${colapsado ? styles.headerColapsado : ''}`}>
            <div className={styles.navbar}>
                <div>
                    <Image src={zamorano} alt="Logo Zamorano"
                        width={200} />
                </div>
                <nav className={styles.navbarright}>
                    <div className={styles.estudianteWrapper} ref={ref}>
                        {tieneVariosHijos && (
                            <button
                                className={styles.menuBtn}
                                onClick={() => setDropdownAbierto(prev => !prev)}
                            >
                                <FaChevronDown
                                    size={12}
                                    className={`${styles.chevron} ${dropdownAbierto ? styles.chevronAbierto : ''}`}
                                />
                                <span className={styles.nombreEstudiante}>{hijoActivo.nombre}</span>
                            </button>
                        )}
                        <Image
                            src={user}
                            alt="Logo usuario"
                            className={`${styles.userImg} ${tieneVariosHijos ? styles.userImgClickable : ''}`}
                            onClick={() => tieneVariosHijos && setDropdownAbierto(prev => !prev)}
                        />
                        {tieneVariosHijos && dropdownAbierto && (
                            <ul className={styles.dropdown}>
                                {hijos.map(hijo => (
                                    <li
                                        key={hijo.id}
                                        className={`${styles.dropdownItem} ${hijo.id === hijoActivo.id ? styles.dropdownItemActivo : ''}`}
                                        onClick={() => seleccionarHijo(hijo)}
                                    >
                                        {hijo.nombre}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}