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
