'use client'

import { useState } from 'react';
import logozamorano from '../../img/Logo-Universidad-Zamorano.png'
import styles from './page.module.css'
import Image from 'next/image'
import { loginSchema, LoginFormData } from "../../utils/validations"

export default function RecuperarContrasena() {

    const [esValidoCorreo, setEsValidoCorreo] = useState(true);
    const [correo, setCorreo] = useState<string>();
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCorreo(value);
        if (name === "correo") {
            if (!esValidoCorreo) setEsValidoCorreo(true);
        }
    }

    const validationCorreo = () => {
        const result = loginSchema.shape.correo.safeParse(correo);
        setEsValidoCorreo(result.success);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCargando(true);
        setMensaje('');

        try {
            const res = await fetch('/api/auth/recuperarContrasena', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo }),
            });

            const data = await res.json();
            setMensaje(data.message);

        } catch (error) {
            setMensaje('Error de conexión. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className={styles.content}>
            <div className={styles.containerLogo}>
                <Image src={logozamorano} alt="Logo Zamorano" width={300} height={75} />
            </div>
            <div className={styles.container}>
                <h2>Recuperar Contraseña</h2>
                <p>Ingrese su dirección de correo electronico y le enviaremos un link para restablecer su contraseña.</p>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputlogin}>
                        <label>Correo Electrónico:
                        </label>
                        <input id="correo" type="text" name="correo" placeholder="Ingrese Correo Electrónico"
                            onChange={handleOnChange} onBlur={validationCorreo}
                            className={!esValidoCorreo ? styles.inputError : ""}  />
                        <span className={`${styles.spanError} ${!esValidoCorreo ? styles.err : ""}`}>El correo no es válido</span>
                    </div>
                    <button className={styles.resBTN} type="submit" disabled={!esValidoCorreo || cargando}>
                        {cargando ? 'Enviando...' : 'Enviar Correo Para Restablecer Contraseña'}
                    </button>
                </form>
                {mensaje && (
                    <p style={{ marginTop: '16px', color: 'green', textAlign: 'center' }}>
                        {mensaje}
                    </p>
                )}

                <a href="/login" style={{ display: 'block', marginTop: '16px', textAlign: 'center' }}>
                    Volver al login
                </a>
            </div>

        </div>
    )
}