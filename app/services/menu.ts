// Creado por Diego Castro
// Genera las rutas permitidas segun el rl

import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChartBar,
  FaBook,
  FaEnvelope,
  FaBell,
  FaCalendarAlt,
  FaUsers,
  FaClipboardCheck,
  FaFile,
  FaCoins,
  FaFileAlt,
  FaFolder,
} from "react-icons/fa";
import { API_URL } from "../config/api";

// Diccionario de iconos utilizados en el menú.
// La clave es el nombre del icono y el valor es el componente de React correspondiente
export const iconos: Record<string, React.ElementType> = {
  FaHome,
  FaBook,
  FaCoins,
  FaFileAlt,
  FaFolder,
  FaFile,
  FaClipboardCheck,
  FaUser,
  FaCog,
  FaChartBar,
  FaSignOutAlt,
  FaEnvelope,
  FaBell,
  FaCalendarAlt,
  FaUsers,
};

// Obtiene las rutas permitidas para un rol específico.
// 1. Consulta los menús habilitados para el rol.
// 2. Consulta los submenús habilitados.
// 3. Devuelve un arreglo con todas las rutas accesibles.
// Utilizado en el middleware
export const getRutasPermitidas = async (idRol: number): Promise<string[]> => {
  const rutasPorNombre: Record<string, string> = {
    "RESUMEN ESTUDIANTE": "/resumenestudiante",
    CLASES: "/clases",
    "ESTADO DE CUENTA": "/estadodecuenta",
    "HISTORIAL ACADEMICO": "/historialacademico",
    "HISTORIAL DISCIPLINARIO": "/historialdisciplinario",
    DOCUMENTOS: "/documentos",
    "QUEJAS O SUGERENCIAS": "/quejasosugerencias",
    ADMINISTRACION: "/administracion",
  };

  try {
    const resRol = await fetch(`${API_URL}/menurol/ListarPorRol/${idRol}`);
    if (!resRol.ok) return [];

    const dataRol = await resRol.json();
    const menuIDs: number[] = dataRol.response.map((item: any) => item.menu_ID);

    const menus = await Promise.all(
      menuIDs.map(async (id) => {
        const res = await fetch(`${API_URL}/menu/Listar/${id}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.response;
      }),
    );

    // Filtra menús habilitados y obtiene sus rutas
    const rutasMenus = menus
      .filter((m) => m !== null && m.habilitado === 1)
      .map((m) => rutasPorNombre[m.opcion.toUpperCase()])
      .filter(Boolean);

    const resSubRol = await fetch(
      `${API_URL}/submenurol/ListarPorRol/${idRol}`,
    );

    let rutasSubmenus: string[] = [];

    if (resSubRol.ok) {
      const dataSubRol = await resSubRol.json();
      const subMenuIDs: number[] = dataSubRol.response.map(
        (item: any) => item.subMenu_ID,
      );

      const submenus = await Promise.all(
        subMenuIDs.map(async (id) => {
          const res = await fetch(`${API_URL}/submenu/Listar/${id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return data.response;
        }),
      );

      // Construye rutas de submenús concatenando la ruta padre con la opción del submenú
      rutasSubmenus = submenus
        .filter((s) => s !== null && s.habilitado === 1)
        .map((s) => {
          const rutaPadre =
            rutasPorNombre[
              menus.find((m) => m?.iD_Menu === s.menu_ID)?.opcion.toUpperCase()
            ];
          if (!rutaPadre) return null;
          return `${rutaPadre}/${s.opcion.toLowerCase().replace(/\s+/g, "")}`;
        })
        .filter(Boolean) as string[];
    }

    return [...rutasMenus, ...rutasSubmenus];
  } catch {
    return [];
  }
};

// Genera una ruta a partir de un nombre de opción.
// Convierte a minúsculas, elimina acentos y espacios.
export const generarRuta = (opcion: string): string => {
  return (
    "/" +
    opcion
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
  );
};

// Genera la ruta completa de un submenú.
// Combina la ruta del menú padre con la opción del submenú.
export const getSubPath = (menuOpcion: string, subOpcion: string): string => {
  const basePath = generarRuta(menuOpcion);
  return `${basePath}/${subOpcion.toLowerCase().replace(/\s+/g, "")}`;
};
