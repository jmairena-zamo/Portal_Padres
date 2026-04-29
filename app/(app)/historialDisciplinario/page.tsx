"use client"

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useState } from "react"
import styles from "./page.module.css"

export default function HistorialDisciplinario() {

    const [data, setData] = useState([
        { id: 1, faltas: 1, clase: 'Quimica', estado: 'Leve' },
        { id: 2, faltas: 2, clase: 'Biologia', estado: 'Grave' }
    ]);

    const fecha = new Date();

    return (
        <div className={styles.contentdisc}>
            <InformacionEstudiante />
            <div className={styles.cardsdisc}>
                <h2>Historial Disciplinario</h2>
                <table className={styles.tabledisc}>
                    <thead>
                        <tr>
                            <th># Falta</th>
                            <th>Clase</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
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