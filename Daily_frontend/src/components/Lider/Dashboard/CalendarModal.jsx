import { useState, useMemo } from "react";
import {
    X,
    CalendarDays,
    AlertTriangle,
    CheckCircle2,
    Rocket,
} from "lucide-react";

import styles from "../../../assets/css/Lider/LiderDashboard.module.scss";

export default function CalendarModal({ calendar, onClose }) {
    const [selectedDay, setSelectedDay] = useState(null);

    // 🆕 filtros
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // 🧠 filtrar calendario
    const filteredCalendar = useMemo(() => {
        return calendar.filter((d) => {
            if (!startDate && !endDate) return true;

            const date = new Date(d.fecha);

            if (startDate && date < new Date(startDate)) return false;
            if (endDate && date > new Date(endDate)) return false;

            return true;
        });
    }, [calendar, startDate, endDate]);

                        console.log("🚀 ~ CalendarModal ~ filteredCalendar:", filteredCalendar)
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        <CalendarDays size={18} /> Calendario
                    </h3>

                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={18} />
                    </button>
                </div>

                {/* 🔍 FILTROS */}
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>Desde</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Hasta</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    {(startDate || endDate) && (
                        <button
                            className={styles.clearFilter}
                            onClick={() => {
                                setStartDate("");
                                setEndDate("");
                            }}
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                <div className={styles.calendar}>
                    {/* GRID */}
                    <div className={styles.calendarGrid}>
                        {filteredCalendar.map((d) => (
                            <div
                                key={d.id}
                                className={`${styles.calendarDay} ${
                                    selectedDay?.id === d.id
                                        ? styles.activeDay
                                        : ""
                                }`}
                                onClick={() => setSelectedDay(d)}
                            >
                                <span className={styles.dayDate}>
                                    {new Date(d.fecha).toLocaleDateString(
                                        "es-ES",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            timeZone: "UTC",
                                        },
                                    )}
                                </span>

                                {d.bloqueos_texto && (
                                    <span className={styles.dayBadge}>
                                        <AlertTriangle size={12} />
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* DETALLE */}
                    <div
                        className={`${styles.dayDetail} ${
                            !selectedDay ? styles.emptyDetail : ""
                        }`}
                    >
                        {selectedDay ? (
                            <>
                                <h4 className={styles.detailTitle}>
                                    {selectedDay.fecha}
                                </h4>

                                <div className={styles.detailContent}>
                                    <p>
                                        <CheckCircle2 size={20} />{" "}
                                        <strong>Ayer:</strong>{" "}
                                        {selectedDay.que_hice_ayer}
                                    </p>

                                    <p>
                                        <Rocket size={20} />{" "}
                                        <strong>Hoy:</strong>{" "}
                                        {selectedDay.que_hare_hoy}
                                    </p>

                                    {selectedDay.bloqueos_texto && (
                                        <p className={styles.blockerText}>
                                            <AlertTriangle size={20} />{" "}
                                            {selectedDay.bloqueos_texto}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className={styles.placeholder}>
                                Selecciona un día para ver el detalle
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
