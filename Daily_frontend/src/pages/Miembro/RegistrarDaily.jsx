import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, AlertTriangle } from "lucide-react";
import { useRegistrarDaily } from "../../hooks/useRegistrarDaily";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import styles from "../../assets/css/Miembro/RegistrarDaily.module.scss";

const CARGAS = [
    { value: "S", label: "S — 4 h" },
    { value: "M", label: "M — 6 h" },
    { value: "L", label: "L — 8 h" },
    { value: "XL", label: "XL — 10 h" },
];

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

    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await registrarDaily(form);
        if (!result) return;
        if (onSuccess) onSuccess(result.data);
        if (result.goToBloqueos) {
            navigate("/miembro/registrar-bloqueo");
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Registrar daily</h1>
                <p className={styles.pageSubtitle}>
                    Tarda 30 segundos. Lo que registres lo verá tu líder en su panel.
                </p>
            </header>

            <Card padding="lg" as="form" onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="ayer" className={styles.label}>
                        ¿Qué hiciste ayer?
                    </label>
                    <textarea
                        id="ayer"
                        rows={3}
                        value={form.ayer}
                        onChange={update("ayer")}
                        placeholder="Tareas, reuniones, decisiones tomadas…"
                        required
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="hoy" className={styles.label}>
                        ¿Qué harás hoy?
                    </label>
                    <textarea
                        id="hoy"
                        rows={3}
                        value={form.hoy}
                        onChange={update("hoy")}
                        placeholder="En qué te enfocarás. Sé concreto."
                        required
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="bloqueos" className={styles.label}>
                        ¿Tienes bloqueos? <span className={styles.optional}>(opcional)</span>
                    </label>
                    <textarea
                        id="bloqueos"
                        rows={2}
                        value={form.bloqueos}
                        onChange={update("bloqueos")}
                        placeholder="Algo que te impida avanzar. Si lo describes, te llevamos a registrarlo formalmente."
                        className={styles.textarea}
                    />
                    {form.bloqueos.trim() && (
                        <p className={styles.hint}>
                            <AlertTriangle size={12} aria-hidden="true" />
                            Tras guardar te preguntaremos si quieres registrar el
                            bloqueo formalmente.
                        </p>
                    )}
                </div>

                <div className={styles.row2}>
                    <div className={styles.formGroup}>
                        <label htmlFor="carga" className={styles.label}>
                            Carga estimada del día
                        </label>
                        <select
                            id="carga"
                            value={form.valor_carga}
                            onChange={update("valor_carga")}
                            className={styles.select}
                        >
                            {CARGAS.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        leftIcon={Save}
                        loading={loading}
                    >
                        {loading ? "Guardando…" : "Guardar daily"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
