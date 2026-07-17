// Creado por Diego Castro
// Componente de Label
// Muestra un label para un input

// Props para el componente Label
interface Props {
  nombre: string;
  htmlFor?: string;
}

export function Label({ nombre, htmlFor }: Props) {
  return (
    <label htmlFor={htmlFor} className="text-[#555555] font-bold">
      {nombre}
    </label>
  );
}
