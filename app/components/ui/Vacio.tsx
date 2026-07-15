// Componente creado por Diego Castro
// Componente para mostrar cuando no hay datos en alguna petición
// Componente también utilizado para errores (se detecta automáticamente
// según si se recibe onReintentar)

import { FaInbox, FaExclamationTriangle } from "react-icons/fa";
import { BtnPrimario } from "./Boton";

interface DataVacia {
  titulo?: string;
  descripcion?: string;
  onReintentar?: () => void;
}

export default function Vacio({
  titulo,
  descripcion,
  onReintentar,
}: DataVacia) {
  const esError = !!onReintentar;

  return (
    <div className="flex flex-col items-center justify-center text-center my-12.5 px-5">
      {/* Ícono contextual: círculo suave en verde institucional para vacío, rojo para error */}
      <div
        className={`
          flex items-center justify-center
          w-15 h-15 rounded-full mb-4
          ${esError ? "bg-[#fbeaea] text-[#a11313]" : "bg-[#e5f3ec] text-[#008237]"}
        `}
      >
        {esError ? <FaExclamationTriangle size={22} /> : <FaInbox size={22} />}
      </div>

      <h2 className="text-lg mb-1.5 font-semibold text-[#222222]">{titulo}</h2>
      {descripcion && (
        <p className="mb-5 text-[14px] text-[#6b6b6b] max-w-80">
          {descripcion}
        </p>
      )}

      {onReintentar && (
        <BtnPrimario onClick={onReintentar}>Reintentar</BtnPrimario>
      )}
    </div>
  );
}
