import styles from "../../assets/css/Admin/Auditoria.module.scss";

export default function AuditoriaTable({ logs }) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Acción</th>
                        <th>Entidad</th>
                    </tr>
                </thead>

                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{new Date(log.creado_en).toLocaleString()}</td>

                            <td>{log.actor?.nombre || "Sistema"}</td>

                            <td className={styles[log.accion]}>{log.accion}</td>

                            <td>{log.entidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
