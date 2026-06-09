//Creado por Diego Castro
//Pagina donde se mostrara el historial acdemico del estudiante

"use client"

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useState } from "react"
import styles from "../../styles/tablas.module.css"


export default function HistorialDisciplinario() {
    //useAuth();

    //Datos de prueba para mostrar en la tabla
    const [data, setData] = useState([
        { id: 1, faltas: 1, clase: 'Quimica', estado: 'Leve' },
        { id: 2, faltas: 2, clase: 'Biologia', estado: 'Grave' }
    ]);

    const fecha = new Date();

    return (
        <div className={styles.pageContent}>
            <InformacionEstudiante />
            <div className={styles.pageCard}>
                <h2>Historial Disciplinario</h2>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th># Falta</th>
                            <th>Clase</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.clase}</td>
                                    <td>27/04/2026</td>
                                    <td>{item.estado}</td>
                                    <td><button>Ver Más</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
        </div>
    )
}