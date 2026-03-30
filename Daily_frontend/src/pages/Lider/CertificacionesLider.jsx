import styles from "../../assets/css/Lider/CertificacionesLider.module.scss"
import CertificacionesMatrix from "../../components/Lider/CertificacionesMatrix"

export default function CertificacionesLider() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Matriz de Certificaciones</h2>

                <p className={styles.subtitle}>
                    Asigna y gestiona certificaciones por persona
                </p>
            </div>
            <CertificacionesMatrix />
        </div>
    )
}
