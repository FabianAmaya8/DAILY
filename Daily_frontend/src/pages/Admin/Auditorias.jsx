import { useAuditoria } from "../../hooks/useAuditoria";
import { FileSearch, AlertOctagon } from "lucide-react";
import AuditoriaTable from "../../components/Admin/AuditoriaTable";
import Cargando from "../../components/Depen/Cargando";
import { EmptyState } from "../../components/ui/EmptyState";
import { Card } from "../../components/ui/Card";
import styles from "../../assets/css/Admin/Auditoria.module.scss";

export default function Auditorias() {
    const { logs, loading, error } = useAuditoria();

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>
                    <FileSearch size={20} aria-hidden="true" />
                    Auditoría del sistema
                </h1>
                <p className={styles.subtitle}>
                    Bitácora completa de cambios sobre dailys, equipos y
                    bloqueos. Inmutable.
                </p>
            </header>

            {loading ? (
                <Cargando />
            ) : error ? (
                <EmptyState
                    icon={AlertOctagon}
                    title="No se pudo cargar la auditoría"
                    description={error.message || error}
                />
            ) : !logs || logs.length === 0 ? (
                <EmptyState
                    icon={FileSearch}
                    title="Aún no hay registros"
                    description="Cuando se modifiquen entidades clave aparecerán aquí."
                />
            ) : (
                <Card 
                    padding="none"
                    
                >
                    <AuditoriaTable logs={logs} />
                </Card>
            )}
        </div>
    );
}
