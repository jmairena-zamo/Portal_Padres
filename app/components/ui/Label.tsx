interface Props {
  nombre: string;
}

export function Label({ nombre }: Props) {
  return <label className="text-[#555555] font-bold">{nombre}</label>;
}
