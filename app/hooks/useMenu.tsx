// Creado por Diego Castro

"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Menu } from "../interfaces/menus";

interface MenuContextType {
  menus: Menu[]; //Lista de menus cargados para el rol del usuario
  cargarMenus: () => Promise<void>; //cargar menus desde la api
}

const MenuContext = createContext<MenuContextType | null>(null);

//Carga los menús al montar y los expone junto a cargarMenus para refrescarlos.
export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menus, setMenus] = useState<Menu[]>([]);

  const cargarMenus = useCallback(async () => {
    try {
      const res = await fetch("/api/menu/obtenerMenu");

      const data = await res.json();

      if (data.menus) {
        setMenus(data.menus);
      }
    } catch (error) {
      console.log("Error cargando menus:", error);
    }
  }, []);

  //Carga inicial de los menus
  useEffect(() => {
    cargarMenus();
  }, []);

  const value = useMemo(
    () => ({
      menus,
      cargarMenus,
    }),
    [menus, cargarMenus],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

//Hook para consumir el contexto menu
//Debe usarse dentro de `MenuProvider`; lanza un error si se usa fuera.
export const useMenu = () => {
  const context = use(MenuContext);

  if (!context) {
    throw new Error("useMenu debe usarse dentro de MenuProvider");
  }

  return context;
};
