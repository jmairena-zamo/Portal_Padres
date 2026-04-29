import styles from './Navbar.module.css'
import zamorano from '../../img/Logo-Universidad-Zamorano.png'
import user from '../../img/logo-user.png'
import { IconContext } from "react-icons";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import Image from 'next/image';

export const Navbar = () => {

    const prueba = () => {
        alert("hola");
    }

    return (
        <header className={styles.header}>
            <div className={styles.navbar}>
                <div>
                    <Image src={zamorano} alt="Logo Zamorano"
                        width={200}
                        height={200} />
                </div>
                <nav className={styles.navbarright}>
                    <span>NombreAlumno</span>
                    <Image src={user} alt="Logo Zamorano" />
                </nav>
            </div>
        </header>
    )
}