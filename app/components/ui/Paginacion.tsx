interface Props {
  totalRegistros: number;
  registrosPorPagina: number;
  paginaActual: number;
  onCambiarPagina: (pagina: number) => void;
  onCambiarRegistrosPorPagina: (cantidad: number) => void;
}

const OPCIONES_FILAS = [5, 10, 25, 50];

export default function Paginacion({
  totalRegistros,
  registrosPorPagina,
  paginaActual,
  onCambiarPagina,
  onCambiarRegistrosPorPagina,
}: Props) {
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

  if (totalPaginas <= 1 && totalRegistros <= OPCIONES_FILAS[0]) return null;

  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) paginas.push(i);

  let paginasVisibles = paginas;
  if (totalPaginas > 5) {
    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, inicio + 4);
    paginasVisibles = paginas.slice(inicio - 1, fin);
  }

  return (
    <div
      className="flex justify-between items-center gap-5 px-4 py-3
            bg-white border-t border-[#e8f5e9] rounded-b-xl
            max-[800px]:flex-col max-[800px]:items-stretch
            max-[420px]:px-2.5 max-[420px]:py-2.5 max-[420px]:gap-3"
    >
      {/* info: selector + conteo */}
      <div
        className="flex items-center gap-4.5 flex-wrap
                max-[800px]:justify-center max-[800px]:text-center
                max-[420px]:flex-col max-[420px]:gap-2.5"
      >
        {/* filas por página */}
        <div
          className="flex items-center gap-2 text-[13px] text-[#888]
                    max-[420px]:justify-center"
        >
          <span>Filas por página:</span>
          <select
            aria-label="Cantidad de registros por página"
            value={registrosPorPagina}
            onChange={(e) => {
              onCambiarRegistrosPorPagina(Number(e.target.value));
              onCambiarPagina(1);
            }}
            className="px-2 py-1 rounded-md border border-[#43C302]
                            text-[#048047] text-[13px] cursor-pointer outline-none"
          >
            {OPCIONES_FILAS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* conteo de registros */}
        <span className="text-[13px] text-[#888] max-[420px]:text-center max-[420px]:text-xs">
          Mostrando{" "}
          {Math.min(
            (paginaActual - 1) * registrosPorPagina + 1,
            totalRegistros,
          )}
          {" – "}
          {Math.min(paginaActual * registrosPorPagina, totalRegistros)}
          {" de "}
          {totalRegistros}
        </span>
      </div>

      {/* botones de paginación */}
      <div
        className="flex items-center gap-1.5 flex-wrap
                max-[800px]:justify-center
                max-[420px]:grid max-[420px]:grid-cols-[repeat(auto-fit,minmax(38px,1fr))] max-[420px]:w-full"
      >
        {/* anterior */}
        <button
          type="button"
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-3 py-1.5 rounded-md border border-[#43C302]
                        bg-white text-[#2e7d32] text-[13px] font-bold cursor-pointer
                        transition-all duration-200
                        disabled:bg-[#f5f5f5] disabled:text-[#ccc] disabled:cursor-not-allowed
                        max-[420px]:px-2 max-[420px]:text-xs"
        >
          ‹ Anterior
        </button>

        {/* números de página */}
        {paginasVisibles.map((pagina) => (
          <button
            type="button"
            key={pagina}
            onClick={() => onCambiarPagina(pagina)}
            className={[
              "w-8 h-8 rounded-md border text-[13px] cursor-pointer transition-all duration-200",
              "max-[420px]:w-full max-[420px]:h-9",
              pagina === paginaActual
                ? "bg-[#048047] text-[#FFF4E5] border-[#43C302]"
                : "bg-white text-[#048047] border-[#43C302]",
            ].join(" ")}
          >
            {pagina}
          </button>
        ))}

        {/* siguiente */}
        <button
          type="button"
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-1.5 rounded-md border border-[#43C302]
                        bg-white text-[#048047] text-[13px] font-bold cursor-pointer
                        transition-all duration-200
                        disabled:bg-[#f5f5f5] disabled:text-[#ccc] disabled:cursor-not-allowed
                        max-[420px]:px-2 max-[420px]:text-xs"
        >
          Siguiente ›
        </button>
      </div>
    </div>
  );
}
