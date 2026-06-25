import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, FolderKanban, AlertOctagon } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "../../utils/supabaseClient";
import { useProjects } from "../../hooks/useProjects";
import ProjectModal from "../../components/Admin/Proyectos/ProjectModal";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import styles from "../../assets/css/Admin/Proyectos.module.scss";

const PRIO_VARIANT = {
    Alta: "danger",
    Media: "warning",
    Baja: "info",
};

export default function Proyectos() {
    const { projects, deleteProject, createProject, updateProject } =
        useProjects();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [personas, setPersonas] = useState([]);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            const { data, error } = await supabase
                .from("personas")
                .select("id,nombre")
                .order("nombre");
            if (error) return;
            if (isMounted) setPersonas(data || []);
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSave = (data) => {
        if (selectedProject) {
            updateProject(selectedProject.id, data);
        } else {
            createProject(data);
        }
    };

    const handleDelete = async (project) => {
        const ok = await Swal.fire({
            icon: "warning",
            title: `Eliminar "${project.nombre}"?`,
            text: "Esta acción no se puede deshacer.",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
        });
        if (ok.isConfirmed) deleteProject(project.id);
    };

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>
                        <FolderKanban size={20} aria-hidden="true" />
                        Proyectos
                    </h1>
                    <p className={styles.subtitle}>
                        Catálogo de proyectos y sus líderes.
                    </p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={Plus}
                    onClick={() => {
                        setSelectedProject(null);
                        setIsModalOpen(true);
                    }}
                >
                    Nuevo proyecto
                </Button>
            </header>

            {projects.length === 0 ? (
                <EmptyState
                    icon={FolderKanban}
                    title="Aún no hay proyectos"
                    description="Crea el primer proyecto para asociarlo a dailys y tareas."
                />
            ) : (
                <Card padding="none">
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Área</th>
                                    <th>Tipo</th>
                                    <th>Prioridad</th>
                                    <th>Líder</th>
                                    <th className={styles.thRight}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p) => (
                                    <tr key={p.id}>
                                        <td className={styles.name}>{p.nombre}</td>
                                        <td className={styles.muted}>
                                            {p.cliente_area || "—"}
                                        </td>
                                        <td className={styles.muted}>
                                            {p.tipo || "—"}
                                        </td>
                                        <td>
                                            <Badge
                                                variant={
                                                    PRIO_VARIANT[p.prioridad] ||
                                                    "neutral"
                                                }
                                                size="sm"
                                            >
                                                {p.prioridad}
                                            </Badge>
                                        </td>
                                        <td>{p.lider?.nombre || "—"}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    leftIcon={Pencil}
                                                    onClick={() => {
                                                        setSelectedProject(p);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    leftIcon={Trash2}
                                                    onClick={() => handleDelete(p)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                project={selectedProject}
                people={personas}
            />
        </div>
    );
}
