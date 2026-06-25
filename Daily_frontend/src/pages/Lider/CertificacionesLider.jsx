import { ShieldCheck, AlertOctagon } from "lucide-react";
import { useCertificaciones } from "../../hooks/useCertificaciones";
import CertificacionesMatrix from "../../components/Lider/Certificaciones/CertificacionesMatrix";
import CertificacionesStats from "../../components/Lider/Certificaciones/CertificacionesStats.jsx";
import CertificacionModal from "../../components/Lider/Certificaciones/CertificacionModal.jsx";
import Cargando from "../../components/Depen/Cargando";
import { EmptyState } from "../../components/ui/EmptyState";
import styles from "../../assets/css/Lider/CertificacionesLider.module.scss";

export default function CertificacionesLider() {
    const certHook = useCertificaciones();
    const { loading, error } = certHook;

    if (loading) return <Cargando />;

    if (error) {
        return (
            <div className={styles.container}>
                <EmptyState
                    icon={AlertOctagon}
                    title="No se pudo cargar la matriz de certificaciones"
                    description={error.message || error}
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <ShieldCheck size={20} aria-hidden="true" />
                    Matriz de certificaciones
                </h1>
                <p className={styles.subtitle}>
                    Asigna, analiza y gestiona las certificaciones del equipo.
                </p>
            </header>

            <CertificacionesStats
                categorias={certHook.categorias}
                personas={certHook.personas}
                getRanking={certHook.getRanking}
                categoriaActiva={certHook.categoriaActiva}
                setCategoriaActiva={certHook.setCategoriaActiva}
                equipos={certHook.equipos}
                equipoActivo={certHook.equipoActivo}
                setEquipoActivo={certHook.setEquipoActivo}
            />

            <CertificacionesMatrix
                categoriasFiltradas={certHook.categoriasFiltradas}
                personas={certHook.personas}
                tieneCertificacion={certHook.tieneCertificacion}
                getProgresoPersona={certHook.getProgresoPersona}
                abrirModal={certHook.abrirModal}
                getRelacion={certHook.getRelacion}
            />

            <CertificacionModal
                seleccion={certHook.seleccion}
                onClose={certHook.cerrarModal}
                onSave={certHook.toggleCertificacion}
                tieneCertificacion={certHook.tieneCertificacion}
                getRelacion={certHook.getRelacion}
            />
        </div>
    );
}
