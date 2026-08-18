// Creado por Diego Castro
// Componente para agrupar los elementos de historial academico por su año y periodo
// Se mostrara la informacion de cada clase, como el codigo, nombre de la materia, seccion, periodo y nota

import { FilaHistorial } from "@/app/interfaces/historialAcademico";

interface AgruparProps {
  anio: string;
  periodo: string;
  clases: FilaHistorial[];
  promedio: number;
}

export function Agrupar(grupo: AgruparProps) {
  return (
    <section
      key={`${grupo.anio}-${grupo.periodo}`}
      className="border border-slate-200 rounded-xl overflow-hidden bg-white"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 px-4 py-3 bg-[#048047] border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-[#FFF4E5]">
            AÑO {grupo.anio} - PERÍODO {grupo.periodo}
          </h3>
        </div>
      </div>

      <div>
        <div className="divide-y divide-slate-200">
          {grupo.clases.map((clase) => (
            <div
              key={`${clase.cursoCodigo}-${clase.cursoNombre}`}
              className="flex flex-col gap-3 px-4 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#30545B]">
                  {clase.cursoCodigo}
                </p>
                <p className="mt-1 text-base font-semibold text-[#173426]">
                  {clase.cursoNombre}
                </p>
              </div>

              <div className="flex flex-col items-start justify-between gap-0.5 sm:justify-end sm:items-end">
                <span
                  className={`inline-flex min-w-18 justify-center rounded-full px-2.5 py-1 text-sm font-bold ${
                    Number(clase.calificacion) < 60
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-[#30545B]"
                  }`}
                >
                  Calificación final: {clase.calificacion}%
                </span>
                <div>
                  <span className="text-sm text-[#30545B] px-2.5">
                    {clase.letra}
                  </span>
                  <span className="text-sm text-[#30545B] px-2.5">
                    Créditos: {clase.creditos}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
          <span className="text-sm font-semibold text-slate-600">
            Promedio del período:
          </span>
          <span
            className={`inline-flex min-w-18 justify-center rounded-full px-2.5 py-1 text-sm font-bold ${
              grupo.promedio < 60
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {grupo.promedio.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
}
