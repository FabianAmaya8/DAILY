import { ShieldCheck, AlertOctagon } from "lucide-react";
import MisCertificaciones from "../../components/Miembro/Certificaciones/MisCertificaciones";
import { useCertificaciones } from "../../hooks/useCertificaciones";
import Cargando from "../../components/Depen/Cargando";
import { EmptyState } from "../../components/ui/EmptyState";
import styles from "../../assets/css/Miembro/Certificaciones.module.scss";

export default function Certificaciones() {
    const {
        userId,
        categorias,
        categoriaActiva,
        setCategoriaActiva,
        getRelacion,
        loading,
        error,
    } = useCertificaciones();

    if (loading) return <Cargando />;

    if (error) {
        return (
            <div className={styles.container}>
                <EmptyState
                    icon={AlertOctagon}
                    title="No se pudieron cargar las certificaciones"
                    description={error.message || error}
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>
                    <ShieldCheck size={20} aria-hidden="true" />
                    Mis certificaciones
                </h1>
                <p className={styles.subtitle}>
                    Catálogo, estado y vencimientos de tus certificaciones.
                </p>
            </header>

            <MisCertificaciones
                userId={userId}
                categorias={categorias}
                categoriaActiva={categoriaActiva}
                setCategoriaActiva={setCategoriaActiva}
                getRelacion={getRelacion}
            />
        </div>
    );
}
