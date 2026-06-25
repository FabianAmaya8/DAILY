import { Badge } from "../ui/Badge";
import styles from "../../assets/css/Admin/Auditoria.module.scss";

const ACTION_VARIANT = {
    INSERT: "success",
    UPDATE: "warning",
    DELETE: "danger",
};

export default function AuditoriaTable({ logs }) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Actor</th>
                        <th>Acción</th>
                        <th>Entidad</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>
                                {log.creado_en
                                    ? new Date(log.creado_en).toLocaleString(
                                          "es-ES",
                                          {
                                              year: "numeric",
                                              month: "2-digit",
                                              day: "2-digit",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          },
                                      )
                                    : "—"}
                            </td>
                            <td>{log.actor?.nombre || "Sistema"}</td>
                            <td>
                                <Badge
                                    variant={ACTION_VARIANT[log.accion] || "neutral"}
                                    size="sm"
                                >
                                    {log.accion}
                                </Badge>
                            </td>
                            <td>{log.entidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
