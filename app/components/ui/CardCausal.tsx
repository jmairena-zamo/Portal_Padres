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
    <div
      className="flex items-center gap-3 p-3 rounded-[5px] border"
      style={{ borderColor: color }}
    >
      <Icono className="text-[20px] shrink-0" style={{ color }} />
      <div className="w-full flex justify-between items-center">
        <p className="text-[11px] leading-tight font-medium" style={{ color }}>
          {label}
        </p>
        <p className="text-[20px] font-bold leading-tight" style={{ color }}>
          {valor}
        </p>
      </div>
    </div>
  );
}
