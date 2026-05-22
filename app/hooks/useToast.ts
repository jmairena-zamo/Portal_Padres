import { useState } from 'react';

interface Toast {
    mensaje: string;
    tipo: 'exito' | 'error';
}

export function useToast() {
    const [toast, setToast] = useState<Toast | null>(null);

    const mostrarExito = (mensaje: string) => {
        setToast({ mensaje, tipo: 'exito' });
    }

    const mostrarError = (mensaje: string) => {
        setToast({ mensaje, tipo: 'error' });
    }

    const cerrarToast = () => {
        setToast(null);
    }

    return { toast, mostrarExito, mostrarError, cerrarToast };
}