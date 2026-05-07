import styles from "../../../assets/css/Miembro/Certificaciones.module.scss";

export default function DetalleCertificacionModal({
    open,
    onClose,
    cert,
    relacion,
}) {
    if (!open || !cert) return null;

    const estado = relacion?.estado || "pendiente";

    return (
        <div
            className={styles.overlay}
            onClick={onClose}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <div>
                        <span className={styles.codigo}>
                            {cert.codigo}
                        </span>

                        <h2>{cert.nombre}</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className={styles.closeBtn}
                    >
                        ✕
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div
                        className={`${styles.estadoBadge} ${
                            styles[estado]
                        }`}
                    >
                        {estado}
                    </div>

                    <div className={styles.infoGrid}>
                        <div>
                            <label>Entidad</label>
                            <p>{cert.entidad || "-"}</p>
                        </div>

                        <div>
                            <label>Nivel</label>
                            <p>{relacion?.nivel || "-"}</p>
                        </div>

                        <div>
                            <label>Fecha obtención</label>
                            <p>
                                {relacion?.fecha_obtencion ||
                                    "-"}
                            </p>
                        </div>

                        <div>
                            <label>Fecha expiración</label>
                            <p>
                                {relacion?.fecha_expiracion ||
                                    "No expira"}
                            </p>
                        </div>

                        <div>
                            <label>Validada</label>
                            <p>
                                {relacion?.validado
                                    ? "Sí"
                                    : "No"}
                            </p>
                        </div>
                    </div>

                    {relacion?.credencial_url && (
                        <a
                            href={relacion.credencial_url}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.linkBtn}
                        >
                            Ver credencial
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}