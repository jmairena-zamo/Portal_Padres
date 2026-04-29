"use client"

import styles from "./page.module.css"
import zamorano from "../img/Logo-Universidad-Zamorano.png"
import Image from "next/image"
import { ReactEventHandler, useState } from "react"

type FormData = {
    correo: string;
    contrasena: string;
}

export default function Login() {

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

    return (
        <div className={styles.contentlogin}>
            <form className={styles.loginform}>
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
                    <button>Ingresar</button>
                </div>
            </form>
        </div>
    )
}