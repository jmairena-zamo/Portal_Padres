'use client'

import { useState, useEffect } from "react"
import styles from "./Buscador.module.css"
import { FaSearch } from "react-icons/fa"

interface BuscadorProps<T> {
    datos: T[];
    campos: (keyof T)[];
    placeholder?: string;
    onResultado: (resultados: T[]) => void;
}

export default function Buscador<T>({datos, campos, placeholder = "Buscar...", onResultado}: BuscadorProps<T>){
    const [query, setQuery] = useState("");
    
    useEffect(()=> {
        if(!query.trim()){
            onResultado(datos);
            return;
        }

        const q = query.toUpperCase();
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
            {query && (
                <button className={styles.clear} onClick={() => setQuery("")}>X</button>
            )}
        </div>
    );
}