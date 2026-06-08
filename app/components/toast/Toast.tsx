//Componente creado por Diego Castro
//

"use client"

import { useEffect } from 'react';
import styles from './Toast.module.css';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

interface ToastProps {
    mensaje: string; //texto que muestra la notificación
    tipo: 'exito' | 'error';  //Controla el color e icono, verde exito y rojo error
    onClose: () => void;  //Cierra el toast
}

//Notificacón temporal que se cierra automaticamente en 2 segundos
export default function Toast({ mensaje, tipo, onClose }: ToastProps) {

    //Cierra la notificación luego de 2 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000); 

        return () => clearTimeout(timer);
    }, [mensaje]);

    return (
        <div className={`${styles.toast} ${tipo === 'exito' ? styles.exito : styles.error}`}>
            <div className={styles.icon}>
                {tipo === 'exito'
                    ? <FaCheckCircle size={20} />
                    : <FaTimesCircle size={20} />
                }
            </div>
            <p className={styles.mensaje}>{mensaje}</p>

            {/* boton para cerrar manualmente */}
            <button onClick={onClose} className={styles.cerrar}>
                <FaTimes size={14} />
            </button>
        </div>
    )
}