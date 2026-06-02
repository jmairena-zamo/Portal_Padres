interface Props {
    totalRegistros: number;
    registrosPorPagina: number;
    paginaActual: number;
    onCambiarPagina: (pagina: number) => void;
}

export default function Paginacion({ totalRegistros, registrosPorPagina, paginaActual, onCambiarPagina }: Props) {
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

    if (totalPaginas <= 1) return null;

    const paginas = [];
    for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
    }

    // Mostrar máximo 5 páginas
    let paginasVisibles = paginas;
    if (totalPaginas > 5) {
        const inicio = Math.max(1, paginaActual - 2);
        const fin = Math.min(totalPaginas, inicio + 4);
        paginasVisibles = paginas.slice(inicio - 1, fin);
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderTop: '1px solid #e8f5e9',
            backgroundColor: 'white',
            borderRadius: '0 0 12px 12px'
        }}>
            {/* Info */}
            <span style={{ fontSize: '13px', color: '#888' }}>
                Mostrando {Math.min((paginaActual - 1) * registrosPorPagina + 1, totalRegistros)}
                {' '}—{' '}
                {Math.min(paginaActual * registrosPorPagina, totalRegistros)}
                {' '}de {totalRegistros} registros
            </span>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {/* Anterior */}
                <button
                    onClick={() => onCambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #c8e6c9',
                        backgroundColor: paginaActual === 1 ? '#f5f5f5' : 'white',
                        color: paginaActual === 1 ? '#ccc' : '#2e7d32',
                        cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    ‹ Anterior
                </button>

                {/* Números */}
                {paginasVisibles.map((pagina) => (
                    <button
                        key={pagina}
                        onClick={() => onCambiarPagina(pagina)}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: '1px solid',
                            borderColor: pagina === paginaActual ? '#2e7d32' : '#c8e6c9',
                            backgroundColor: pagina === paginaActual ? '#2e7d32' : 'white',
                            color: pagina === paginaActual ? 'white' : '#2e7d32',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: pagina === paginaActual ? 'bold' : 'normal'
                        }}
                    >
                        {pagina}
                    </button>
                ))}

                {/* Siguiente */}
                <button
                    onClick={() => onCambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #c8e6c9',
                        backgroundColor: paginaActual === totalPaginas ? '#f5f5f5' : 'white',
                        color: paginaActual === totalPaginas ? '#ccc' : '#2e7d32',
                        cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold'
                    }}
                >
                    Siguiente ›
                </button>
            </div>
        </div>
    );
}