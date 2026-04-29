"use client"

import styles from './InformacionEstudiante.module.css'
import Image from 'next/image'
import user from '../../img/logo-user.png'

export const InformacionEstudiante = () => {
    return (
        <div className={styles.contentstudent}>
            <div className={styles.cardstudent}>
                <h3>INFORMACIÓN ESTUDIANTE</h3>
                <br />
                <p><strong>Estudiante:</strong> xxxxx xxxxx xxxxx xxxxx</p>
                <p><strong>Codigo Estudiante:</strong> xxxxxx</p>
                <p><strong>Correo:</strong> xxxxxxxxxxxxxxxxxx</p>
            </div>
            <div className={styles.cardstudent}>
                <h3>INFORMACIÓN ESTUDIANTE</h3>
                <br />
                <p><strong>Estudiante:</strong> xxxxx xxxxx xxxxx xxxxx</p>
                <p><strong>Codigo Estudiante:</strong> xxxxxx</p>
                <p><strong>Correo:</strong> xxxxxxxxxxxxxxxxxx</p>
            </div>
            <div className={styles.cardimgstudent}>
                <Image src={user} alt="Logo Zamorano"
                    width={200}
                    height={200} />
            </div>
        </div>
    )
}