// app/components/quejas/QuejaCard.tsx

import { Queja } from "@/app/hooks/useQueja";

interface QuejaCardProps {
  queja: Queja;
  onClick: () => void;
}

export function CardInfo({ queja, onClick }: QuejaCardProps) {
  const fecha = new Date(queja.fechaCreacion).toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <button
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

      <h3 className="mt-2 font-semibold text-[rgb(41,94,34)]">
        {queja.asunto}
      </h3>

      <p className="mt-1 line-clamp-2 text-sm text-gray-600">{queja.mensaje}</p>

      <p className="mt-2 text-xs text-gray-400">{fecha}</p>
    </button>
  );
}
