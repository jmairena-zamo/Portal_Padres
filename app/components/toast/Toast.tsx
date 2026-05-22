"use client"

import { useEffect } from 'react';
import styles from './Toast.module.css';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

interface ToastProps {
    mensaje: string;
    tipo: 'exito' | 'error';
    onClose: () => void;
}

export default function Toast({ mensaje, tipo, onClose }: ToastProps) {

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
            <button onClick={onClose} className={styles.cerrar}>
                <FaTimes size={14} />
            </button>
        </div>
    )
}