"use client"

import { InformacionEstudiante } from "@/app/components/informacionEstudiante/InformacionEstudiante";
import { useState } from "react"
import styles from "../../styles/tablas.module.css"
import Paginacion from "@/app/components/paginacion/Paginacion";
import Tabla from "@/app/components/Tabla/Tabla";

export default function Clases() {

    const [data, setData] = useState([
        { id: 1, clase: 'Ecología', seccion: '123', codigo: 'CS69', acumulativo: 50, examenes: 35, faltas: 2 },
        { id: 2, clase: 'Sociología', seccion: '124', codigo: 'RE66', acumulativo: 45, examenes: 45, faltas: 4 }
    ]);

    const notaFinal = (a: number, b: number) => {
        return (a + b);
    }   

    return (
        <div className={styles.pageContent}>
            <InformacionEstudiante />
            <div className={styles.pageCard}>
                <h3>Información academica, Año {new Date().getFullYear()}, Periodo 1</h3>
                <Tabla
                    datos={data}
                    keyExtractor={item => item.id}
                    columnas={[
                        {header:'ID', accessor: 'id'},
                        {header:'Nombre Materia', accessor: 'clase'},
                        {header:'Sección', accessor: 'seccion'},
                        {header:'Código', accessor: 'codigo'},
                        {header:'Acumulativo', accessor: 'acumulativo'},
                        {header:'Examenes', accessor: 'examenes'},
                        {header:'Nota', render: item => item.acumulativo + item.examenes},
                        {header:'Faltas', accessor: 'faltas'},
                    ]}
                />
            </div>      
            
        </div>
        
    )
}