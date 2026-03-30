import { useMiDashboard } from "../../hooks/useMiDashboard";
import styles from "../../assets/css/Miembro/Dashboard.module.scss";

import { User, CalendarDays, AlertTriangle } from "lucide-react";
import Cargando from "../../components/Depen/Cargando";

export default function MemberDashboard() {
    const { user, today, calendar, loading } = useMiDashboard();

    if (loading) return <Cargando />;

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Mi Dashboard</h2>

            {/* INFO USUARIO */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <User size={18} />
                    <h3>{user?.nombre}</h3>
                </div>

                <p>Email: {user?.correo}</p>
                <p>Capacidad semanal: {user?.capacidad_horas_semana} h</p>
            </div>

            {/* HOY */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <CalendarDays size={18} />
                    <h3>Hoy</h3>
                </div>

                {today ? (
                    <>
                        <p>
                            <strong>Ayer:</strong> {today.que_hice_ayer}
                        </p>

                        <p>
                            <strong>Hoy:</strong> {today.que_hare_hoy}
                        </p>

                        {today.bloqueos_texto && (
                            <p className={styles.blocker}>
                                <AlertTriangle size={14} />{" "}
                                {today.bloqueos_texto}
                            </p>
                        )}
                    </>
                ) : (
                    <p className={styles.placeholder}>
                        No has registrado tu daily hoy
                    </p>
                )}
            </div>

            {/* HISTORIAL */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <CalendarDays size={18} />
                    <h3>Últimos días</h3>
                </div>

                <div className={styles.history}>
                    {calendar.map((d) => (
                        <div key={d.id} className={styles.historyItem}>
                            <span className={styles.date}>{d.fecha}</span>

                            <p>{d.que_hare_hoy}</p>

                            {d.bloqueos_texto && (
                                <span className={styles.badge}>
                                    <AlertTriangle size={12} />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
