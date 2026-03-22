import styles from "../../assets/css/Layout/Inicio.module.scss";
import { useNavigate } from "react-router-dom";

export default function Inicio() {

    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <h1 className={styles.title}>
                    Sistema de Visibilidad Daily
                </h1>

                <p className={styles.description}>
                    Esta plataforma permite registrar los <strong>dailys</strong> del equipo,
                    visualizar la ocupación semanal, gestionar bloqueos y mantener
                    trazabilidad de actividades vinculadas a los <strong>Work Items</strong>.
                </p>

                <p className={styles.description}>
                    El sistema está diseñado para mejorar la visibilidad del trabajo
                    del equipo, identificar riesgos tempranos y facilitar
                    la toma de decisiones por parte del liderazgo.
                </p>

                <div className={styles.notice}>
                    <strong>Importante:</strong><br />
                    Para ingresar al sistema debes utilizar las credenciales
                    proporcionadas por tu líder o administrador.
                </div>

                <button
                    className={styles.button}
                    onClick={goToLogin}
                >
                    Ingresar al sistema
                </button>

            </div>
        </div>
    );
}