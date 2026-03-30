import { useAuditoria } from "../../hooks/useAuditoria";
import AuditoriaTable from "../../components/Admin/AuditoriaTable";
import styles from "../../assets/css/Admin/Auditoria.module.scss";
import Cargando from "../../components/Depen/Cargando";

export default function Auditorias() {
    const { logs, loading } = useAuditoria();

    if (loading) return <Cargando />;

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Auditoría del Sistema</h1>

            <AuditoriaTable logs={logs} />
        </div>
    );
}
