import { OctagonAlert, ArrowBigLeftDash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/Layout/Error404.module.scss";

export default function Error404() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.error}>
                <OctagonAlert size={100} className={styles.icon} />
                <h2 className={styles.title}>Página no encontrada</h2>
                <p className={styles.text}>
                    La URL a la que intentas acceder no existe
                </p>
                <button className={styles.button} onClick={() => navigate(-1)}>
                    <ArrowBigLeftDash size={20} />
                    Volver
                </button>
            </div>
        </div>
    );
}
