"use client"

import styles from "./page.module.css"
import zamorano from "../img/Logo-Universidad-Zamorano.png"
import Image from "next/image"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

type FormData = {
    correo: string;
    contrasena: string;
}

export default function Login() {

    const router = useRouter();

    const correos = [
        {correo: "padre1", hijos: 1},
        {correo: "padre2", hijos: 2},
    ]

    const [form, setForm] = useState<FormData>({
        correo: '',
        contrasena: ''
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const { name, value} = e.target;
        setForm((values) => ({
            ...values,
            [name]: value,
        }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = correos.find(c => c.correo === form.correo);

        if(!user){
            alert("Usuario No existe");
            return;
        }

        if(user){
            alert(`hola ${user.correo}`)
        }

        localStorage.setItem("hijos", user.hijos.toString());

        router.push("/resumenEstudiante");
    }

    return (
        <div className={styles.contentlogin}>
            <form className={styles.loginform} onSubmit={handleSubmit}>
                <div className={styles.logo}>
                    <Image src={zamorano} alt="Logo Zamorano" 
                        width={200} 
                        height={200}  />
                </div>
                <div className={styles.inputslogin}>
                    <div className={styles.inputlogin}>
                        <label>Correo Electrónico:
                        </label>
                        <input type="text" name="correo" placeholder="Ingrese Correo" value={form.correo} onChange={handleOnChange}/>
                    </div>
                    <div className={styles.inputlogin}>
                        <label>Contraseña:
                        </label>
                        <input type="password" name="contrasena" placeholder="Ingrese Contraseña" value={form.contrasena} onChange={handleOnChange}/>
                    </div>
                    <button type="submit">Ingresar</button>
                    <a>¿Has olvidado tu contraseña?</a>
                </div>
            </form>
        </div>
    )
}