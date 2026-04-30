import { useLiderDashboard } from "../../hooks/useLiderDashboard";
import styles from "../../assets/css/Lider/LiderDashboard.module.scss";

import MemberCard from "../../components/Lider/Dashboard/MemberCard";
import MemberModal from "../../components/Lider/Dashboard/MemberModal";
import Cargando from "../../components/Depen/Cargando";

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
            <h2 className={styles.title}>Dashboard Líder</h2>

            <div className={styles.filters}>
                <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                >
                    <option value="all">Todos</option>

                    {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.nombre}
                        </option>
                    ))}
                </select>

                <p className={styles.title}>
                    total de miembros: {members.length}
                </p>
            </div>

            <div className={styles.grid}>
                {members?.map((m) => (
                    <MemberCard
                        key={m.id}
                        member={m}
                        onClick={() => selectMember(m)}
                    />
                ))}
            </div>

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