import { Plus, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BloqueosList from "../../components/Depen/BloqueosList";
import { Button } from "../../components/ui/Button";
import styles from "../../assets/css/Miembro/Bloqueos.module.scss";

export default function Bloqueos() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>
                        <ShieldAlert size={20} aria-hidden="true" />
                        Bloqueos
                    </h1>
                    <p className={styles.subtitle}>
                        Riesgos abiertos del equipo y su histórico.
                    </p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={Plus}
                    onClick={() => navigate("/miembro/registrar-bloqueo")}
                >
                    Nuevo bloqueo
                </Button>
            </header>
            <BloqueosList />
        </div>
    );
}
