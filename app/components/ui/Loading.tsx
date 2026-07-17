// Componente creado por Diego Castro
// Componente de Loading
// Muestra un spinner de carga y un texto opcional

// Props para el componente Loading
interface LoadingProps {
  texto?: string;
}

export default function Loading({ texto = "Cargando..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-50 gap-5">
      <style>{`
                @keyframes girar {
                    to { transform: rotate(360deg); }
                }
            `}</style>

      <div
        className="w-10 h-10 rounded-full border-[3px] border-[#e0e0e0] border-t-[#008237]"
        style={{ animation: "girar 0.75s linear infinite" }}
      />

      <p className="text-[14px] text-[#888] m-0">{texto}</p>
    </div>
  );
}
