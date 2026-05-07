import styles from "../../../assets/css/Lider/CertificacionesLider.module.scss";
import Avatar from "../../Depen/Avatar";

export default function CertificacionesMatrix({
    categoriasFiltradas = [],
    personas = [],
    tieneCertificacion,
    getProgresoPersona,
    abrirModal,
    getRelacion,
}) {
    const certificaciones = categoriasFiltradas.flatMap(
        (c) => c.certificaciones || []
    );

    return (
        <div className={styles.matrixContainer}>
            {personas.map((persona) => {
                const progreso = getProgresoPersona(persona.id);

                return (
                    <div key={persona.id} className={styles.cardPersona}>
                        {/* HEADER */}
                        <div className={styles.personaHeader}>
                            <Avatar
                                userId={persona.id}
                                Nombre={persona.nombre}
                            />

                            <div>
                                <div className={styles.personaNombre}>
                                    {persona.nombre}
                                </div>

                                <div className={styles.personaStats}>
                                    {progreso.obtenidas} / {progreso.total}
                                </div>
                            </div>
                        </div>

                        {/* PROGRESS */}
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{
                                    width: `${progreso.porcentaje}%`,
                                }}
                            />
                        </div>

                        {/* CERTS */}
                        <div className={styles.certGrid}>
                            {certificaciones.map((cert) => {
                                const relacion = getRelacion(persona.id, cert.id);
                                const estado = relacion?.estado || null;

                                return (
                                    <button
                                        key={cert.id}
                                        className={`${styles.certItem} ${
                                            estado === "vigente"
                                                ? styles.certVigente
                                                : estado === "pendiente"
                                                ? styles.certPendiente
                                                : estado === "expirada"
                                                ? styles.certExpirada
                                                : estado === "por_vencer"
                                                ? styles.certPorVencer
                                                : styles.certInactiva
                                        }`}
                                        onClick={() =>
                                            abrirModal(persona, cert)
                                        }
                                        title={`${cert.codigo} - ${cert.nombre}`}
                                    >
                                        {cert.codigo}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}