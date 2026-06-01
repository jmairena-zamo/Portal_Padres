import { ReactNode } from "react";

import {
    FaHome, FaUser, FaCog, FaSignOutAlt, FaChartBar, 
  FaBook, FaEnvelope, FaBell, FaCalendarAlt, FaUsers, 
  FaClipboardCheck,
  FaFile,
  FaCoins,
  FaFileAlt,
  FaFolder
} from "react-icons/fa";

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
    FaUsers
};

export const getRutasPermitidas = async (idRol: number): Promise<string[]> => {

    const rutasPorNombre: Record<string, string> = {
        'RESUMEN ESTUDIANTE': '/resumenestudiante',
        'CLASES': '/clases',
        'ESTADO DE CUENTA': '/estadocuenta',
        'HISTORIAL ACADEMICO': '/historialacademico',
        'HISTORIAL DISCIPLINARIO': '/historialdisciplinario',
        'DOCUMENTOS': '/documentos',
        'QUEJAS O SUGERENCIAS': '/quejasosugerencias',
        'ADMINISTRACION': '/administracion',
    };

    try {
        const resRol = await fetch(
            `https://localhost:7233/portalpadres/v1/menurol/ListarPorRol/${idRol}`
        );
        if (!resRol.ok) return [];

        const dataRol = await resRol.json();
        const menuIDs: number[] = dataRol.response.map((item: any) => item.menu_ID);

        const menus = await Promise.all(
            menuIDs.map(async (id) => {
                const res = await fetch(
                    `https://localhost:7233/portalpadres/v1/menu/Listar/${id}`
                );
                if (!res.ok) return null;
                const data = await res.json();
                return data.response;
            })
        );

        const rutasMenus = menus
            .filter(m => m !== null && m.habilitado === 1)
            .map(m => rutasPorNombre[m.opcion.toUpperCase()])
            .filter(Boolean);

        const resSubRol = await fetch(
            `https://localhost:7233/portalpadres/v1/submenurol/ListarPorRol/${idRol}`
        );

        let rutasSubmenus: string[] = [];

        if (resSubRol.ok) {
            const dataSubRol = await resSubRol.json();
            const subMenuIDs: number[] = dataSubRol.response.map((item: any) => item.subMenu_ID);

            const submenus = await Promise.all(
                subMenuIDs.map(async (id) => {
                    const res = await fetch(
                        `https://localhost:7233/portalpadres/v1/submenu/Listar/${id}`
                    );
                    if (!res.ok) return null;
                    const data = await res.json();
                    return data.response;
                })
            );

            rutasSubmenus = submenus
                .filter(s => s !== null && s.habilitado === 1)
                .map(s => {
                    const rutaPadre = rutasPorNombre[
                        menus.find(m => m?.iD_Menu === s.menu_ID)?.opcion.toUpperCase()
                    ];
                    if (!rutaPadre) return null;
                    return `${rutaPadre}/${s.opcion.toLowerCase().replace(/\s+/g, '')}`;
                })
                .filter(Boolean) as string[];
        }

        return [...rutasMenus, ...rutasSubmenus];

    } catch {
        return [];
    }
};

export const generarRuta = (opcion: string): string => {
  return "/" + opcion
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");       
};

export const getSubPath = (menuOpcion: string, subOpcion: string): string => {
    const basePath = generarRuta(menuOpcion);
    return `${basePath}/${subOpcion.toLowerCase().replace(/\s+/g, '')}`;
};