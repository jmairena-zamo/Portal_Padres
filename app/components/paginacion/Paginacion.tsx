import styles from "./Paginacion.module.css";

interface Props {
    totalRegistros: number;
    registrosPorPagina: number;
    paginaActual: number;
    onCambiarPagina: (pagina: number) => void;
    onCambiarRegistrosPorPagina: (cantidad: number) => void;
}

const OPCIONES_FILAS = [5, 10, 25, 50];

export default function Paginacion({
    totalRegistros,
    registrosPorPagina,
    paginaActual,
    onCambiarPagina,
    onCambiarRegistrosPorPagina
}: Props) {

    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

    if (totalPaginas <= 1 && totalRegistros <= OPCIONES_FILAS[0]) return null;

    const paginas = [];
    for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
    }

    let paginasVisibles = paginas;

    if (totalPaginas > 5) {
        const inicio = Math.max(1, paginaActual - 2);
        const fin = Math.min(totalPaginas, inicio + 4);
        paginasVisibles = paginas.slice(inicio - 1, fin);
    }

    return (
        <div className={styles.container}>

            <div className={styles.info}>

                <div className={styles.selector}>
                    <span>Filas por página:</span>

                    <select
                        value={registrosPorPagina}
                        onChange={(e) => {
                            onCambiarRegistrosPorPagina(Number(e.target.value));
                            onCambiarPagina(1);
                        }}
                    >
                        {OPCIONES_FILAS.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>

                <span className={styles.registros}>
                    Mostrando{" "}
                    {Math.min(
                        (paginaActual - 1) * registrosPorPagina + 1,
                        totalRegistros
                    )}
                    {" – "}
                    {Math.min(
                        paginaActual * registrosPorPagina,
                        totalRegistros
                    )}
                    {" de "}
                    {totalRegistros}
                </span>

            </div>

            <div className={styles.botones}>

                <button
                    onClick={() => onCambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className={styles.navButton}
                >
                    ‹ Anterior
                </button>

                {paginasVisibles.map((pagina) => (
                    <button
                        key={pagina}
                        onClick={() => onCambiarPagina(pagina)}
                        className={`${styles.numero} ${
                            pagina === paginaActual ? styles.activo : ""
                        }`}
                    >
                        {pagina}
                    </button>
                ))}

                <button
                    onClick={() => onCambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className={styles.navButton}
                >
                    Siguiente ›
                </button>

            </div>

        </div>
    );
}