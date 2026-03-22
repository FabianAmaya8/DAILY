import { useLiderDashboard } from "../../hooks/useLiderDashboard";
import styles from "../../assets/css/Lider/LiderDashboard.module.scss";

import MemberCard from "../../components/Lider/Dashboard/MemberCard";
import MemberModal from "../../components/Lider/Dashboard/MemberModal";

export default function LiderDashboard() {
    const {
        members,
        selectedMember,
        calendar,
        loading,
        selectMember,
        setSelectedMember,
    } = useLiderDashboard();

    if (loading) return <p>Cargando...</p>;

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Dashboard Líder</h2>

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