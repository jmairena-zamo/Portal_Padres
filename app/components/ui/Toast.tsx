// Componente creado por Diego Castro

"use client"

import { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

interface ToastProps {
    mensaje: string;       // texto que muestra la notificación
    tipo: 'exito' | 'error'; // controla el color e icono
    onClose: () => void;   // cierra el toast
}

const slideInStyle: React.CSSProperties = {
    animation: 'slideIn 0.3s ease',
};

// Notificación temporal que se cierra automáticamente en 2 segundos
export default function Toast({ mensaje, tipo, onClose }: ToastProps) {

    // Cierra la notificación luego de 2 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [mensaje]);

    const isExito = tipo === 'exito';

    return (
        <>
            {/* keyframe definido inline — solo para slideIn */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>

            <div
                style={slideInStyle}
                className={[
                    // posición y layout
                    'fixed bottom-6 right-6 z-[9999]',
                    'flex items-center gap-3',
                    // tamaño y forma
                    'min-w-[280px] max-w-[400px]',
                    'px-3 py-2 rounded-lg',
                    // sombra
                    'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
                    // colores según tipo
                    isExito
                        ? 'bg-[#e6f4ea] border-l-4 border-[#2d6a4f] text-[#2d6a4f]'
                        : 'bg-[#fdecea] border-l-4 border-[#d32f2f] text-[#d32f2f]',
                ].join(' ')}
            >
                {/* icono */}
                <span className="shrink-0">
                    {isExito
                        ? <FaCheckCircle size={20} />
                        : <FaTimesCircle size={20} />
                    }
                </span>

                {/* mensaje */}
                <p className="flex-1 text-sm m-0">{mensaje}</p>

                {/* botón cerrar manual */}
                <button
                    onClick={onClose}
                    className="shrink-0 bg-transparent border-none cursor-pointer text-inherit p-0 opacity-70 hover:opacity-100"
                >
                    <FaTimes size={14} />
                </button>
            </div>
        </>
    );
}