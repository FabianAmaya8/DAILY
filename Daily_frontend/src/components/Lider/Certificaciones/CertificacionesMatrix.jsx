import { Card } from "../../ui/Card";
import Avatar from "../../Depen/Avatar";
import styles from "../../../assets/css/Lider/CertificacionesLider.module.scss";

const ESTADO_CLASS = {
    vigente: "certVigente",
    pendiente: "certPendiente",
    expirada: "certExpirada",
    por_vencer: "certPorVencer",
};

export default function CertificacionesMatrix({
    categoriasFiltradas = [],
    personas = [],
    abrirModal,
    getProgresoPersona,
    getRelacion,
}) {
    const certificaciones = categoriasFiltradas.flatMap(
        (c) => c.certificaciones || [],
    );

    return (
        <div className={styles.matrixContainer}>
            {personas.map((persona) => {
                const progreso = getProgresoPersona(persona.id);
                return (
                    <Card
                        key={persona.id}
                        padding="md"
                        className={styles.cardPersona}
                    >
                        <header className={styles.personaHeader}>
                            <Avatar
                                userId={persona.id}
                                Nombre={persona.nombre}
                                size="md"
                            />
                            <div className={styles.personaText}>
                                <div className={styles.personaNombre}>
                                    {persona.nombre}
                                </div>
                                <div className={styles.personaStats}>
                                    {progreso.obtenidas} / {progreso.total}
                                </div>
                            </div>
                        </header>

                        <div
                            className={styles.progressBar}
                            role="progressbar"
                            aria-valuenow={progreso.porcentaje}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Progreso de ${persona.nombre}`}
                        >
                            <div
                                className={styles.progressFill}
                                style={{ width: `${progreso.porcentaje}%` }}
                            />
                        </div>

                        <div className={styles.certGrid}>
                            {certificaciones.map((cert) => {
                                const relacion = getRelacion(persona.id, cert.id);
                                const estado = relacion?.estado || null;
                                const cls = ESTADO_CLASS[estado] || "certInactiva";
                                return (
                                    <button
                                        key={cert.id}
                                        type="button"
                                        className={`${styles.certItem} ${styles[cls]}`}
                                        onClick={() => abrirModal(persona, cert)}
                                        title={`${cert.codigo} — ${cert.nombre}`}
                                        aria-label={`${cert.codigo} de ${persona.nombre}, estado ${estado || "no asignada"}`}
                                    >
                                        {cert.codigo}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
