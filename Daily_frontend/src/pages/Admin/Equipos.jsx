import { useState } from "react";
import { useEquipos } from "../../hooks/useEquipos";
import { RefreshCcw } from "lucide-react";
import EquipoCard from "../../components/Admin/Equipos/EquipoCard";
import FormAddEquipos from "../../components/Admin/Equipos/FormAddEquipos";
import ModalEquipo from "../../components/Admin/Equipos/ModalEquipo";
import styles from "../../assets/css/Admin/Equipos.module.scss";
import Cargando from "../../components/Depen/Cargando";

export default function EquiposPage() {
    const {
        equipos,
        loading,
        crearEquipo,
        editarEquipo,
        eliminarEquipo,
        agregarMiembro,
        quitarMiembro,
        cambiarLider,
        usuario,
        refetch,
    } = useEquipos();
    const [equipoActivoID, setEquipoActivoID] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const equipoActivo = equipos.find((e) => e.id === equipoActivoID);
    const [equipoEditar, setEquipoEditar] = useState(null);

    if (loading) return <Cargando />;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Equipos</h1>

                <div className={styles.actions}>
                    <button
                        onClick={refetch}
                        className={styles.actualizarButton}
                    >
                        <RefreshCcw size={14} />
                    </button>
                    <button
                        onClick={() => setOpenModal(true)}
                        className={styles.createButton}
                    >
                        Crear equipo
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                {equipos.map((equipo) => (
                    <EquipoCard
                        key={equipo.id}
                        equipo={equipo}
                        editarEquipo={() => setEquipoEditar(equipo)}
                        eliminarEquipo={eliminarEquipo}
                        onView={() => setEquipoActivoID(equipo.id)}
                    />
                ))}
            </div>

            {openModal && (
                <FormAddEquipos
                    usuario={usuario}
                    crearEquipo={crearEquipo}
                    onClose={() => setOpenModal(false)}
                />
            )}

            {equipoEditar && (
                <FormAddEquipos
                    usuario={usuario}
                    editarEquipo={editarEquipo}
                    equipo={equipoEditar}
                    mode="edit"
                    onClose={() => setEquipoEditar(null)}
                />
            )}

            {equipoActivo && (
                <ModalEquipo
                    equipo={equipoActivo}
                    usuario={usuario}
                    agregarMiembro={agregarMiembro}
                    quitarMiembro={quitarMiembro}
                    cambiarLider={cambiarLider}
                    onClose={() => setEquipoActivoID(null)}
                />
            )}
        </div>
    );
}
