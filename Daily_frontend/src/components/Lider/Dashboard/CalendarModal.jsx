import { useState, useMemo } from "react";
import {
    CalendarDays,
    AlertTriangle,
    CheckCircle2,
    Rocket,
    FilterX,
} from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { EmptyState } from "../../ui/EmptyState";
import styles from "../../../assets/css/Lider/CalendarModal.module.scss";

function formatShort(iso) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            timeZone: "UTC",
        });
    } catch {
        return iso;
    }
}

export default function CalendarModal({ calendar, onClose }) {
    const [selectedDay, setSelectedDay] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const filtered = useMemo(() => {
        return (calendar || []).filter((d) => {
            if (!startDate && !endDate) return true;
            const date = new Date(d.fecha);
            if (startDate && date < new Date(startDate)) return false;
            if (endDate && date > new Date(endDate)) return false;
            return true;
        });
    }, [calendar, startDate, endDate]);

    const hasFilter = startDate || endDate;

    return (
        <Modal
            open
            onClose={onClose}
            title="Historial de dailys"
            description="Filtra por fechas y selecciona un día para ver el detalle."
            size="lg"
        >
            <div className={styles.layout}>
                <div className={styles.filters}>
                    <Input
                        type="date"
                        label="Desde"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                        type="date"
                        label="Hasta"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    {hasFilter && (
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={FilterX}
                            onClick={() => {
                                setStartDate("");
                                setEndDate("");
                            }}
                            className={styles.clearBtn}
                        >
                            Limpiar
                        </Button>
                    )}
                </div>

                {filtered.length === 0 ? (
                    <EmptyState
                        icon={CalendarDays}
                        title="No hay dailys en ese rango"
                        description="Ajusta las fechas o limpia los filtros."
                    />
                ) : (
                    <div className={styles.split}>
                        <div className={styles.daysGrid}>
                            {filtered.map((d) => {
                                const active = selectedDay?.id === d.id;
                                return (
                                    <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => setSelectedDay(d)}
                                        className={`${styles.day} ${active ? styles.active : ""}`}
                                        aria-pressed={active}
                                    >
                                        <span className={styles.dayDate}>
                                            {formatShort(d.fecha)}
                                        </span>
                                        {d.bloqueos_texto && (
                                            <AlertTriangle
                                                size={11}
                                                className={styles.dayBadge}
                                                aria-label="con bloqueo"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <aside
                            className={`${styles.detail} ${!selectedDay ? styles.empty : ""}`}
                        >
                            {selectedDay ? (
                                <>
                                    <h4 className={styles.detailTitle}>
                                        {selectedDay.fecha}
                                    </h4>
                                    <div className={styles.detailField}>
                                        <span className={styles.fieldLabel}>
                                            <CheckCircle2
                                                size={14}
                                                aria-hidden="true"
                                            />
                                            Ayer
                                        </span>
                                        <p>{selectedDay.que_hice_ayer || "—"}</p>
                                    </div>
                                    <div className={styles.detailField}>
                                        <span className={styles.fieldLabel}>
                                            <Rocket size={14} aria-hidden="true" />
                                            Hoy
                                        </span>
                                        <p>{selectedDay.que_hare_hoy || "—"}</p>
                                    </div>
                                    {selectedDay.bloqueos_texto && (
                                        <div className={styles.detailField}>
                                            <span
                                                className={`${styles.fieldLabel} ${styles.warningLabel}`}
                                            >
                                                <AlertTriangle
                                                    size={14}
                                                    aria-hidden="true"
                                                />
                                                Bloqueos
                                            </span>
                                            <p className={styles.warningText}>
                                                {selectedDay.bloqueos_texto}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className={styles.placeholder}>
                                    Selecciona un día para ver el detalle.
                                </p>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </Modal>
    );
}
