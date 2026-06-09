//Creado por Diego Castro
// Página de inicio de sesión del portal de padres.
// Valida el formulario localmente con Zod antes de enviar al endpoint /api/auth/login.

"use client"

import { Navbar } from "../components/navbar/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import styles from "./layout.module.css"
import { useEffect, useState } from "react";
import Modal from "../components/modal/Modal";
import { MenuProvider } from "../hooks/useMenu";
import Loading from "../components/Loading/Loading";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    //Constantes 
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(true); 
    const [colapsado, setColapsado] = useState(false);

    useEffect(() => {
        const cantidadHijos = 1;
        
        if(cantidadHijos && Number(cantidadHijos) > 1){
            setShowModal(true);
        }

        setLoading(false);
    }, [])

    if (loading) return <Loading />;

    return (
        <MenuProvider>
            {showModal && <Modal OnClose={() => setShowModal(false)}/>}

            {!showModal && (
                <div className={styles.body}>
                    <Sidebar colapsado={colapsado} onToggle={() => setColapsado(v => !v)}/>
                    <div className={`${styles.main} ${colapsado ? styles.mainColapsado : ''}`}>
                        <Navbar colapsado={colapsado} />
                        <div className={styles.content}>
                            {children}
                        </div>
                    </div>
                </div>
            )}

        </MenuProvider>
    )
}