// Creado por Diego Castro
// Componente de Titulo

// Props para el compoennte de Titulo
// alineado recibe un numero para especificar a que lado debe ir el titulo
interface Props {
  titulo: string;
  alineado: number; // 1 centro, 2 derecha, 3 izquierza
}

export function Titulo({ titulo, alineado }: Props) {
  return (
    <h2
      className={[
        "font-bold text-[20px] text-[#173426] max-[420px]:text-[17px]",
        alineado === 1
          ? "text-center"
          : alineado === 2
            ? "text-right"
            : alineado === 3
              ? "text-left"
              : "",
      ].join(" ")}
    >
      {titulo}
    </h2>
  );
}
