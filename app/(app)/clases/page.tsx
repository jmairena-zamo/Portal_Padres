"use client"

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useState } from "react"
import styles from "./page.module.css"

export default function Clases() {
    //useAuth();

    const [data, setData] = useState([
        { id: 1, clase: 'Ecología', seccion: '123', codigo: 'CS69', acumulativo: 50, examenes: 35, faltas: 2 },
        { id: 2, clase: 'Sociología', seccion: '124', codigo: 'RE66', acumulativo: 45, examenes: 45, faltas: 4 }
    ]);

    const notaFinal = (a: number, b: number) => {
        return (a + b);
    }

    return (
        <div className={styles.cardsclases}>
            <InformacionEstudiante />
            <div className={styles.cardclases}>
                <h3>Información academica, Año {new Date().getFullYear()}, Periodo 1</h3>
                <table className={styles.tableclases}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Materia</th>
                            <th>Sección</th>
                            <th>Código</th>
                            <th>Acumulativo</th>
                            <th>Examenes</th>
                            <th>Nota</th>
                            <th>Faltas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.clase}</td>
                                    <td>{item.seccion}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.acumulativo}</td>
                                    <td>{item.examenes}</td>
                                    <td>{notaFinal(item.acumulativo, item.examenes)}</td>
                                    <td>{item.faltas}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}