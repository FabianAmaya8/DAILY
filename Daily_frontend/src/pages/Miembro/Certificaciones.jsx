import styles from "../../assets/css/Miembro/Certificaciones.module.scss";
import MisCertificaciones from "../../components/Miembro/Certificaciones/MisCertificaciones";
import { useCertificaciones } from "../../hooks/useCertificaciones";
import Cargando from "../../components/Depen/Cargando";

export default function Certificaciones() {
    const { 
        userId,
        categorias, 
        categoriaActiva,
        setCategoriaActiva,
        getRelacion, 
        loading, 
        error 
    } = useCertificaciones();

    if (loading) return <Cargando />;

    if (error) {
        return (
            <div className={styles.container}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Mis Certificaciones</h2>

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
