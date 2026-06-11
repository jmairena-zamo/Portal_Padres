// Componente creado por Diego Castro
// Modal genérico unificado — sirve para formularios y confirmaciones
// Para confirmación: pasar children con un <p> y txtConfirmar="Aceptar"
// Para formulario: pasar children con los campos del form

import { BtnPrimario, BtnPeligro } from "../ui";

interface Props {
    titulo: string          // Encabezado del modal
    children: React.ReactNode // Contenido libre: campos, mensaje de confirmación, etc.
    onConfirmar: () => void // Botón confirmar/aceptar
    onCancelar: () => void  // Botón cancelar
    txtConfirmar?: string   // Texto del botón confirmar
    deshabilitado?: boolean // Deshabilita el botón confirmar
}

export default function ModalFormulario({
    titulo,
    children,
    onConfirmar,
    onCancelar,
    txtConfirmar = "Guardar",
    deshabilitado = false
}: Props) {
    return (
        // Overlay
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">

            {/* Contenedor del modal */}
            <div className="bg-white shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)] border-2 border-[#008237] p-[30px] rounded-[10px] w-[400px] max-[800px]:w-[calc(100%-32px)] max-[800px]:p-[20px_15px] max-[420px]:w-[calc(100%-20px)] max-[420px]:p-[15px_10px]">

                {/* Header */}
                <div className="bg-[#008237] text-white rounded-tl-[5px] rounded-tr-[5px] mb-[25px] w-full">
                    <h2 className="py-[5px] text-[18px] text-center">{titulo}</h2>
                </div>

                {/* Contenido: campos del form o mensaje de confirmación */}
                <div className="flex flex-col gap-3">
                    {children}
                </div>

                {/* Botones */}
                <div className="flex gap-2.5 justify-end mt-5 max-[420px]:justify-center">
                    <BtnPrimario onClick={onConfirmar} disabled={deshabilitado}>
                        {txtConfirmar}
                    </BtnPrimario>
                    <BtnPeligro onClick={onCancelar}>
                        Cancelar
                    </BtnPeligro>
                </div>

            </div>
        </div>
    )
}