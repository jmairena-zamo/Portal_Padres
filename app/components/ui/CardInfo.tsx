// Componente creado por Diego Castro
// Componente de CardInfo
// Muestra la información de una queja en un card

import { Queja } from "@/app/hooks/useQueja";

// Props del componente CardInfo
interface QuejaCardProps {
  queja: Queja;
  onClick: () => void;
}

export function CardInfo({ queja, onClick }: QuejaCardProps) {
  // Formatear la fecha de creación de la queja a un formato legible
  const fecha = new Date(queja.fechaCreacion).toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[5px] border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md cursor-pointer mt-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            queja.tipo === "QUEJA"
              ? "bg-red-100 text-[#a11313]"
              : "bg-green-100 text-[#008237]"
          }`}
        >
          {queja.tipo}
        </span>
      </div>

      <h3 className="mt-2 font-semibold text-[#048047]">{queja.asunto}</h3>

      <p className="mt-1 line-clamp-2 text-sm text-[#555555]">
        {queja.mensaje}
      </p>

      <p className="mt-2 text-xs text-[#999999]">{fecha}</p>
    </button>
  );
}
