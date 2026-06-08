//Componente creado por Diego Castro
//Componente de selector de iconos utilizado en la creacion o modificación de opciones de menu

import styles from "./selectorIconos.module.css";
import { 
  FaHome, FaUser, FaCog, FaSignOutAlt, FaChartBar, 
  FaBook, FaEnvelope, FaBell, FaCalendarAlt, FaUsers, 
  FaClipboardCheck,
  FaFile,
  FaCoins,
  FaFileAlt,
  FaFolder
} from "react-icons/fa";

interface IconSelectorProps {
  selectedIcon: string; //Nombre del icono actual
  onSelect: (iconName: string) => void; //Recibe el nombre del icono cuando el usuario seleccina uno
}

//Lista de iconos disponibles para seleccionar
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

//Se muestran visualmente los iconos para que el usuario elija uno
//El icono seleccionado cambia su style 
export default function IconSelector({ selectedIcon, onSelect }: IconSelectorProps) {
  return (
    <div className={styles.iconGrid}>
      {iconOptions.map((icon) => {
        const IconComp = icon.component;
        return (
          <button
            key={icon.name}
            type="button"
            //Cambia de estilo cuando esta seleccionado
            className={`${styles.iconBtn} ${
              selectedIcon === icon.name ? styles.iconSelected : ""
            }`}
            onClick={() => onSelect(icon.name)}
          >
            <IconComp />
          </button>
        );
      })}
    </div>
  );
}
