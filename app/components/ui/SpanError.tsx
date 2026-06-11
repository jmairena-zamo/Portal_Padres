interface SpanErrorProps {
  visible: boolean; // controla visibility sin afectar el layout
  mensaje?: string;
}

export function SpanError({
  visible,
  mensaje = "El campo no es válido",
}: SpanErrorProps) {
  return (
    <span
      className={[
        "text-[10px] text-red-500 mt-1 h-3 text-center",
        visible ? "visible" : "invisible",
      ].join(" ")}
    >
      {mensaje}
    </span>
  );
}
