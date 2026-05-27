"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Menu } from "../interfaces/menus";

interface MenuContextType {
    menus: Menu[];
    cargarMenus: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | null>(null);

export const MenuProvider = ({children}: { children: React.ReactNode }) => {

    const [menus, setMenus] = useState<Menu[]>([]);

    const cargarMenus = async () => {

        try {

            const res = await fetch('/api/menu/obtenerMenu');

            const data = await res.json();

            if (data.menus) {
                setMenus(data.menus);
            }

        } catch (error) {

            console.log("Error cargando menus:", error);

        }
    }

    useEffect(() => {
        cargarMenus();
    }, []);

    return (
        <MenuContext.Provider value={{
            menus,
            cargarMenus
        }}>
            {children}
        </MenuContext.Provider>
    )
}

export const useMenu = () => {

    const context = useContext(MenuContext);

    if (!context) {
        throw new Error("useMenu debe usarse dentro de MenuProvider");
    }

    return context;
}