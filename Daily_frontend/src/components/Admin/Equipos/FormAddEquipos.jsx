import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "../../../utils/supabaseClient";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
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

    useEffect(() => {
        if (mode === "edit" && equipo) {
            setNombre(equipo.nombre || "");
            setDescripcion(equipo.descripcion || "");
            setLiderId(equipo.lider?.id || "");
        }
    }, [mode, equipo]);

    useEffect(() => {
        const fetchLideres = async () => {
            if (usuario?.rol !== "admin") return;
            const { data } = await supabase
                .from("personas")
                .select("id,nombre")
                .in("rol", ["lider", "admin"])
                .order("nombre");
            setLideres(data || []);
        };
        fetchLideres();
    }, [usuario]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            nombre,
            descripcion,
            lider_id: liderId || null,
        };

        if (mode === "create") {
            await crearEquipo(payload);
        } else {
            await editarEquipo(equipo.id, payload);
        }

        setLoading(false);
        onClose();
    };

    const isEdit = mode === "edit";

    return (
        <Modal
            open
            onClose={onClose}
            title={isEdit ? "Editar equipo" : "Nuevo equipo"}
            description={
                isEdit
                    ? "Modifica los datos del equipo."
                    : "Crea un equipo y asigna su líder."
            }
            size="md"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="equipo-form"
                        variant="primary"
                        leftIcon={Save}
                        loading={loading}
                    >
                        {isEdit ? "Guardar cambios" : "Crear equipo"}
                    </Button>
                </>
            }
        >
            <form
                id="equipo-form"
                onSubmit={handleSubmit}
                className={styles.form}
                noValidate
            >
                <Input
                    label="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Ej: Plataforma · Squad de pagos"
                />

                <div className={styles.formGroup}>
                    <label
                        htmlFor="equipo-desc"
                        className={styles.fieldLabel}
                    >
                        Descripción
                    </label>
                    <textarea
                        id="equipo-desc"
                        rows={3}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className={styles.textarea}
                        placeholder="Misión y alcance del equipo (opcional)"
                    />
                </div>

                {usuario?.rol === "admin" && (
                    <div className={styles.formGroup}>
                        <label
                            htmlFor="equipo-lider"
                            className={styles.fieldLabel}
                        >
                            Líder
                        </label>
                        <select
                            id="equipo-lider"
                            value={liderId}
                            onChange={(e) => setLiderId(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Sin líder asignado</option>
                            {lideres.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </form>
        </Modal>
    );
}
