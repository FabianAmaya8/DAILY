import { useState } from "react";
import { RefreshCcw, Plus, UsersRound } from "lucide-react";
import { useEquipos } from "../../hooks/useEquipos";
import EquipoCard from "../../components/Admin/Equipos/EquipoCard";
import FormAddEquipos from "../../components/Admin/Equipos/FormAddEquipos";
import ModalEquipo from "../../components/Admin/Equipos/ModalEquipo";
import Cargando from "../../components/Depen/Cargando";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import styles from "../../assets/css/Admin/Equipos.module.scss";

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
    const [equipoEditar, setEquipoEditar] = useState(null);

    const equipoActivo = equipos.find((e) => e.id === equipoActivoID);

    if (loading) return <Cargando />;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>
                        <UsersRound size={20} aria-hidden="true" />
                        Equipos
                    </h1>
                    <p className={styles.subtitle}>
                        Estructura de equipos y responsables.
                    </p>
                </div>
                <div className={styles.actions}>
                    <Button
                        variant="ghost"
                        size="md"
                        leftIcon={RefreshCcw}
                        onClick={refetch}
                        aria-label="Actualizar"
                    >
                        Actualizar
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        leftIcon={Plus}
                        onClick={() => setOpenModal(true)}
                    >
                        Crear equipo
                    </Button>
                </div>
            </header>

            {equipos.length === 0 ? (
                <EmptyState
                    icon={UsersRound}
                    title="Aún no hay equipos"
                    description="Crea el primer equipo para empezar a asignar miembros."
                    action={
                        <Button
                            variant="primary"
                            leftIcon={Plus}
                            onClick={() => setOpenModal(true)}
                        >
                            Crear primer equipo
                        </Button>
                    }
                />
            ) : (
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
            )}

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
