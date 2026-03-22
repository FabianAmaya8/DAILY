import { useAuditoria } from "../../hooks/useAuditoria";
import AuditoriaTable from "../../components/Admin/AuditoriaTable";
import styles from "../../assets/css/Admin/Auditoria.module.scss";

export default function Auditorias() {
    const { logs, loading } = useAuditoria();

    if (loading) return <p>Cargando auditoría...</p>;

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Auditoría del Sistema</h1>

            <AuditoriaTable logs={logs} />
        </div>
    );
}
