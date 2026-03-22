import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import styles from "../../../assets/css/Admin/Equipos.module.scss";

export default function FormAddEquipos({
    usuario,
    crearEquipo,
    editarEquipo,
    equipo,
    mode = "create",
    onClose,
}) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [liderId, setLiderId] = useState("");
    const [lideres, setLideres] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ---------------------------
        Cargar datos si es edición
    --------------------------- */

    useEffect(() => {
        if (mode === "edit" && equipo) {
            setNombre(equipo.nombre || "");
            setDescripcion(equipo.descripcion || "");
            setLiderId(equipo.lider?.id || "");
        }
    }, [mode, equipo]);

    /* ---------------------------
        Obtener líderes
    --------------------------- */

    useEffect(() => {
        const fetchLideres = async () => {
            if (usuario?.rol !== "admin") return;

            const { data } = await supabase
                .from("personas")
                .select("id,nombre")
                .in("rol", ["lider", "admin"]);

            setLideres(data || []);
        };

        fetchLideres();
    }, [usuario]);

    /* ---------------------------
        Submit
    --------------------------- */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (mode === "create") {
            await crearEquipo({
                nombre,
                descripcion,
                lider_id: liderId || null,
            });
        }

        if (mode === "edit") {
            await editarEquipo(equipo.id, {
                nombre,
                descripcion,
                lider_id: liderId || null,
            });
        }

        setLoading(false);
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>
                    {mode === "edit" ? "Editar equipo" : "Crear equipo"}
                </h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre del equipo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={styles.input}
                        required
                    />

                    <textarea
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className={styles.textarea}
                    />

                    {usuario?.rol === "admin" && (
                        <select
                            value={liderId}
                            onChange={(e) => setLiderId(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Seleccionar líder</option>

                            {lideres.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.nombre}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.createButton}
                        >
                            {loading
                                ? "Guardando..."
                                : mode === "edit"
                                    ? "Guardar cambios"
                                    : "Crear equipo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
