import { FaHome, FaCoins, FaFileAlt, FaBook, FaFolder, FaFile, FaClipboardCheck } from "react-icons/fa";
import { ReactNode } from "react";

export const getIcono = (opcion: string): ReactNode => {
    const iconos: Record<string, ReactNode> = {
        'RESUMEN ESTUDIANTE': <FaHome size={20} />,
        'CLASES': <FaBook size={20} />,
        'ESTADO DE CUENTA': <FaCoins size={20} />,
        'HISTORIAL ACADEMICO': <FaFileAlt size={20} />,
        'HISTORIAL DISCIPLINARIO': <FaFolder size={20} />,
        'DOCUMENTOS': <FaFile size={20} />,
        'QUEJAS O SUGERENCIAS': <FaClipboardCheck size={20} />,
    };

    return iconos[opcion.toUpperCase()] || <FaFile size={20} />;
};

export const getPath = (opcion: string): string => {
    const rutas: Record<string, string> = {
        'RESUMEN ESTUDIANTE': '/resumenEstudiante',
        'CLASES': '/clases',
        'ESTADO DE CUENTA': '/ESTADODECUENTA',
        'HISTORIAL ACADEMICO': '/historialAcademico',
        'HISTORIAL DISCIPLINARIO': '/historialDisciplinario',
        'DOCUMENTOS': '/documentos',
        'QUEJAS O SUGERENCIAS': '/quejasSugerencias',
        'ADMINISTRACION': '/administracion',
    };

    return rutas[opcion.toUpperCase()] || '/';
};

export const getRutasPermitidas = async (idRol: number): Promise<string[]> => {

    const rutasPorNombre: Record<string, string> = {
        'RESUMEN ESTUDIANTE': '/resumenEstudiante',
        'CLASES': '/clases',
        'ESTADO DE CUENTA': '/estadoCuenta',
        'HISTORIAL ACADEMICO': '/historialAcademico',
        'HISTORIAL DISCIPLINARIO': '/historialDisciplinario',
        'DOCUMENTOS': '/documentos',
        'QUEJAS O SUGERENCIAS': '/quejasSugerencias',
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

        const rutas = menus
            .filter(m => m !== null && m.habilitado === 1)
            .map(m => rutasPorNombre[m.opcion.toUpperCase()])
            .filter(Boolean);

        return rutas;

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