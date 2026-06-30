// Componete creado por Diego Castro
// Componente para mostrar cuando no hay datos en alguna peticion
// Componente tambien utilizado para errores

import { BtnPrimario } from "./Boton";

interface DataVacia {
  titulo?: string;
  descripcion?: string;
  onReintentar?: () => void;
}

export default function Vacio({
  titulo,
  descripcion,
  onReintentar,
}: DataVacia) {
  return (
    <div className="flex flex-col items-center justify-center my-12.5">
      <h2 className="text-2xl">{titulo}</h2>
      <h3>{descripcion}</h3>
      <br />
      {onReintentar && (
        <BtnPrimario onClick={onReintentar}>Reintentar</BtnPrimario>
      )}
    </div>
  );
}
