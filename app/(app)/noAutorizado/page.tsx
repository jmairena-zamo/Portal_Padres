//Creado por Diego Castro
//Pagina que se muestra cuando no se tiene acceso 
// o no se esta autorizado para ingresar a una pagna

export default function NoAutorizado() {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>🚫 Acceso No Autorizado</h2>
            <p>No tienes permiso para acceder a esta página.</p>
            {/* <a href="/resumenEstudiante">Volver al inicio</a> */}
        </div>
    );
}