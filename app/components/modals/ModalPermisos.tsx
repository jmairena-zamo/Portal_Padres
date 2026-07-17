// Componente creado por Diego Castro
// Componente para el modal permisos roles

import { Rol } from "@/app/interfaces/menus";

// Props para el componente ModalPermisos
interface Props {
  titulo: string;
  roles: Rol[];
  rolesSeleccionados: number[];
  onToggle: (idRol: number) => void;
  onGuardar: () => void;
  onCancelar: () => void;
  guardando: boolean;
}

// Modal para asignar o quitar roles en un menú o submenú
export default function ModalPermisos({
  titulo,
  roles,
  rolesSeleccionados,
  onToggle,
  onGuardar,
  onCancelar,
  guardando,
}: Props) {
  const rolesSeleccionadosSet = new Set(rolesSeleccionados);
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-1000">
      <div
        className="
                bg-white border-2 border-[#048047] rounded-[10px]
                shadow-[0px_3px_5px_3px_rgba(0,0,0,0.3)]
                p-7.5 w-100
                max-[800px]:w-[calc(100%-32px)]
            "
      >
        {/* encabezado */}
        <div className="bg-[#008237] text-[#FFF4E5] rounded-t-[5px] mb-6.25">
          <h2 className="py-1.25 text-[18px] text-center">Permisos</h2>
          <h2 className="py-1.25 text-[18px] text-center">{titulo}</h2>
        </div>

        {/* lista de roles con checkbox */}
        <div
          className="
                    flex flex-col h-62.5 overflow-y-auto
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-thumb]:bg-[#008237]
                    [&::-webkit-scrollbar-thumb]:rounded-[20px]
                "
        >
          {roles.map((rol) => (
            <label
              key={rol.iD_Rol}
              className="flex justify-between px-3.75 py-2.5 border-b border-black cursor-pointer"
            >
              <span>{rol.rol}</span>
              <input
                type="checkbox"
                checked={rolesSeleccionadosSet.has(rol.iD_Rol)}
                onChange={() => onToggle(rol.iD_Rol)}
              />
            </label>
          ))}
        </div>

        {/* botones */}
        <div className="flex gap-2.5 justify-end mt-5">
          <button
            type="button"
            onClick={onGuardar}
            disabled={guardando}
            className="
                            bg-[#008237] text-white border-none rounded-[5px]
                            w-25 py-1.5 cursor-pointer
                            hover:bg-[#005221] disabled:opacity-50 disabled:cursor-not-allowed
                        "
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            disabled={guardando}
            className="
                            bg-[#a11313] text-white border-none rounded-[5px]
                            w-25 py-1.5 cursor-pointer
                            hover:bg-[#610c0c] disabled:opacity-50 disabled:cursor-not-allowed
                        "
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
