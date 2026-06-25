import { Calendar, UserCircle, Clock, ShieldOff } from "lucide-react";
import { useBloqueos } from "../../hooks/useBloqueos";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import Avatar from "./Avatar";
import Cargando from "./Cargando";
import styles from "../../assets/css/Depen/BloqueosList.module.scss";

const SEVERIDAD_VARIANT = {
    Baja: "info",
    Media: "warning",
    Alta: "danger",
    Crítica: "danger",
    Critica: "danger",
};

const ESTADO_VARIANT = {
    Abierto: "warning",
    "En curso": "info",
    Resuelto: "success",
    Cerrado: "neutral",
};

export default function BloqueosList() {
    const { bloqueos, loading } = useBloqueos();

    if (loading) return <Cargando />;

    if (!bloqueos || bloqueos.length === 0) {
        return (
            <EmptyState
                icon={ShieldOff}
                title="Sin bloqueos registrados"
                description="Cuando alguien registre un bloqueo aparecerá aquí."
            />
        );
    }

    return (
        <div className={styles.grid}>
            {bloqueos.map((b) => (
                <Card key={b.id} padding="md" className={styles.card}>
                    <header className={styles.cardHeader}>
                        <span className={styles.tipo}>{b.tipo || "—"}</span>
                        <Badge
                            variant={
                                SEVERIDAD_VARIANT[b.severidad] || "neutral"
                            }
                            size="sm"
                            dot
                        >
                            {b.severidad || "—"}
                        </Badge>
                    </header>

                    {b.notas && <p className={styles.notes}>{b.notas}</p>}

                    <dl className={styles.meta}>
                        <div className={styles.metaRow}>
                            <UserCircle
                                size={14}
                                aria-hidden="true"
                                className={styles.metaIcon}
                            />
                            <dt>Reportó</dt>
                            <dd className={styles.metaValueWithAvatar}>
                                <span>{b.persona?.nombre || "—"}</span>
                                {b.persona?.id && (
                                    <Avatar
                                        Nombre={b.persona.nombre}
                                        userId={b.persona.id}
                                        size="sm"
                                    />
                                )}
                            </dd>
                        </div>

                        <div className={styles.metaRow}>
                            <UserCircle
                                size={14}
                                aria-hidden="true"
                                className={styles.metaIcon}
                            />
                            <dt>Responsable</dt>
                            <dd>{b.responsable?.nombre || "Sin asignar"}</dd>
                        </div>

                        <div className={styles.metaRow}>
                            <Calendar
                                size={14}
                                aria-hidden="true"
                                className={styles.metaIcon}
                            />
                            <dt>Reportado</dt>
                            <dd>{b.dailys?.fecha || "—"}</dd>
                        </div>

                        {b.fecha_limite && (
                            <div className={styles.metaRow}>
                                <Clock
                                    size={14}
                                    aria-hidden="true"
                                    className={styles.metaIcon}
                                />
                                <dt>Vence</dt>
                                <dd>{b.fecha_limite}</dd>
                            </div>
                        )}
                    </dl>

                    <footer className={styles.footer}>
                        <Badge
                            variant={ESTADO_VARIANT[b.estado] || "neutral"}
                            size="sm"
                        >
                            {b.estado || "—"}
                        </Badge>
                    </footer>
                </Card>
            ))}
        </div>
    );
}
