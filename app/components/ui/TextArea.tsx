interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  esValido?: boolean;
}

export function TextArea({ esValido = true, className = "", ...props }: Props) {
  return (
    <textarea
      className={[
        "px-2 py-2 border rounded-sm outline-none resize-y min-h-20",
        esValido ? "border-[#ddd]" : "border-[#F54927]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
