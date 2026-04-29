import { Navbar } from "../components/navbar/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import styles from "./layout.module.css"

export default function AppLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.body}>
            <Sidebar />
            <div className={styles.main}>
                <Navbar />
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    )
}