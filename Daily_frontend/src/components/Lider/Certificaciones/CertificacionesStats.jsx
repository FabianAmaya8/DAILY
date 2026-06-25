import {
    PieChart,
    Award,
    Users as UsersIcon,
    CheckCircle2,
    Clock,
    Trophy,
} from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import styles from "../../../assets/css/Lider/CertificacionesLider.module.scss";

export default function CertificacionesStats({
    categorias = [],
    personas = [],
    getRanking,
    categoriaActiva,
    setCategoriaActiva,
    equipos = [],
    equipoActivo,
    setEquipoActivo,
}) {
    const categoriasFiltradas = categoriaActiva
        ? categorias.filter((c) => c.id === categoriaActiva)
        : categorias;

    const certificaciones = categoriasFiltradas.flatMap(
        (cat) => cat.certificaciones || [],
    );

    const totalCerts = certificaciones.length;
    const totalPersonas = personas.length;

    let totalAsignadas = 0;
    let vigentes = 0;
    let pendientes = 0;

    categoriasFiltradas.forEach((cat) => {
        (cat.certificaciones || []).forEach((cert) => {
            totalAsignadas += cert.personas?.size || 0;
            cert.personas?.forEach((rel) => {
                if (rel.estado === "vigente") vigentes++;
                if (rel.estado === "pendiente") pendientes++;
            });
        });
    });

    const totalPosible = totalCerts * totalPersonas;
    const porcentajeGlobal =
        totalPosible > 0
            ? Math.round((totalAsignadas / totalPosible) * 100)
            : 0;

    const ranking =
        typeof getRanking === "function" ? getRanking().slice(0, 5) : [];

    return (
        <div className={styles.statsWrapper}>
            {/* Filtros segmentados */}
            <div className={styles.filterContainer}>
                {equipos.length > 1 && (
                    <FilterRow
                        label="Equipos"
                        active={equipoActivo}
                        items={equipos}
                        onAll={() => setEquipoActivo(null)}
                        onSelect={(id) => setEquipoActivo(id)}
                    />
                )}

                <FilterRow
                    label="Categorías"
                    active={categoriaActiva}
                    items={categorias}
                    onAll={() => setCategoriaActiva(null)}
                    onSelect={(id) => setCategoriaActiva(id)}
                />
            </div>

            {/* Stats grid */}
            <div className={styles.statsContainer}>
                <StatCard
                    icon={PieChart}
                    label="Cobertura"
                    value={`${porcentajeGlobal}%`}
                    sub={`${totalAsignadas} / ${totalPosible}`}
                    accent="primary"
                    big
                />

                <StatCard
                    icon={Award}
                    label="Certificaciones"
                    value={totalCerts}
                />

                <StatCard
                    icon={UsersIcon}
                    label="Personas"
                    value={totalPersonas}
                />

                <StatCard
                    icon={CheckCircle2}
                    label="Vigentes"
                    value={vigentes}
                    accent="success"
                />

                <StatCard
                    icon={Clock}
                    label="Pendientes"
                    value={pendientes}
                    accent="warning"
                />

                <Card padding="md" className={styles.rankingCard}>
                    <div className={styles.statHead}>
                        <span className={styles.statIcon}>
                            <Trophy size={14} aria-hidden="true" />
                        </span>
                        <span className={styles.statLabel}>Top certificados</span>
                    </div>
                    {ranking.length ? (
                        <ol className={styles.ranking}>
                            {ranking.map((p, idx) => (
                                <li key={p.id}>
                                    <span className={styles.rankPos}>{idx + 1}</span>
                                    <span className={styles.rankName}>{p.nombre}</span>
                                    <Badge variant="primary" size="sm">
                                        {p.obtenidas}
                                    </Badge>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className={styles.muted}>Sin datos.</p>
                    )}
                </Card>
            </div>
        </div>
    );
}

function FilterRow({ label, items, active, onAll, onSelect }) {
    return (
        <div className={styles.filters}>
            <span className={styles.titleFilter}>{label}</span>
            <div className={styles.filterPills}>
                <button
                    type="button"
                    className={`${styles.pill} ${!active ? styles.pillActive : ""}`}
                    onClick={onAll}
                >
                    Todos
                </button>
                {items.map((it) => (
                    <button
                        type="button"
                        key={it.id}
                        className={`${styles.pill} ${active === it.id ? styles.pillActive : ""}`}
                        onClick={() => onSelect(it.id)}
                    >
                        {it.nombre}
                    </button>
                ))}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, sub, accent = "neutral", big }) {
    return (
        <Card padding="md" className={`${styles.statCard} ${styles[`a_${accent}`]}`}>
            <div className={styles.statHead}>
                <span className={styles.statIcon}>
                    <Icon size={14} aria-hidden="true" />
                </span>
                <span className={styles.statLabel}>{label}</span>
            </div>
            <span className={`${styles.statValue} ${big ? styles.statBig : ""}`}>
                {value}
            </span>
            {sub && <span className={styles.statSub}>{sub}</span>}
        </Card>
    );
}
