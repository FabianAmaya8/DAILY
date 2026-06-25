import { useState } from "react";
import { Send, Users } from "lucide-react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Badge } from "../../ui/Badge";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

export default function DailyForm({
    equipos,
    personas,
    seleccionarEquipo,
    onSubmit,
    loading,
}) {
    const [form, setForm] = useState({
        content: "",
        source_type: "teams",
        meeting_date: "",
        team_name: "",
        language: "es",
        duration_minutes: 30,
    });

    const handleChange = (key) => (e) =>
        setForm({ ...form, [key]: e.target.value });

    const handleTeamChange = (e) => {
        handleChange("team_name")(e);
        seleccionarEquipo(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const members_team = personas.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            correo: p.correo,
            rol: p.rol,
        }));

        const payload = {
            content: form.content,
            source_type: form.source_type,
            meeting_date: form.meeting_date,
            team_name: form.team_name,
            members_team,
            language: form.language,
            metadata: {
                duration_minutes: Number(form.duration_minutes),
                participants_count: Number(personas.length),
            },
        };

        onSubmit(payload);
    };

    return (
        <Card padding="lg" as="form" onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="dailyform-content" className={styles.label}>
                    Transcripción de la reunión
                </label>
                <textarea
                    id="dailyform-content"
                    rows={8}
                    value={form.content}
                    onChange={handleChange("content")}
                    placeholder="Pega aquí la transcripción de la reunión de daily…"
                    required
                    className={styles.textarea}
                />
            </div>

            <div className={styles.row2}>
                <Input
                    type="date"
                    label="Fecha de la reunión"
                    value={form.meeting_date}
                    onChange={handleChange("meeting_date")}
                    required
                />

                <div className={styles.formGroup}>
                    <label htmlFor="dailyform-team" className={styles.label}>
                        Equipo
                    </label>
                    <select
                        id="dailyform-team"
                        value={form.team_name}
                        onChange={handleTeamChange}
                        required
                        className={styles.select}
                    >
                        <option value="">Selecciona equipo…</option>
                        {equipos?.map((e) => (
                            <option key={e.id} value={e.nombre}>
                                {e.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {personas?.length > 0 && (
                <div className={styles.membersPreview}>
                    <div className={styles.membersHeader}>
                        <Users size={14} aria-hidden="true" />
                        <span className={styles.membersTitle}>
                            Miembros del equipo
                        </span>
                        <Badge variant="primary" size="sm">
                            {personas.length}
                        </Badge>
                    </div>
                    <ul className={styles.membersList}>
                        {personas.map((p) => (
                            <li key={p.id}>{p.nombre}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.actions}>
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    leftIcon={Send}
                    loading={loading}
                >
                    {loading ? "Procesando…" : "Procesar transcripción"}
                </Button>
            </div>
        </Card>
    );
}
