//Componete creado por Diego Castro
//Componente para mostrar cuando no hay datos en alguna peticion

import styles from "./Vacio.module.css"

interface DataVacia {
  titulo?: string;
  descripcion?: string;
}

export default function Vacio({titulo, descripcion}: DataVacia){
    return(
        <div className={styles.Vacio}>
            <h2>{titulo}</h2>
            <h3>{descripcion}</h3>
        </div>
    )
}