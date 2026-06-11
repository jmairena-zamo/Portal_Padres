//creado por Diego Castro
//Componente de input

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  esValido?: boolean;
}

export function Input({ esValido = true, className = "", ...props }: Props) {
  return (
    <input
      className={[
        "px-2 py-2 border rounded-sm outline-none",
        esValido ? "border-[#ddd]" : "border-[#F54927]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
