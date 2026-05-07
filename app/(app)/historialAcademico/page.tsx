"use client"

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useState } from "react";
import styles from './page.module.css'
import { useAuth } from "@/app/hooks/useAuth";

export default function HistorialAcademico() {
    //useAuth();

    const [data, setData] = useState([
        { id: 1, clase: 'Quimica', seccion: '123', codigo: 'CC05', anio: '2025', periodo: 3, nota: 90.98, estado: 'APB', uv: 4 },
        { id: 2, clase: 'Biologia', seccion: '124', codigo: 'CC06', anio: '2026', periodo: 1, nota: 76.98, estado: 'APB', uv: 4 }
    ])
    return (
        <div className={styles.cardshistorial}>
            <InformacionEstudiante />
            <div className={styles.cardhistorial}>
                <h2>Historial Academico</h2>
                <table className={styles.tablehistorial}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Año</th>
                            <th>Periodo</th>
                            <th>Nombre Materia</th>
                            <th>Sección</th>
                            <th>Código</th>
                            <th>Nota Final</th>
                            <th>Estado</th>
                            <th>UV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.anio}</td>
                                    <td>{item.periodo}</td>
                                    <td>{item.clase}</td>
                                    <td>{item.seccion}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.nota}</td>
                                    <td>{item.estado}</td>
                                    <td>{item.uv}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
                <div className={styles.btnpages}>
                    <button>
                        Anterior
                    </button>
                    <span>Página 1</span>
                    <button>
                        Siguiente
                    </button>
                </div>
            </div>
            <div className={styles.cardhistorial}>
                <p><strong>Unidades Valorativas Aprobadas:</strong> 140</p>
                <p><strong>Índice Académico:</strong> 90</p>
            </div>
        </div>
    )
}