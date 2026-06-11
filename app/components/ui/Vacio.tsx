//Componete creado por Diego Castro
//Componente para mostrar cuando no hay datos en alguna peticion

interface DataVacia {
  titulo?: string;
  descripcion?: string;
}

export default function Vacio({titulo, descripcion}: DataVacia){
    return(
        <div className="flex flex-col items-center justify-center my-[50px]">
            <h2>{titulo}</h2>
            <h3>{descripcion}</h3>
        </div>
    )
}