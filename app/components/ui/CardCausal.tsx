// Creado pr DIego Castro
// Componentes para Cards de causales de sancion
import { IconType } from "react-icons";

interface CardCausalProps {
  icono: IconType;
  label: string;
  valor: number;
  color: string;
}

export default function CardCausal({
  icono: Icono,
  label,
  valor,
  color,
}: CardCausalProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F6F6F6]">
      {/* Icono con fondo circular */}
      <div
        className="w-8 h-8 flex items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}20` }} // fondo suave con transparencia
      >
        <Icono className="text-[18px]" style={{ color }} />
      </div>

      {/* Texto y valor */}
      <div className="w-full flex justify-between items-center text-[#30545b]">
        <p className="text-[12px] font-medium text-gray-700">{label}</p>
        <p className="text-[18px] font-bold">{valor}</p>
      </div>
    </div>
  );
}
