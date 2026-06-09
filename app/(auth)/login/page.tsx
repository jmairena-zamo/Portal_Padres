//Creado por Diego Castro
// Página de inicio de sesión del portal de padres.
// Valida el formulario localmente con Zod antes de enviar al endpoint /api/auth/login.

"use client"

import styles from "./page.module.css"
import zamorano from "../../img/Logo-Universidad-Zamorano.png"
import Image from "next/image"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { cifrarDato } from "../../utils/encrypt"
import { loginSchema, LoginFormData } from "../../utils/validations"

export default function Login() {

    const [esValidoCorreo, setEsValidoCorreo] = useState(true);
    const [esValidoPass, setEsValidoPass] = useState(true);
    const [errorServidor, setErrorServidor] = useState('');
    const [cargando, setCargando] = useState(false);
    const [errorContra, setErrorContra] = useState('');

    const router = useRouter();

    const [form, setForm] = useState<LoginFormData>({
        correo: '',
        contrasena: ''
    });

    // Limpia el error del campo que el usuario está editando para no bloquear el botón prematuramente.
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((values) => ({
            ...values,
            [name]: value,
        }));
        if (name === "correo") {
            if (!esValidoCorreo) setEsValidoCorreo(true);
        }

        if (name === "contrasena") {
            if (!esValidoPass) setEsValidoPass(true);
        }
    }

    //Validación onBlur para el correo y contraseña
    const validationCorreo = () => {
        const result = loginSchema.shape.correo.safeParse(form.correo);
        setEsValidoCorreo(result.success);
    }

    const validationPass = () => {
        const result = loginSchema.shape.contrasena.safeParse(form.contrasena);
        if (!result.success) {
            setEsValidoPass(false);
            setErrorContra(result.error.issues[0].message);
        } else {
            setEsValidoPass(true);
            setErrorContra('');
        }
    }

    // Valida todo el form antes de llamar a la API; el backend devuelve { error } en caso de fallo.
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorServidor("");

        const validate = loginSchema.safeParse(form);
        if (!validate.success) {
            setEsValidoCorreo(false);
            setEsValidoPass(false);
            return;
        }

        setCargando(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validate.data),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorServidor(data.error);                
                return;
            }

            router.push("/resumenestudiante");

        } catch (error) {
            setErrorServidor('Error de conexión. Intenta de nuevo.');
            console.log("Error: ", error);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className={styles.contentlogin}>
            <form className={styles.loginform} onSubmit={handleSubmit}>
                <div className={styles.logo}>
                    <Image src={zamorano} alt="Logo Zamorano"
                        width={200}
                        height={200}
                        loading="eager"
                    />
                </div>
                <div className={styles.inputslogin}>
                    <div className={styles.inputlogin}>
                        <label>Correo Electrónico:
                        </label>
                        {/* inputError resalta el borde en rojo; spanError/err muestra el mensaje */}
                        <input id="correo" type="text" name="correo" placeholder="Ingrese Correo"
                            value={form.correo} onChange={handleOnChange} onBlur={validationCorreo}
                            className={!esValidoCorreo ? styles.inputError : ""} />
                        <span className={`${styles.spanError} ${!esValidoCorreo ? styles.err : ""}`}>El correo no es válido</span>
                    </div>
                    <div className={styles.inputlogin}>
                        <label>Contraseña:
                        </label>
                        <input type="password" name="contrasena" placeholder="Ingrese Contraseña"
                            value={form.contrasena} onChange={handleOnChange} onBlur={validationPass}
                            className={!esValidoPass ? styles.inputError : ""} />
                        <span className={`${styles.spanError} ${!esValidoPass ? styles.err : ""}`}>{errorContra}</span>
                    </div>
                    {/* Deshabilitado mientras haya errores de validación o la petición esté en vuelo */}
                    <button type="submit" disabled={!esValidoPass || !esValidoCorreo || cargando}>Ingresar</button>
                    <a href="/recuperarContrasena">¿Has olvidado tu contraseña?</a>
                    <span className={`${styles.spanError} ${errorServidor ? styles.err : ""}`}>
                        {errorServidor || "."}
                    </span>
                </div>

            </form>
        </div>
    )
}