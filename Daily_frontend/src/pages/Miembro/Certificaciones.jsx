import styles from "../../assets/css/Miembro/Certificaciones.module.scss";
import MisCertificaciones from '../../components/Miembro/MisCertificaciones'

export default function Certificaciones() {
    return (
        <div className={styles.container}>
            <h2>Certificaciones</h2>
            <MisCertificaciones />
        </div>
    )
}
