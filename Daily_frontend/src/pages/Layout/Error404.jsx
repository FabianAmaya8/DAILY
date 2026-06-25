import { useNavigate } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import styles from "../../assets/css/Layout/Error404.module.scss";

export default function Error404() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <EmptyState
                icon={Compass}
                title="Página no encontrada"
                description="La URL a la que intentas acceder no existe o fue movida."
                action={
                    <div className={styles.actions}>
                        <Button
                            variant="primary"
                            leftIcon={ArrowLeft}
                            onClick={() => navigate(-1)}
                        >
                            Volver
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/")}
                        >
                            Ir al inicio
                        </Button>
                    </div>
                }
                className={styles.empty}
            />
        </div>
    );
}
