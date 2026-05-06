"use client"

import styles from "./page.module.css"
import zamorano from "../img/Logo-Universidad-Zamorano.png"
import Image from "next/image"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { cifrarDato } from "../utils/encrypt"
import { loginSchema, LoginFormData } from "../utils/validations"

export default function Login() {

    const [esValidoCorreo, setEsValidoCorreo] = useState(true);
    const [esValidoPass, setEsValidoPass] = useState(true);
    const [errorServidor, setErrorServidor] = useState('');
    const [cargando, setCargando] = useState(false);

    const router = useRouter();

    const [form, setForm] = useState<LoginFormData>({
        correo: '',
        contrasena: ''
    });

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

    const validationCorreo = () => {
        const result = loginSchema.shape.correo.safeParse(form.correo);
        setEsValidoCorreo(result.success);
    }

    const validationPass = () => {
        const result = loginSchema.shape.contrasena.safeParse(form.contrasena);
        setEsValidoPass(result.success);
    }


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
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validate.data),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorServidor(data.error);                
                return;
            }

            router.push("/resumenEstudiante");

        } catch (error) {
            setErrorServidor('Error de conexión. Intenta de nuevo.');
            console.log("Error: ", error);
            alert("Error al enviar datos");
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
                        <input id="correo" type="text" name="correo" placeholder="Ingrese Correo"
                            value={form.correo} onChange={handleOnChange} onBlur={validationCorreo}
                            className={!esValidoCorreo ? styles.inputError : ""} />
                        <span className={`${styles.spanError} ${!esValidoCorreo ? styles.err : ""}`}>El correo no es valido</span>
                    </div>
                    <div className={styles.inputlogin}>
                        <label>Contraseña:
                        </label>
                        <input type="password" name="contrasena" placeholder="Ingrese Contraseña"
                            value={form.contrasena} onChange={handleOnChange} onBlur={validationPass}
                            className={!esValidoPass ? styles.inputError : ""} />
                        <span className={`${styles.spanError} ${!esValidoPass ? styles.err : ""}`}>La contraseña no es valido</span>
                    </div>
                    <button type="submit" disabled={!esValidoPass || !esValidoCorreo || cargando}>Ingresar</button>
                    <a>¿Has olvidado tu contraseña?</a>
                    <span className={`${styles.spanError} ${errorServidor ? styles.err : ""}`}>
                        {errorServidor || "."}
                    </span>
                </div>

            </form>
        </div>
    )
}