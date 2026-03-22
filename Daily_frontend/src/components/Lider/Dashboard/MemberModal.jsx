import { useState } from "react";
import styles from "../../../assets/css/Lider/LiderDashboard.module.scss";
import CalendarModal from "./CalendarModal";

export default function MemberModal({ member, calendar, onClose }) {
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <>
            <div className={styles.modalOverlay} onClick={onClose}>
                <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>
                            {member.nombre}
                        </h3>

                        <button onClick={onClose} className={styles.closeButton}>
                            ✕
                        </button>
                    </div>

                    {/* INFO GENERAL */}
                    <div className={styles.memberInfo}>
                        <p>
                            <strong>Proyecto:</strong>{" "}
                            {member.proyecto || "Sin asignar"}
                        </p>

                        <p>
                            <strong>Ocupación:</strong>{" "}
                            {member.ocupacion_porcentaje || 0}%
                        </p>

                        <p>
                            <strong>Hoy:</strong>{" "}
                            {member.que_hare_hoy || "—"}
                        </p>

                        {member.bloqueos_texto && (
                            <p className={styles.blocker}>
                                🚨 {member.bloqueos_texto}
                            </p>
                        )}
                    </div>

                    {/* ACCIÓN */}
                    <div className={styles.modalActions}>
                        <button
                            className={styles.primaryBtn}
                            onClick={() => setShowCalendar(true)}
                        >
                            Ver historial / calendario
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL 2 */}
            {showCalendar && (
                <CalendarModal
                    calendar={calendar}
                    onClose={() => setShowCalendar(false)}
                />
            )}
        </>
    );
}