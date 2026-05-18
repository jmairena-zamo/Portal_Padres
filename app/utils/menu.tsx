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
        'ESTADO DE CUENTA': '/estadoCuenta',
        'HISTORIAL ACADEMICO': '/historialAcademico',
        'HISTORIAL DISCIPLINARIO': '/historialDisciplinario',
        'DOCUMENTOS': '/documentos',
        'QUEJAS O SUGERENCIAS': '/quejasSugerencias',
    };

    return rutas[opcion.toUpperCase()] || '/';
};