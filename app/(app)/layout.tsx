"use client"

import { Navbar } from "../components/navbar/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import styles from "./layout.module.css"
import { useEffect, useState } from "react";
import Modal from "../components/modal/Modal";
import { MenuProvider } from "../hooks/useMenu";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    
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

    if (loading) return null;

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