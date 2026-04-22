import { useBloqueos } from "../../hooks/useBloqueos";
import styles from "../../assets/css/Miembro/Bloqueos.module.scss";
import Avatar from "./Avatar";
import Cargando from "./Cargando";

export default function BloqueosList() {
    const { bloqueos, loading } = useBloqueos();

    if (loading) return <Cargando />;

    if (!bloqueos.length) {
        return <p>No hay bloqueos registrados</p>;
    }

    return (
        <div className={styles.grid}>
            {bloqueos.map((b) => (
                <div key={b.id} className={styles.card}>
                    <div className={styles.header}>
                        <span className={styles.tipo}>{b.tipo}</span>
                        <span
                            className={`${styles.badge} ${styles[b.severidad.toLowerCase()]}`}
                        >
                            {b.severidad}
                        </span>
                    </div>

                    <p className={styles.meta + " " + styles.author}>
                        {b.persona?.nombre || "—"}
                        <Avatar Nombre={b.persona?.nombre} userId={b.persona?.id} /> 
                    </p>

                    <p className={styles.meta}>
                        🧑‍🔧 Responsable: {b.responsable?.nombre || "Sin asignar"}
                    </p>

                    <p className={styles.meta}>
                        📅 {b.dailys?.fecha || "—"}
                    </p>

                    {b.fecha_limite && (
                        <p className={styles.meta}>
                            ⏳ Límite: {b.fecha_limite}
                        </p>
                    )}

                    {b.notas && (
                        <p className={styles.notes}>
                            {b.notas}
                        </p>
                    )}

                    <div className={styles.footer}>
                        <span className={styles.estado}>
                            {b.estado}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}