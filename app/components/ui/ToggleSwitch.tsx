//Componente creado por Diego Castr
// componente tipo switch para el cambio de habilitado a deshabilitado
// y viceversa

interface Props {
  checked: boolean;
  onChange: () => void;
}

export function ToggleSwitch({ checked, onChange }: Props) {
  return (
    <>
      <style>{`
                .toggle-slider { position:absolute; cursor:pointer; inset:0; background-color:#ccc; transition:.3s; border-radius:3px; }
                .toggle-slider:before { position:absolute; content:""; height:12px; width:15px; left:4px; bottom:4px; background-color:white; transition:.2s; border-radius:3px; }
                .toggle-input:checked + .toggle-slider { background-color:#0055b6; }
                .toggle-input:checked + .toggle-slider:before { transform:translateX(26px); }
            `}</style>
      <label className="relative inline-block w-12.5 h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="toggle-input opacity-0 w-0 h-0"
        />
        <span className="toggle-slider" />
      </label>
    </>
  );
}
