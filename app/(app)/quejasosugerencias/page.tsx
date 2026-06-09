//Creado por Diego Castro
// *Renderiza un formulario interactivo para que los usuarios envíen quejas o sugerencias.
//  * Cuenta con validación en tiempo real (onBlur) y validación global al enviar (onSubmit)
//  * utilizando esquemas de validación personalizados.

'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import { quejaData, quejaSchema } from '@/app/utils/validations'
import Loading from '@/app/components/Loading/Loading'
import { useToast } from '@/app/hooks/useToast'
import Toast from '@/app/components/toast/Toast'

export default function QuejasSugerencias() {

    const { toast, mostrarExito, mostrarError, cerrarToast } = useToast();

    // Almacena los valores de los campos del formulario
    const [formData, setFormData] = useState<quejaData>({
        telefono: '',
        tipo: 'queja',
        asunto: '',
        mensaje: ''
    })

    // Estados de validación individuales para manejar estilos de error visuales
    const [esValidoTelefono, setEsValidoTelefono] = useState(true);
    const [esValidoTipo, setEsValidoTipo] = useState(true);
    const [esValidoAsunto, setEsValidoAsunto] = useState(true);
    const [esValidoMensaje, setEsValidoMensaje] = useState(true);

    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    // * Maneja los cambios en los inputs y textareas del formulario.
    //  * Actualiza el estado `formData` de manera dinámica y limpia el estado de error 
    //  * del campo modificado si este se encontraba en un estado inválido.
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

    //----VALIDACION INDEPENDIENTE PARA CADA CAMPO----------------------------------
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

    //Envio del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError('');

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
            //Peticion de insercion
            const res = await fetch("/api/quejas/insertarQueja",
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(validate.data),
                }
            )

            const data = await res.json();

            if (!res.ok) {
                return mostrarError(data.error);
            }

            mostrarExito(data.message);

            setFormData({
                telefono: '',
                tipo: 'queja',
                asunto: '',
                mensaje: '',
            })

        } catch (error) {
            setError('Error de conexión. Intenta de nuevo.');
            mostrarError('Error de conexión. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    }

    if (cargando) return <Loading />;

    return (
        <div className={styles.contentQS}>
            {toast && (
                <Toast
                    mensaje={toast.mensaje}
                    tipo={toast.tipo}
                    onClose={cerrarToast}
                />
            )}
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
            </form>
        </div>
    )
}