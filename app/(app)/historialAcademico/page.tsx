"use client"

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useState } from "react";
import index from './page.module.css'
import styles from "../../styles/tablas.module.css"
import Paginacion from "@/app/components/ui/Paginacion";

export default function HistorialAcademico() {
    //useAuth();

    const [paginaActual, setPaginaActual] = useState(1);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);



    const [data, setData] = useState([
        { id: 1, clase: 'Quimica', seccion: '123', codigo: 'CC05', anio: '2025', periodo: 3, nota: 90.98, estado: 'APB', uv: 4 },
        { id: 2, clase: 'Biologia', seccion: '124', codigo: 'CC06', anio: '2026', periodo: 1, nota: 76.98, estado: 'APB', uv: 4 },
        { id: 3, clase: 'Biologia', seccion: '124', codigo: 'CC06', anio: '2026', periodo: 1, nota: 76.98, estado: 'APB', uv: 4 },
        { id: 4, clase: 'Biologia', seccion: '124', codigo: 'CC06', anio: '2026', periodo: 1, nota: 76.98, estado: 'APB', uv: 4 },
        { id: 5, clase: 'Biologia', seccion: '124', codigo: 'CC06', anio: '2026', periodo: 1, nota: 76.98, estado: 'APB', uv: 4 },
        { id: 6, clase: 'Biologia', seccion: '124', codigo: 'CC06', anio: '2026', periodo: 1, nota: 76.98, estado: 'APB', uv: 4 },
        { id: 7, clase: 'Biologia', seccion: '124', codigo: 'CC06', anio: '2026', periodo: 1, nota: 76.98, estado: 'APB', uv: 4 },
    ])

    const handleCambiarRegistros = (cantidad: number) => {
        setRegistrosPorPagina(cantidad);
        setPaginaActual(1);
    };

    const indexInicio = (paginaActual - 1) * registrosPorPagina;
    const indexFin = indexInicio + registrosPorPagina;
    const datosPaginados = data.slice(indexInicio, indexFin);
    return (
        <div className={styles.pageContent}>
            <InformacionEstudiante />
            <div className={styles.pageCard}>
                <h2>Historial Academico</h2>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
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
                    <tbody className={styles.tableBody}>
                        {
                            datosPaginados.map((item) => (
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

                <Paginacion
                    totalRegistros={data.length}
                    registrosPorPagina={registrosPorPagina}
                    paginaActual={paginaActual}
                    onCambiarPagina={setPaginaActual}
                    onCambiarRegistrosPorPagina={handleCambiarRegistros}
                />

            </div>
            <div className={index.cardhistorial}>
                <p><strong>Unidades Valorativas Aprobadas:</strong> 140</p>
                <p><strong>Índice Académico:</strong> 90</p>
            </div>
        </div>
    )
}