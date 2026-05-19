"use client"

import { Navbar } from "../components/navbar/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import styles from "./layout.module.css"
import { useEffect, useState } from "react";
import Modal from "../components/modal/Modal";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const cantidadHijos = 1;
        
        if(cantidadHijos && Number(cantidadHijos) > 1){
            setShowModal(true);
        }

        setLoading(false);
    }, [])

    if (loading) return null;

    return (
        <>
            {showModal && <Modal OnClose={() => setShowModal(false)}/>}

            {!showModal && (
                <div className={styles.body}>
                    <Sidebar />
                    <div className={styles.main}>
                        <Navbar />
                        <div className={styles.content}>
                            {children}
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}