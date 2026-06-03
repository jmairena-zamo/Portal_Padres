import styles from './Navbar.module.css'
import zamorano from '../../img/Logo-Universidad-Zamorano.png'
import user from '../../img/logo-user.png'
import Image from 'next/image';

interface Props {
    colapsado: boolean;
}

export const Navbar = ({colapsado}: Props) => {

    return (
        <header className={`${styles.header} ${colapsado ? styles.headerColapsado : ''}`}>
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