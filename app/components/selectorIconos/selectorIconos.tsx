import React from "react";
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
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

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

export default function IconSelector({ selectedIcon, onSelect }: IconSelectorProps) {
  return (
    <div className={styles.iconGrid}>
      {iconOptions.map((icon) => {
        const IconComp = icon.component;
        return (
          <button
            key={icon.name}
            type="button"
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
