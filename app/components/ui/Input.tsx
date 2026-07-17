//creado por Diego Castro
//Componente de input

// Props para el componente Input
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  esValido?: boolean;
}

export function Input({ esValido = true, className = "", ...props }: Props) {
  return (
    <input
      className={[
        "px-2 py-2 border rounded-md outline-none placeholder:text-gray-400",
        esValido ? "border-[#ddd]" : "border-[#F54927]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
