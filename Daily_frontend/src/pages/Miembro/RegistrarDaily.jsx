import { useState } from "react";
import { useRegistrarDaily } from "../../hooks/useRegistrarDaily";
import styles from "../../assets/css/Miembro/RegistrarDaily.module.scss";
import { useNavigate } from "react-router-dom";

export default function RegistrarDaily({ onSuccess }) {
    const navigate = useNavigate();
    const { registrarDaily, loading } = useRegistrarDaily();

    const [form, setForm] = useState({
        ayer: "",
        hoy: "",
        bloqueos: "",
        modelo_carga: "tshirt",
        valor_carga: "M",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await registrarDaily(form);

        if (!result) return;

        if (onSuccess) onSuccess(result.data);

        if (result.goToBloqueos) {
            navigate("/miembro/RegistrarBloqueos");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.card}>
            <h3>Registrar Daily</h3>

            {/* AYER */}
            <div className={styles.formGroup}>
                <label>¿Qué hiciste ayer?</label>
                <textarea
                    value={form.ayer}
                    onChange={(e) => setForm({ ...form, ayer: e.target.value })}
                    required
                />
            </div>

            {/* HOY */}
            <div className={styles.formGroup}>
                <label>¿Qué harás hoy?</label>
                <textarea
                    value={form.hoy}
                    onChange={(e) => setForm({ ...form, hoy: e.target.value })}
                    required
                />
            </div>

            {/* BLOQUEOS TEXTO */}
            <div className={styles.formGroup}>
                <label>¿Tienes bloqueos?</label>
                <textarea
                    placeholder="Describe si tienes algún bloqueo..."
                    value={form.bloqueos}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            bloqueos: e.target.value,
                        })
                    }
                />
            </div>

            {/* CARGA */}
            <div className={styles.formGroup}>
                <label>Carga estimada (T-Shirt)</label>
                <select
                    value={form.valor_carga}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            valor_carga: e.target.value,
                        })
                    }
                >
                    <option value="S">S (4h)</option>
                    <option value="M">M (6h)</option>
                    <option value="L">L (8h)</option>
                    <option value="XL">XL (10h)</option>
                </select>
            </div>

            <button disabled={loading}>
                {loading ? "Guardando..." : "Guardar Daily"}
            </button>
        </form>
    );
}
