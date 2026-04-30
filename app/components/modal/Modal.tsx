import styles from './Modal.module.css';
import user from '../../img/logo-user.png'
import logozamorano from '../../img/Logo-Universidad-Zamorano.png'
import Image from 'next/image';

interface ModalProps {
    OnClose: () => void;
}

export default function Modal({ OnClose }: ModalProps) {

    const estudiantes = [
        { nombre: "Diego Sebastias", apellido: "Castro Lagos" },
        { nombre: "Diego Sebastian Carlos Estrada", apellido: "apellido1 apellido2" },
        { nombre: "Diego Sebastian Carlos Estrada", apellido: "apellido1 apellido2" },
        { nombre: "Diego Sebastian Carlos Estrada", apellido: "apellido1 apellido2" },
        { nombre: "Diego Sebastian Carlos Estrada", apellido: "apellido1 apellido2" },
    ];

    return (
        <div className={styles.modal}>
            <div className={styles.modalLogo}>
                <Image src={logozamorano} alt="Logo Zamorano" width={400} height={75}/>
            </div>
            <div className={styles.modalcontent}>
                <h2>Seleccionar Estudiante</h2>
                <div className={styles.cardscontainer}>
                    {
                        estudiantes.map((u, index) => (
                            <div className={styles.cardmodal} key={index} >
                                <div className={styles.cardimg}>
                                    <Image src={user} alt="Imagen Estudiante" width={55} height={55}/>
                                </div>
                                <div className={styles.info}>
                                    <p><strong>Estudiante: </strong></p>
                                    <p>{u.nombre}</p>
                                    <p>{u.apellido}</p>
                                </div>
                                <button onClick={OnClose} className={styles.verBTN}>ver</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}