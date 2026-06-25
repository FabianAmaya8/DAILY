import { useState } from "react";
import { ShieldAlert, Save } from "lucide-react";
import { useRegistrarBloqueo } from "../../hooks/useRegistrarBloqueo";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import styles from "../../assets/css/Miembro/RegistrarDaily.module.scss";

const SEVERIDADES = ["Baja", "Media", "Alta", "Crítica"];

export default function RegistrarBloqueo({ dailyId, onClose }) {
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
        if (data && onClose) onClose();
    };

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Registrar bloqueo</h1>
                <p className={styles.pageSubtitle}>
                    Sube un bloqueo formal a tu líder con severidad y fecha
                    límite. Aparecerá en su panel inmediatamente.
                </p>
            </header>

            <Card padding="lg" as="form" onSubmit={handleSubmit}>
                <Input
                    label="Tipo de bloqueo"
                    placeholder="Ej: API, QA, Negocio, Dependencia externa…"
                    leftIcon={ShieldAlert}
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    required
                />

                <div className={styles.row2}>
                    <div className={styles.formGroup}>
                        <label htmlFor="severidad" className={styles.label}>
                            Severidad
                        </label>
                        <select
                            id="severidad"
                            value={form.severidad}
                            onChange={(e) =>
                                setForm({ ...form, severidad: e.target.value })
                            }
                            className={styles.select}
                        >
                            {SEVERIDADES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        type="date"
                        label="Fecha límite"
                        value={form.fecha_limite}
                        onChange={(e) =>
                            setForm({ ...form, fecha_limite: e.target.value })
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="notas" className={styles.label}>
                        Notas <span className={styles.optional}>(contexto)</span>
                    </label>
                    <textarea
                        id="notas"
                        rows={4}
                        value={form.notas}
                        onChange={(e) =>
                            setForm({ ...form, notas: e.target.value })
                        }
                        placeholder="Describe el bloqueo, pasos intentados y qué necesitas para desbloquearlo."
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.actions}>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        leftIcon={Save}
                        loading={loading}
                    >
                        {loading ? "Guardando…" : "Crear bloqueo"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
