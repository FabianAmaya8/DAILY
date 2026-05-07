import styles from "../../assets/css/Lider/CertificacionesLider.module.scss";
import { useCertificaciones } from "../../hooks/useCertificaciones";

import CertificacionesMatrix from "../../components/Lider/Certificaciones/CertificacionesMatrix";
import CertificacionesStats from "../../components/Lider/Certificaciones/CertificacionesStats.jsx";

import Cargando from "../../components/Depen/Cargando";
import CertificacionModal from "../../components/Lider/Certificaciones/CertificacionModal.jsx";

export default function CertificacionesLider() {
    const certHook = useCertificaciones();

    const { loading, error } = certHook;

    if (loading) return <Cargando />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Matriz de Certificaciones
                </h2>

                <p className={styles.subtitle}>
                    Asigna, analiza y gestiona certificaciones del equipo
                </p>
            </div>

            {/* 🔥 NUEVO: STATS */}
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

            {/* 🔥 MATRIZ */}
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