'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import { quejaData, quejaSchema } from '@/app/utils/validations'

export default function QuejasSugerencias() {

    const [formData, setFormData] = useState<quejaData>({
        telefono: '',
        tipo: 'queja',
        asunto: '',
        mensaje: ''
    })

    const [esValidoTelefono, setEsValidoTelefono] = useState(true);
    const [esValidoTipo, setEsValidoTipo] = useState(true);
    const [esValidoAsunto, setEsValidoAsunto] = useState(true);
    const [esValidoMensaje, setEsValidoMensaje] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handlerOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((values) => ({
            ...values,
            [name]: value,
        }));

        if (name === "telefono" && !esValidoTelefono) {
            setEsValidoTelefono(true);
        }

        if (name === "tipo" && !esValidoTipo) {
            setEsValidoTipo(true);
        }

        if (name === "asunto" && !esValidoAsunto) {
            setEsValidoAsunto(true);
        }

        if (name === "mensaje" && !esValidoMensaje) {
            setEsValidoMensaje(true);
        }
    }

    const validationTelefono = () => {
        const result = quejaSchema.shape.telefono.safeParse(formData.telefono);
        setEsValidoTelefono(result.success)
    }

    const validationTipo = () => {
        const result = quejaSchema.shape.tipo.safeParse(formData.tipo);
        setEsValidoTipo(result.success);
    }

    const validationAsunto = () => {
        const result = quejaSchema.shape.asunto.safeParse(formData.asunto);
        setEsValidoAsunto(result.success);
    }

    const validationMensaje = () => {
        const result = quejaSchema.shape.mensaje.safeParse(formData.mensaje);
        setEsValidoMensaje(result.success);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError(''); 
        setMensaje('');

        const validate = quejaSchema.safeParse(formData);

        if (!validate.success) {

            setEsValidoTelefono(false);
            setEsValidoTipo(false);
            setEsValidoAsunto(false);
            setEsValidoMensaje(false);

            return;
        }

        setCargando(true);

        console.log(validate.data);

        try {
            const res = await fetch("/api/quejas/insertarQueja",
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(validate.data),
                }
            )

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setMensaje(data.message);

            setTimeout(() => setMensaje(''), 2000)

            setFormData({
                telefono: '',
                tipo: 'queja',
                asunto: '',
                mensaje: '',
            })

        } catch (error) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className={styles.contentQS}>
            <form className={styles.mainform} onSubmit={handleSubmit}>
                <h2>¡Quejas y Sugerencias!</h2>
                <h3>Siempre es un gusto saber su opinión sobre nuestro servicio</h3>
                <div className={styles.contentinputs}>
                    <div className={styles.inputgroup}>
                        <label>Teléfono:
                        </label>
                        <input name="telefono" type="text" placeholder="Ingrese Telefono" value={formData.telefono}
                            onChange={handlerOnChange}
                            onBlur={validationTelefono}
                            className={!esValidoTelefono ? styles.inputError : styles.input} />
                        <span className={`${styles.spanError} ${!esValidoTelefono ? styles.err : ""}`}>El teléfono no es válido</span>
                    </div>
                    <div className={styles.inputgroup}>
                        <label>Opción:</label>
                        <hr />
                        <div className={styles.radiogroup}>
                            <label>
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="queja"
                                    checked={formData.tipo === "queja"}
                                    onChange={handlerOnChange}
                                    onBlur={validationTipo}
                                /> Queja
                            </label>
                            <label>

                                <input
                                    type="radio"
                                    name="tipo"
                                    value="sugerencia"
                                    checked={formData.tipo === "sugerencia"}
                                    onChange={handlerOnChange}
                                    onBlur={validationTipo}
                                /> Sugerencia</label>
                        </div>
                        <span className={`${styles.spanError} ${!esValidoTipo ? styles.err : ""}`}>Seleccione una opción válida</span>
                    </div>
                    <div className={styles.inputgroup}>
                        <label>Asunto:</label>
                        <textarea
                            name="asunto"
                            placeholder="Ingrese Asunto"
                            value={formData.asunto}
                            className={!esValidoAsunto ? styles.inputErrorArea : styles.textarea}
                            onChange={handlerOnChange}
                            onBlur={validationAsunto}
                        />
                        <span className={`${styles.spanError} ${!esValidoAsunto ? styles.err : ""}`}>Asunto no válido</span>
                    </div>
                    <div className={styles.inputgroup}>
                        <label>Mensaje:</label>
                        <textarea
                            name="mensaje"
                            placeholder="Ingrese su Comentario..."
                            value={formData.mensaje}
                            className={!esValidoMensaje ? styles.inputErrorArea : styles.textarea}
                            onChange={handlerOnChange}
                            onBlur={validationMensaje}
                        />
                        <span className={`${styles.spanError} ${!esValidoMensaje ? styles.err : ""}`}>Mensaje no válido</span>
                    </div>

                    <button className={styles.submit} type="submit"
                        disabled={!esValidoTelefono || !esValidoTipo ||
                            !esValidoAsunto || !esValidoMensaje} >
                        {cargando ? 'Enviando...' : 'Enviar'}
                    </button>

                </div>
                {error && (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                )}
                {mensaje && (
                    <p style={{ color: 'green', textAlign: 'center' }}>{mensaje}</p>
                )}
            </form>
        </div>
    )
}