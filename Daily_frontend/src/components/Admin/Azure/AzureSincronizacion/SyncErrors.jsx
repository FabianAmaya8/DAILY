import { ShieldAlert } from "lucide-react";
import { Card } from "../../../ui/Card";
import styles from "../../../../assets/css/Admin/DatosAzure.module.scss";

export function SyncErrors({ syncAllError, syncProjectError, syncSummaryErrors = [] }) {
    const hasHeaderErrors = Boolean(syncAllError || syncProjectError);
    const hasSummaryErrors = syncSummaryErrors.length > 0;

    if (!hasHeaderErrors && !hasSummaryErrors) {
        return null;
    }

    return (
        <>
            {hasHeaderErrors && (
                <Card title="Estado de sincronización" padding="md">
                    <div className={styles.errorList}>
                        {syncAllError && (
                            <div className={styles.errorRow}>
                                <ShieldAlert size={16} aria-hidden="true" />
                                <span>{syncAllError}</span>
                            </div>
                        )}
                        {syncProjectError && (
                            <div className={styles.errorRow}>
                                <ShieldAlert size={16} aria-hidden="true" />
                                <span>{syncProjectError}</span>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {hasSummaryErrors && (
                <Card
                    title="Errores de sincronización"
                    description="La sincronización manual continúa aunque algún proyecto falle."
                    padding="md"
                >
                    <div className={styles.errorList}>
                        {syncSummaryErrors.map((item) => (
                            <div key={item} className={styles.errorRow}>
                                <ShieldAlert size={16} aria-hidden="true" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </>
    );
}
