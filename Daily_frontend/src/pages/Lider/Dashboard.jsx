import { Crown, Users } from "lucide-react";
import { useLiderDashboard } from "../../hooks/useLiderDashboard";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import Cargando from "../../components/Depen/Cargando";
import MemberCard from "../../components/Lider/Dashboard/MemberCard";
import MemberModal from "../../components/Lider/Dashboard/MemberModal";
import styles from "../../assets/css/Lider/LiderDashboard.module.scss";

export default function LiderDashboard() {
    const {
        members,
        teams,
        selectedTeam,
        selectedMember,
        calendar,
        loading,
        setSelectedTeam,
        selectMember,
        setSelectedMember,
    } = useLiderDashboard();

    if (loading) return <Cargando />;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>
                        <Crown size={20} aria-hidden="true" />
                        Panel Líder
                    </h1>
                    <p className={styles.subtitle}>
                        Estado del equipo en tiempo real: ocupación, último daily
                        y bloqueos abiertos.
                    </p>
                </div>
                <Badge variant="primary" size="md">
                    <Users size={12} aria-hidden="true" />
                    {members.length} {members.length === 1 ? "persona" : "personas"}
                </Badge>
            </header>

            <div className={styles.toolbar}>
                <label htmlFor="filter-team" className={styles.toolbarLabel}>
                    Equipo
                </label>
                <select
                    id="filter-team"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className={styles.select}
                >
                    <option value="all">Todos los equipos</option>
                    {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {members.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No hay personas en este equipo"
                    description="Selecciona otro equipo o pide a un admin que asigne miembros."
                />
            ) : (
                <div className={styles.grid}>
                    {members.map((m) => (
                        <MemberCard
                            key={m.id}
                            member={m}
                            onClick={() => selectMember(m)}
                        />
                    ))}
                </div>
            )}

            {selectedMember && (
                <MemberModal
                    member={selectedMember}
                    calendar={calendar}
                    onClose={() => setSelectedMember(null)}
                />
            )}
        </div>
    );
}
