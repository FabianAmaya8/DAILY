import { Link } from "react-router-dom";
import {
    User,
    CalendarDays,
    AlertTriangle,
    Mail,
    Clock,
    Plus,
    CheckCircle2,
    History,
    AlertOctagon,
} from "lucide-react";
import { useMiDashboard } from "../../hooks/useMiDashboard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import styles from "../../assets/css/Miembro/Dashboard.module.scss";

function formatDateLong(iso) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleDateString("es-ES", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        });
    } catch {
        return iso;
    }
}

function DailySkeleton() {
    return (
        <div className={styles.skeletonGrid}>
            <Skeleton variant="rect" height={120} />
            <Skeleton variant="rect" height={180} />
            <Skeleton variant="rect" height={240} />
        </div>
    );
}

export default function MemberDashboard() {
    const { user, today, calendar, loading, error } = useMiDashboard();

    if (loading) {
        return (
            <div className={styles.page}>
                <header className={styles.pageHeader}>
                    <Skeleton variant="text" width={180} height="2rem" />
                </header>
                <DailySkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <EmptyState
                    icon={AlertOctagon}
                    title="No se pudo cargar tu dashboard"
                    description={error.message || "Inténtalo de nuevo en unos segundos."}
                />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Page header */}
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>
                        Hola, {user?.nombre?.split(" ")[0] || "👋"}
                    </h1>
                    <p className={styles.subtitle}>
                        Tu visibilidad del día y de la última semana.
                    </p>
                </div>
                <Button
                    as="a"
                    variant={today ? "secondary" : "primary"}
                    leftIcon={today ? CheckCircle2 : Plus}
                    onClick={() => {
                        window.location.href = "/miembro/registrar-daily";
                    }}
                >
                    {today ? "Editar daily de hoy" : "Registrar daily"}
                </Button>
            </header>

            {/* Stats inline */}
            <section className={styles.statsRow}>
                <Card padding="md" className={styles.stat}>
                    <div className={styles.statLabel}>
                        <Mail size={14} aria-hidden="true" />
                        Correo
                    </div>
                    <div className={styles.statValue}>{user?.correo || "—"}</div>
                </Card>
                <Card padding="md" className={styles.stat}>
                    <div className={styles.statLabel}>
                        <Clock size={14} aria-hidden="true" />
                        Capacidad semanal
                    </div>
                    <div className={styles.statValue}>
                        {user?.capacidad_horas_semana ?? 40}
                        <span className={styles.statUnit}> h</span>
                    </div>
                </Card>
                <Card padding="md" className={styles.stat}>
                    <div className={styles.statLabel}>
                        <CalendarDays size={14} aria-hidden="true" />
                        Dailys (15 d)
                    </div>
                    <div className={styles.statValue}>
                        {calendar.length}
                        <span className={styles.statUnit}> / 15</span>
                    </div>
                </Card>
            </section>

            {/* Today */}
            <Card
                title="Hoy"
                description={formatDateLong(new Date().toISOString())}
                className={styles.todayCard}
            >
                {today ? (
                    <div className={styles.todayBody}>
                        <Field label="Ayer">{today.que_hice_ayer || "—"}</Field>
                        <Field label="Hoy">{today.que_hare_hoy || "—"}</Field>
                        {today.bloqueos_texto && (
                            <div className={styles.blocker}>
                                <AlertTriangle
                                    size={14}
                                    aria-hidden="true"
                                />
                                <span>{today.bloqueos_texto}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon={CalendarDays}
                        title="No has registrado tu daily hoy"
                        description="Llévate 30 segundos para dejar visibilidad a tu equipo."
                        action={
                            <Link to="/miembro/registrar-daily">
                                <Button variant="primary" leftIcon={Plus}>
                                    Registrar daily
                                </Button>
                            </Link>
                        }
                    />
                )}
            </Card>

            {/* Historial */}
            <Card
                title="Historial"
                description="Últimos 15 días registrados"
            >
                {calendar.length === 0 ? (
                    <EmptyState
                        icon={History}
                        title="Aún no tienes historial"
                        description="Cuando empieces a registrar dailys aparecerán aquí."
                    />
                ) : (
                    <ul className={styles.history}>
                        {calendar.map((d) => (
                            <li key={d.id} className={styles.historyItem}>
                                <span className={styles.date}>
                                    {formatDateLong(d.fecha)}
                                </span>
                                <p className={styles.historyText}>
                                    {d.que_hare_hoy || "—"}
                                </p>
                                {d.bloqueos_texto && (
                                    <Badge variant="warning" size="sm">
                                        <AlertTriangle
                                            size={11}
                                            aria-hidden="true"
                                        />
                                        bloqueo
                                    </Badge>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className={styles.field}>
            <span className={styles.fieldLabel}>{label}</span>
            <p className={styles.fieldValue}>{children}</p>
        </div>
    );
}
