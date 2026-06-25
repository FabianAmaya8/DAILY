import { AlertTriangle, FolderKanban, Activity } from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import Avatar from "../../Depen/Avatar";
import styles from "../../../assets/css/Lider/MemberCard.module.scss";

function ocupacionVariant(pct) {
    if (pct == null) return "neutral";
    if (pct > 100) return "danger";
    if (pct >= 85) return "warning";
    if (pct >= 50) return "success";
    return "info";
}

export default function MemberCard({ member, onClick }) {
    const ocupacion = member.ocupacion_porcentaje ?? 0;

    return (
        <Card
            interactive
            padding="md"
            onClick={onClick}
            className={styles.card}
            as="button"
            type="button"
            aria-label={`Abrir detalle de ${member.nombre}`}
        >
            <header className={styles.cardHeader}>
                <Avatar
                    Nombre={member.nombre}
                    userId={member.id}
                    size="md"
                />
                <div className={styles.headerText}>
                    <h3 className={styles.name}>{member.nombre}</h3>
                    {member.proyecto && (
                        <span className={styles.project}>
                            <FolderKanban size={11} aria-hidden="true" />
                            {member.proyecto}
                        </span>
                    )}
                </div>
            </header>

            <div className={styles.statsRow}>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>
                        <Activity size={11} aria-hidden="true" />
                        Ocupación
                    </span>
                    <Badge variant={ocupacionVariant(ocupacion)} size="sm">
                        {ocupacion}%
                    </Badge>
                </div>
            </div>

            {member.que_hare_hoy && (
                <p className={styles.today}>
                    <span className={styles.todayLabel}>Hoy</span>
                    {member.que_hare_hoy}
                </p>
            )}

            {member.bloqueos_texto && (
                <p className={styles.blocker}>
                    <AlertTriangle size={12} aria-hidden="true" />
                    {member.bloqueos_texto}
                </p>
            )}
        </Card>
    );
}
