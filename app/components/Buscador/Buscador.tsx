//Componente de buscador creado por Diego Castro
//Este es un componente generico para buscar 

'use client'

import { useState, useEffect } from "react"
import styles from "./Buscador.module.css"
import { FaSearch } from "react-icons/fa"

interface BuscadorProps<T> {
    datos: T[];
    campos: (keyof T)[];
    placeholder?: string;
    //Se ejecuta cada que cambia el resultado del filtro
    //Recibe el arreglo filtrado, o completo si query esta vacio
    onResultado: (resultados: T[]) => void; 
}

//Este componente recibe los datos en donde se buscara y que campo especifico(columna) es el que se buscara
//El resultado se envia al padre mediante onResultado()
export default function Buscador<T>({datos, campos, placeholder = "Buscar...", onResultado}: BuscadorProps<T>){
    const [query, setQuery] = useState("");
    
    //Se ejecuta cada vez que query o datos cambian
    useEffect(()=> {
        //Si query esta vacio devulve todos los datos
        if(!query.trim()){
            onResultado(datos);
            return;
        }

        const q = query.toUpperCase();

        //Obtiene los datos que tengan coincidencia con query(q)
        const filtrados = datos.filter(item => 
            campos.some(campo => {
                const valor = item[campo]
                return String(valor ?? '' ).toUpperCase().includes(q);
            })
        );

        onResultado(filtrados);

    }, [query, datos])

    return (
        <div className={styles.wrapper}>
            <span className={styles.icon}><FaSearch /></span>
            <input
                type="text"
                className={styles.input}
                placeholder={placeholder}
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            
            {/* boton para limpiar, solo se muestra cuando query no es vacio */}
            {query && (
                <button className={styles.clear} onClick={() => setQuery("")}>X</button>
            )}
        </div>
    );
}