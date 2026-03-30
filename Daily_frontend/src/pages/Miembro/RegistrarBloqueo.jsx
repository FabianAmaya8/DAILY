import { useState } from "react";
import { useRegistrarBloqueo } from "../../hooks/useRegistrarBloqueo";
import styles from "../../assets/css/Miembro/RegistrarDaily.module.scss";

export default function RegistrarBloqueo({
    dailyId,
    onClose = () => {},
}) {
    const { crearBloqueo, loading } = useRegistrarBloqueo();

    const [form, setForm] = useState({
        tipo: "",
        severidad: "Media",
        fecha_limite: "",
        notas: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = await crearBloqueo(form, dailyId);

        if (data) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.card}>
            <h3>Nuevo Bloqueo</h3>

            {/* TIPO */}
            <div className={styles.formGroup}>
                <label>Tipo de bloqueo</label>
                <input
                    type="text"
                    placeholder="Ej: API, QA, Negocio"
                    value={form.tipo}
                    onChange={(e) =>
                        setForm({ ...form, tipo: e.target.value })
                    }
                    required
                />
            </div>

            {/* SEVERIDAD */}
            <div className={styles.formGroup}>
                <label>Severidad</label>
                <select
                    value={form.severidad}
                    onChange={(e) =>
                        setForm({ ...form, severidad: e.target.value })
                    }
                >
                    <option>Baja</option>
                    <option>Media</option>
                    <option>Alta</option>
                    <option>Crítica</option>
                </select>
            </div>

            {/* FECHA */}
            <div className={styles.formGroup}>
                <label>Fecha límite</label>
                <input
                    type="date"
                    value={form.fecha_limite}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            fecha_limite: e.target.value,
                        })
                    }
                />
            </div>

            {/* NOTAS */}
            <div className={styles.formGroup}>
                <label>Notas</label>
                <textarea
                    placeholder="Describe el bloqueo..."
                    value={form.notas}
                    onChange={(e) =>
                        setForm({ ...form, notas: e.target.value })
                    }
                />
            </div>

            <button disabled={loading}>
                {loading ? "Guardando..." : "Crear Bloqueo"}
            </button>
        </form>
    );
}