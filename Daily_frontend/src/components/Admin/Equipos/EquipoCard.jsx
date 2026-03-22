import styles from "../../../assets/css/Admin/Equipos.module.scss";
import { SquarePen } from 'lucide-react';

export default function EquipoCard({ equipo, editarEquipo, eliminarEquipo, onView }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.teamName}>{equipo.nombre}</h2>

                <button
                    onClick={() => editarEquipo(equipo.id)}
                    className={styles.actualizarButton}
                >
                    <SquarePen size={14} />
                </button>
            </div>

            <div className={styles.cardBody}>
                <p className={styles.meta}>
                    Líder:
                    <span className={styles.highlight}>
                        {equipo.lider?.nombre || "Sin líder"}
                    </span>
                </p>

                <p className={styles.meta}>
                    Miembros:
                    <span className={styles.highlight}>
                        {equipo.miembros.length}
                    </span>
                </p>
            </div>

            <div className={styles.cardActions}>
                <button 
                    onClick={onView} 
                    className={styles.viewButton}
                >
                    Ver equipo
                </button>

                <button
                    onClick={() => eliminarEquipo(equipo.id)}
                    className={styles.deleteButton}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}
