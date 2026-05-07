import styles from "../../../assets/css/Lider/CertificacionesLider.module.scss";

export default function CertificacionesStats({
    categorias = [],
    personas = [],
    getRanking,
    categoriaActiva,
    setCategoriaActiva,
    equipos = [],
    equipoActivo,
    setEquipoActivo,
}) {
    /* =========================
       FILTRO CATEGORÍAS
    ========================= */
    const categoriasFiltradas = categoriaActiva
        ? categorias.filter((c) => c.id === categoriaActiva)
        : categorias;

    /* =========================
       FLATTEN CERTS
    ========================= */
    const certificaciones = categoriasFiltradas.flatMap(
        (cat) => cat.certificaciones || []
    );

    const totalCerts = certificaciones.length;
    const totalPersonas = personas.length;

    /* =========================
       TOTAL ASIGNADAS
    ========================= */
    let totalAsignadas = 0;

    categoriasFiltradas.forEach((cat) => {
        (cat.certificaciones || []).forEach((cert) => {
            totalAsignadas += cert.personas?.size || 0;
        });
    });

    const totalPosible = totalCerts * totalPersonas;

    const porcentajeGlobal =
        totalPosible > 0
            ? Math.round((totalAsignadas / totalPosible) * 100)
            : 0;

    /* =========================
       RANKING (TOP 5)
    ========================= */
    const ranking = typeof getRanking === "function"
        ? getRanking().slice(0, 5)
        : [];

    let vigentes = 0;
    let pendientes = 0;

    categoriasFiltradas.forEach(cat => {
        cat.certificaciones.forEach(cert => {
            cert.personas?.forEach(rel => {
                if (rel.estado === "vigente") vigentes++;
                if (rel.estado === "pendiente") pendientes++;
            });
        });
    });

    return (
        <div className={styles.statsWrapper}>

            {/* FILTROS */}
            <div className={styles.filterContainer}>
                {equipos.length > 1 && (
                    <div className={styles.filters}>
                        <h2 className={styles.titleFilter}>equipos</h2>

                        <button
                            className={!equipoActivo ? styles.active : ""}
                            onClick={() => setEquipoActivo(null)}
                        >
                            Todos
                        </button>

                        {equipos.map(eq => (
                            <button
                                key={eq.id}
                                className={equipoActivo === eq.id ? styles.active : ""}
                                onClick={() => setEquipoActivo(eq.id)}
                            >
                                {eq.nombre}
                            </button>
                        ))}
                    </div>
                )}

                <div className={styles.filters}>
                    <h2 className={styles.titleFilter}>Categorías</h2>

                    <button
                        className={!categoriaActiva ? styles.active : ""}
                        onClick={() => setCategoriaActiva(null)}
                    >
                        Todas
                    </button>

                    {categorias.map(cat => (
                        <button
                            key={cat.id}
                            className={categoriaActiva === cat.id ? styles.active : ""}
                            onClick={() => setCategoriaActiva(cat.id)}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {/* STATS */}
            <div className={styles.statsContainer}>

                <div className={`${styles.cardStat} ${styles.kpiInfo}`}>
                    <span className={styles.cardTitle}>Cobertura</span>
                    <span className={styles.big}>{porcentajeGlobal}%</span>
                    <span className={styles.sub}>
                        {totalAsignadas} / {totalPosible}
                    </span>
                </div>

                <div className={styles.cardStat}>
                    <span className={styles.cardTitle}>Certificaciones</span>
                    <span className={styles.big}>{totalCerts}</span>
                </div>

                <div className={styles.cardStat}>
                    <span className={styles.cardTitle}>Personas</span>
                    <span className={styles.big}>{totalPersonas}</span>
                </div>

                <div className={`${styles.cardStat} ${styles.kpiSuccess}`}>
                    <span className={styles.cardTitle}>Vigentes</span>
                    <span className={styles.big}>{vigentes}</span>
                </div>

                <div className={`${styles.cardStat} ${styles.kpiWarning}`}>
                    <span className={styles.cardTitle}>Pendientes</span>
                    <span className={styles.big}>{pendientes}</span>
                </div>

                <div className={styles.cardStat}>
                    <span className={styles.cardTitle}>Top certificados</span>

                    {ranking.length ? (
                        <ul className={styles.ranking}>
                            {ranking.map(p => (
                                <li key={p.id}>
                                    <span>{p.nombre}</span>
                                    <strong>{p.obtenidas}</strong>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span className={styles.sub}>Sin datos</span>
                    )}
                </div>

            </div>
        </div>
    );
}
