import { ExternalLink, ShieldCheck, Calendar, Award } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import styles from "../../../assets/css/Miembro/Certificaciones.module.scss";

const ESTADO_VARIANT = {
    vigente: "success",
    por_vencer: "warning",
    expirada: "danger",
    pendiente: "neutral",
};

const ESTADO_LABEL = {
    vigente: "Vigente",
    por_vencer: "Por vencer",
    expirada: "Expirada",
    pendiente: "Pendiente",
};

/**
 * Devuelve la URL solo si su protocolo es http(s).
 * Bloquea XSS por `javascript:` u otros esquemas peligrosos
 * almacenados en `credencial_url` (Fase 1).
 */
function safeHttpUrl(raw) {
    if (typeof raw !== "string" || !raw) return null;
    try {
        const u = new URL(raw, window.location.origin);
        return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
    } catch {
        return null;
    }
}

export default function DetalleCertificacionModal({
    open,
    onClose,
    cert,
    relacion,
}) {
    if (!cert) return null;

    const estado = relacion?.estado || "pendiente";
    const credencialHref = safeHttpUrl(relacion?.credencial_url);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={cert.nombre}
            description={cert.codigo}
            size="md"
            footer={
                credencialHref ? (
                    <Button
                        variant="primary"
                        leftIcon={ExternalLink}
                        as="a"
                        href={credencialHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {}}
                    >
                        Ver credencial
                    </Button>
                ) : null
            }
        >
            <div className={styles.detailBody}>
                <div className={styles.detailHeader}>
                    <Badge
                        variant={ESTADO_VARIANT[estado]}
                        size="md"
                        dot={estado === "vigente"}
                    >
                        {ESTADO_LABEL[estado] || estado}
                    </Badge>
                </div>

                <dl className={styles.infoList}>
                    <Row icon={ShieldCheck} label="Entidad">
                        {cert.entidad || "—"}
                    </Row>
                    <Row icon={Award} label="Nivel">
                        {relacion?.nivel || "—"}
                    </Row>
                    <Row icon={Calendar} label="Obtenida">
                        {relacion?.fecha_obtencion || "—"}
                    </Row>
                    <Row icon={Calendar} label="Expira">
                        {relacion?.fecha_expiracion || "No expira"}
                    </Row>
                    <Row icon={ShieldCheck} label="Validada">
                        {relacion?.validado ? (
                            <Badge variant="success" size="sm">
                                Sí
                            </Badge>
                        ) : (
                            <Badge variant="neutral" size="sm">
                                No
                            </Badge>
                        )}
                    </Row>
                </dl>

                {cert.descripcion && (
                    <section className={styles.descripcion}>
                        <h4 className={styles.sectionTitle}>Descripción</h4>
                        <p>{cert.descripcion}</p>
                    </section>
                )}
            </div>
        </Modal>
    );
}

function Row({ icon: Icon, label, children }) {
    return (
        <div className={styles.infoRow}>
            <span className={styles.infoIcon}>
                <Icon size={14} aria-hidden="true" />
            </span>
            <dt>{label}</dt>
            <dd>{children}</dd>
        </div>
    );
}
