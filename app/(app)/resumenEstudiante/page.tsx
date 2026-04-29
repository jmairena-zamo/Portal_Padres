"use client"
import Image from 'next/image';
import user from '../../img/logo-user.png';
import { useState } from 'react';
import { FaExclamationTriangle, FaExclamationCircle, FaExclamation, FaClock } from 'react-icons/fa';
import { RadialBarChart, RadialBar, PolarAngleAxis, Legend } from 'recharts';
import styles from './page.module.css'

export default function ResumenEstudiante() {
    const [estudiante, setEstudiante] = useState({
        Nombre: 'xxxxxx',
        Apellido: 'xxxxx',
        Codigo: '12345e',
        Carrera: 'xcxcxc'
    });

    const [porcentaje, setPorcentaje] = useState(20.88);

    const promedio = 88.88;

    const horasClinica = 10

    const data = [
        {
            id: 1,
            name: 'promedio',
            value: promedio
        }
    ]

    return (
        <div className={styles.contentresumen}>
            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>INFORMACIÓN ESTUDIANTE</h3>
                    <hr />
                    <br />
                    <div className={styles.imagen}>
                        <Image src={user} alt="Logo usuario"
                            width={200}
                            height={200} />
                    </div>
                    <br />
                    <h4>Estudiante: {estudiante.Nombre} {estudiante.Apellido}</h4>
                    <h4>Codigo Estudiante: {estudiante.Codigo}</h4>
                    <h4>Carrera: {estudiante.Carrera}</h4>
                </div>
                <div className={styles.graphics}>
                    <div className={styles.cardgraphics}>
                        <h3>PORCENTAJE CARRERA</h3>
                        <hr />
                        <div className={styles.progresscontainer}>
                            <div className={styles.progressbar} style={{ width: `${porcentaje}%` }}></div>
                        </div>
                        <span className={styles.progresstext}>{porcentaje}%</span>
                    </div>
                    <div className={styles.cardgraphics}>
                        <h3>PROMEDIO GLOBAL</h3>
                        <hr />
                        <div className={styles.cardgraphicsbody}>
                            <RadialBarChart
                                width={120}
                                height={100}
                                cx="50%"
                                cy="50%"
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={10}
                                data={data}
                            >
                                <PolarAngleAxis
                                    type="number"
                                    domain={[0, 100]}
                                    tick={false}
                                />
                                <RadialBar
                                    dataKey="value"
                                    cornerRadius={10}
                                    fill="#008237"
                                />
                            </RadialBarChart>

                            <span>
                                {promedio}%
                            </span>
                        </div>
                    </div>
                    <div className={styles.cardgraphics}>
                        <h3>HORAS EN CLINICA</h3>
                        <hr />
                        <p className={styles.spanclinic}>{horasClinica}</p>
                    </div>
                    <div className={styles.cardgraphics}>
                        <h3>ÚLTIMO PERIODO</h3>
                        <hr />
                        <div className={styles.cardgraphicsbody}>
                            <RadialBarChart
                                width={120}
                                height={100}
                                cx="50%"
                                cy="50%"
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={10}
                                data={data}
                            >
                                <PolarAngleAxis
                                    type="number"
                                    domain={[0, 100]}
                                    tick={false}
                                />
                                <RadialBar
                                    dataKey="value"
                                    cornerRadius={10}
                                    fill="#008237"
                                />
                            </RadialBarChart>

                            <span>
                                {promedio}%
                            </span>
                        </div>
                    </div>
                </div>

            </div>
            <div className={styles.cards2}>
                <div className={styles.faltas}>
                    <h3>CAUSALES DE SANCIÓN</h3>
                    <hr />
                    <div className={styles.cardsfaltas}>
                        <div className={styles.cardfaltas}>
                            <div>
                                <p>< FaExclamationTriangle /> FALTAS TOTALES: </p>
                            </div>
                            <div>
                                <p>< FaExclamationCircle /> FALTAS DEL AÑO ACTUAL: </p>
                            </div>
                        </div>

                        <div className={styles.cardfaltas}>
                            <div>
                                <p><FaExclamation /> FALTAS DEL PERIODO:</p>
                            </div>
                            <div>
                                <p><FaClock /> FALTAS EN PROCESO:</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={styles.stats}>
                    <h3>AÑO {new Date().getFullYear()}, PERIODO 1</h3>
                    <hr />
                    <div className={styles.cardsstats}>
                        <div className={styles.cardstats}>
                            <p>ACTIVIDADES ACADEMICAS</p>
                            <p>5</p>
                        </div>
                        <div className={styles.cardstats}>
                            <p>TOTAL NOTAS MIGRADAS</p>
                            <p>0/5</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}