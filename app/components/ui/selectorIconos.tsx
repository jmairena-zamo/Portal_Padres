// Componente creado por Diego Castro
// Componente de selector de iconos utilizado en la creación o modificación de opciones de menú

import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChartBar,
  FaBook,
  FaEnvelope,
  FaBell,
  FaCalendarAlt,
  FaUsers,
  FaClipboardCheck,
  FaFile,
  FaCoins,
  FaFileAlt,
  FaFolder,
} from "react-icons/fa";

interface SelectorIconosProps {
  selectedIcon: string; // nombre del icono actual
  onSelect: (iconName: string) => void; // recibe el nombre al seleccionar
}

// Lista de iconos disponibles para seleccionar
export const iconOptions = [
  { name: "FaHome", component: FaHome },
  { name: "FaUser", component: FaUser },
  { name: "FaCog", component: FaCog },
  { name: "FaSignOutAlt", component: FaSignOutAlt },
  { name: "FaChartBar", component: FaChartBar },
  { name: "FaBook", component: FaBook },
  { name: "FaEnvelope", component: FaEnvelope },
  { name: "FaBell", component: FaBell },
  { name: "FaCalendarAlt", component: FaCalendarAlt },
  { name: "FaUsers", component: FaUsers },
  { name: "FaFile", component: FaFile },
  { name: "FaCoins", component: FaCoins },
  { name: "FaFileAlt", component: FaFileAlt },
  { name: "FaFolder", component: FaFolder },
];

// Muestra visualmente los iconos para que el usuario elija uno
// El icono seleccionado cambia su estilo
export default function SelectorIconos({
  selectedIcon,
  onSelect,
}: SelectorIconosProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))] gap-2.5 mt-2.5">
      {iconOptions.map((icon) => {
        const IconComp = icon.component;
        const isSelected = selectedIcon === icon.name;

        return (
          <button
            key={icon.name}
            type="button"
            onClick={() => onSelect(icon.name)}
            className={[
              "flex justify-center items-center rounded-lg p-2 cursor-pointer text-[18px] transition-colors",
              isSelected
                ? "bg-[#048047] text-[#FFF4E5] border-2 border-[#43C302]"
                : "bg-[#f3f4f6] border border-[#ccc] hover:bg-[#e5e7eb]",
            ].join(" ")}
          >
            <IconComp />
          </button>
        );
      })}
    </div>
  );
}
