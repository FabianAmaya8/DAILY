import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useProjects } from "../../hooks/useProjects";
import styles from "../../assets/css/Admin/Proyectos.module.scss";
import ProjectModal from "../../components/Admin/Proyectos/ProjectModal";

export default function Proyectos() {
    const { projects, deleteProject, createProject, updateProject } =
        useProjects();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [personas, setPersonas] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchPersonas = async () => {
            const { data, error } = await supabase
                .from("personas")
                .select("id,nombre")
                .order("nombre");

            if (error) {
                console.error("Error cargando personas:", error);
                return;
            }

            if (isMounted) setPersonas(data || []);
        };

        fetchPersonas();

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

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Proyectos</h1>

                <button
                    onClick={() => {
                        setSelectedProject(null);
                        setIsModalOpen(true);
                    }}
                    className={styles.createButton}
                >
                    + Nuevo Proyecto
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Área</th>
                            <th>Tipo</th>
                            <th>Prioridad</th>
                            <th>Líder</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.map((p) => (
                            <tr key={p.id}>
                                <td className={styles.name}>{p.nombre}</td>

                                <td>{p.cliente_area}</td>
                                <td>{p.tipo}</td>

                                <td>
                                    <span className={styles.priority}>
                                        {p.prioridad}
                                    </span>
                                </td>

                                <td>{p.lider?.nombre || "—"}</td>

                                <td className={styles.actions}>
                                    <button
                                        onClick={() => {
                                            setSelectedProject(p);
                                            setIsModalOpen(true);
                                        }}
                                        className={styles.editButton}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => deleteProject(p.id)}
                                        className={styles.deleteButton}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
