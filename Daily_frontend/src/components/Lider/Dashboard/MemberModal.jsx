import { useState } from "react";
import { CalendarDays, Activity, FolderKanban } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import Avatar from "../../Depen/Avatar";
import CalendarModal from "./CalendarModal";
import styles from "../../../assets/css/Lider/MemberModal.module.scss";

function ocupacionVariant(pct) {
    if (pct == null) return "neutral";
    if (pct > 100) return "danger";
    if (pct >= 85) return "warning";
    if (pct >= 50) return "success";
    return "info";
}

export default function MemberModal({ member, calendar, onClose }) {
    const [showCalendar, setShowCalendar] = useState(false);
    const ocupacion = member.ocupacion_porcentaje ?? 0;

    return (
        <>
            <Modal
                open
                onClose={onClose}
                title={member.nombre}
                description={member.proyecto || "Sin proyecto asignado"}
                size="md"
                footer={
                    <Button
                        variant="primary"
                        leftIcon={CalendarDays}
                        onClick={() => setShowCalendar(true)}
                    >
                        Ver historial
                    </Button>
                }
            >
                <div className={styles.body}>
                    <header className={styles.identity}>
                        <Avatar
                            Nombre={member.nombre}
                            userId={member.id}
                            size="xl"
                        />
                        <div className={styles.tags}>
                            {member.proyecto && (
                                <Badge variant="neutral" size="sm">
                                    <FolderKanban size={11} aria-hidden="true" />
                                    {member.proyecto}
                                </Badge>
                            )}
                            <Badge variant={ocupacionVariant(ocupacion)} size="sm">
                                <Activity size={11} aria-hidden="true" />
                                {ocupacion}% ocupación
                            </Badge>
                        </div>
                    </header>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Hoy</h3>
                        <p className={styles.text}>
                            {member.que_hare_hoy || (
                                <span className={styles.muted}>
                                    No registró daily hoy.
                                </span>
                            )}
                        </p>
                    </section>

                    {member.bloqueos_texto && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Bloqueos abiertos</h3>
                            <p className={styles.blocker}>{member.bloqueos_texto}</p>
                        </section>
                    )}
                </div>
            </Modal>

            {showCalendar && (
                <CalendarModal
                    calendar={calendar}
                    onClose={() => setShowCalendar(false)}
                />
            )}
        </>
    );
}
