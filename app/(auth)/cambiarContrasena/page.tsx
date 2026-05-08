'use client'

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import logozamorano from '../../img/Logo-Universidad-Zamorano.png'
import Image from "next/image"
import styles from './page.module.css'
import { loginSchema } from "@/app/utils/validations"

export default function CambiarContrasena() {
    const searchParams = useSearchParams();
    const route = useRouter();

    const correo = searchParams.get('correo');
    const token = searchParams.get('token');

    const [newContrasena, setNewContrasena] = useState('');
    const [esValidoNewContras, setesValidoNewContras] = useState(true);
    const [confirmContrasena, setConfirmContrasena] = useState('');
    const [esValidoConfirmContras, setesValidoConfirmContras] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (!correo || !token) {
            setError("Link Invalido o Expirado");
            return;
        }

        fetch(`/api/user/obtenerUsuario?correo=${correo}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError("Link Invalido o Expirado");
                }

                setUserData(data);
            }).catch(() => setError('Error de conexión 1'));

    }, [correo, token])

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p style={{ color: 'red' }}>{error}</p>
                <a href="/login">Volver al login</a>
            </div>
        );
    }

    const handleOnChangeNew = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewContrasena(value);
        if (name === "contrasena") {
            if (!esValidoNewContras) setesValidoNewContras(true);
        }
    }

    const validationNewContra = () => {
        const result = loginSchema.shape.contrasena.safeParse(newContrasena);
        setesValidoNewContras(result.success);
    }

    const handleOnChangeConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfirmContrasena(value);
        if (name === "confirmcontrasena") {
            if (!esValidoConfirmContras) setesValidoConfirmContras(true);
        }
    }

    const validationConfirmContra = () => {
        const result = loginSchema.shape.contrasena.safeParse(confirmContrasena);
        setesValidoConfirmContras(result.success);
    }

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (newContrasena !== confirmContrasena) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setCargando(true);

        try {
            const res = await fetch('/api/auth/nuevaContrasena',
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_useremail: userData.id,
                        correoElectronico: correo,
                        relacion: userData.relacion,
                        tipoUsuario: userData.tipoUsuario,
                        contrasena: newContrasena,
                        usuario: userData.usuario
                    })
                }
            )

            const data = await res.json();

            if(!res.ok){
                setError(data.error);
                return;
            }

            setMensaje(data.message);
            setTimeout(() => route.push('/login'), 3000);

        } catch (error) {
            setError("Error de conexión. inetetetete")
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
                <h2>Nueva Contraseña</h2>
                <p>Ingrese su nueva contraseña</p>
                <form onSubmit={handlerSubmit}>
                    <div className={styles.inputlogin}>
                        <label>Nueva Contraseña:
                        </label>
                        <input id="contrasena" type="password" name="contrasena" placeholder="Ingrese su nueva contraseña"
                            onChange={handleOnChangeNew} onBlur={validationNewContra}
                            className={!esValidoNewContras ? styles.inputError : ""} />
                        <span className={`${styles.spanError} ${!esValidoNewContras ? styles.err : ""}`}>La contraseña no es válida</span>
                    </div>
                    <div className={styles.inputlogin}>
                        <label>Confirmar Contraseña:
                        </label>
                        <input id="contrasena" type="password" name="confirmcontrasena" placeholder="Confirmar su nueva contraseña"
                            onChange={handleOnChangeConfirm} onBlur={validationConfirmContra}
                            className={!esValidoConfirmContras ? styles.inputError : ""} />
                        <span className={`${styles.spanError} ${!esValidoConfirmContras ? styles.err : ""}`}>La contraseña no es válida</span>
                    </div>
                    <button className={styles.resBTN} type="submit" disabled={!esValidoNewContras || !esValidoConfirmContras || cargando}>
                        {cargando ? 'Enviando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
                {mensaje && (
                    <p style={{ marginTop: '16px', color: 'green', textAlign: 'center' }}>
                        {mensaje}
                    </p>
                )}
            </div>
        </div>
    )


}