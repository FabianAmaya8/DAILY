import { useCertificaciones } from "../../hooks/useCertificaciones";
import styles from "../../assets/css/Miembro/Certificaciones.module.scss";
import Cargando from "../Depen/Cargando";

export default function MisCertificaciones() {
    const { catalogo, tieneMiCertificacion , loading, error } =
        useCertificaciones();

    if (loading) return <Cargando />;
    if (error) return <p>Error: {error}</p>;
    
    return (
        <div className={styles.grid}>
            {catalogo.map((cert) => {
                const tiene = tieneMiCertificacion(cert.id);

                return (
                    <div
                        key={cert.id}
                        className={`${styles.card} ${
                            tiene ? styles.tiene : styles.noTiene
                        }`}
                    >
                        <div className={styles.header}>
                            <span className={styles.codigo}>
                                {cert.codigo}
                            </span>

                            {tiene && (
                                <span className={styles.badge}>
                                    ✔ Obtenida
                                </span>
                            )}
                        </div>

                        <h3 className={styles.nombre}>
                            {cert.nombre}
                        </h3>

                        <p className={styles.entidad}>
                            {cert.entidad}
                        </p>

                        {!tiene && (
                            <span className={styles.pending}>
                                Pendiente
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
