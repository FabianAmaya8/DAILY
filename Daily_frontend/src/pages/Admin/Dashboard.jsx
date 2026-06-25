import { useQuery } from "@tanstack/react-query";
import { Users, Crown, UserCheck, ShieldCheck, AlertOctagon } from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import { useUser } from "../../utils/contexts/UserContext";
import { Card } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import styles from "../../assets/css/Admin/Dashboard.module.scss";

async function fetchOrgStats() {
    const counts = await Promise.all([
        supabase.from("personas").select("*", { count: "exact", head: true }),
        supabase
            .from("personas")
            .select("*", { count: "exact", head: true })
            .eq("rol", "lider"),
        supabase
            .from("personas")
            .select("*", { count: "exact", head: true })
            .eq("rol", "miembro"),
        supabase
            .from("personas")
            .select("*", { count: "exact", head: true })
            .eq("rol", "admin"),
        supabase
            .from("bloqueos")
            .select("*", { count: "exact", head: true })
            .eq("estado", "Abierto"),
    ]);

    const [users, lider, miembro, admin, bloqueosAbiertos] = counts.map(
        (r) => r.count ?? 0,
    );
    return { users, lider, miembro, admin, bloqueosAbiertos };
}

const STAT_DEFS = [
    { key: "users", label: "Personas", icon: Users },
    { key: "admin", label: "Admins", icon: ShieldCheck },
    { key: "lider", label: "Líderes", icon: Crown },
    { key: "miembro", label: "Miembros", icon: UserCheck },
    { key: "bloqueosAbiertos", label: "Bloqueos abiertos", icon: AlertOctagon, danger: true },
];

export default function AdminDashboard() {
    const { nombre } = useUser();

    const { data, isLoading, error } = useQuery({
        queryKey: ["admin", "stats"],
        queryFn: fetchOrgStats,
    });

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Panel Admin</h1>
                    <p className={styles.subtitle}>
                        Bienvenido, {nombre || "admin"}. Vista global de la
                        organización.
                    </p>
                </div>
            </header>

            {error ? (
                <EmptyState
                    icon={AlertOctagon}
                    title="No se pudieron cargar las estadísticas"
                    description={error.message}
                />
            ) : (
                <section className={styles.statsGrid} aria-busy={isLoading}>
                    {STAT_DEFS.map(({ key, label, icon: Icon, danger }) => (
                        <Card key={key} padding="md" className={styles.statCard}>
                            <div
                                className={`${styles.iconWrap} ${danger ? styles.danger : ""}`}
                            >
                                <Icon size={18} aria-hidden="true" />
                            </div>
                            <div className={styles.statBody}>
                                <span className={styles.statLabel}>{label}</span>
                                <span className={styles.statValue}>
                                    {isLoading ? (
                                        <Skeleton
                                            variant="text"
                                            width={40}
                                            height="1.5rem"
                                        />
                                    ) : (
                                        (data?.[key] ?? 0)
                                    )}
                                </span>
                            </div>
                        </Card>
                    ))}
                </section>
            )}
        </div>
    );
}
