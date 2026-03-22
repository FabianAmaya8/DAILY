import { useEffect, useState } from "react";
import styles from "../../../assets/css/Admin/Proyectos.module.scss";

export default function ProjectModal({
    isOpen,
    onClose,
    onSave,
    project,
    people,
}) {
    const [form, setForm] = useState({
        nombre: "",
        cliente_area: "",
        tipo: "",
        estado: "Activo",
        prioridad: "Media",
        lider_proyecto_id: "",
    });

    useEffect(() => {
        if (project) {
            setForm({
                nombre: project.nombre || "",
                cliente_area: project.cliente_area || "",
                tipo: project.tipo || "",
                estado: project.estado || "Activo",
                prioridad: project.prioridad || "Media",
                lider_proyecto_id: project.lider_proyecto_id || "",
            });
        }
    }, [project]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        onSave(form);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{project ? "Editar Proyecto" : "Nuevo Proyecto"}</h2>

                    <button onClick={onClose} className={styles.closeButton}>
                        ✕
                    </button>
                </div>

                <div className={styles.form}>
                    <div className={styles.field}>
                        <label>Nombre</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Cliente / Área</label>
                        <input
                            name="cliente_area"
                            value={form.cliente_area}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Tipo</label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                        >
                            <option value="">Tipo</option>
                            <option value="RPA">RPA</option>
                            <option value="BI">BI</option>
                            <option value="PP">Power Platform</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Prioridad</label>
                        <select
                            name="prioridad"
                            value={form.prioridad}
                            onChange={handleChange}
                        >
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Líder</label>
                        <select
                            name="lider_proyecto_id"
                            value={form.lider_proyecto_id || ""}
                            onChange={handleChange}
                        >
                            <option value="">Asignar líder</option>

                            {people.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handleSubmit}
                            className={styles.saveButton}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
