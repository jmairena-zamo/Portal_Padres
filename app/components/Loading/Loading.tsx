//Componente creado por Dieg Castro
//Componente de Loading

import styles from './Loading.module.css';

interface LoadingProps {
    texto?: string;
}

export default function Loading({ texto = 'Cargando...' }: LoadingProps) {
    return (
        <div className={styles.overlay}>
            <div className={styles.spinner} />
            <p className={styles.texto}>{texto}</p>
        </div>
    );
}