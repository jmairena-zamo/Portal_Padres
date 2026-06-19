// Botones reutilizables del sistema - Diego Castro / PracticanteIT2
// BtnPrimario: confirmar/aceptar/editar | BtnPeligro: eliminar/cancelar | BtnOutline: acciones secundarias

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface BtnTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  activa: boolean; // si esta tab está seleccionada
}

// Base común — evita repetir las mismas clases en los 2 botones
const base =
  "flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-white cursor-pointer border-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] max-sm:min-w-[80px] max-[420px]:min-w-[50px] max-sm:text-[12px] max-sm:px-2";

// Aceptar, editar, confirmar
export const BtnPrimario = ({ children, ...props }: Props) => (
  <button className={`${base} bg-[#008237] hover:bg-[#005221] `} {...props}>
    {children}
  </button>
);

// Eliminar, cancelar
export const BtnPeligro = ({ children, ...props }: Props) => (
  <button className={`${base} bg-[#a11313] hover:bg-[#610c0c]`} {...props}>
    {children}
  </button>
);

// Acción secundaria (ej: gestionar roles)
export const BtnOutline = ({ children, ...props }: Props) => (
  <button
    className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] 
            cursor-pointer transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed min-w-25 
            max-sm:min-w-20 max-[420px]:min-w-12.5 max-sm:text-[12px] 
            max-sm:px-2 bg-white border border-[#008237] text-[#008237] hover:bg-[#f0faf4]`}
    {...props}
  >
    {children}
  </button>
);

export const BtnTab = ({ activa, children, ...props }: BtnTabProps) => (
  <button
    className={`bg-white border-none px-2.5 py-1.25 shadow-[0px_0px_5px_2px_rgba(0,0,0,0.2)]
      rounded-t-[5px] hover:text-[#005221] cursor-pointer
      max-[420px]:flex-1 max-[420px]:text-[13px] max-[420px]:text-center
      ${activa ? "text-[#005221] border-b-2 border-[#005221] font-bold" : ""}`}
    {...props}
  >
    {children}
  </button>
);
