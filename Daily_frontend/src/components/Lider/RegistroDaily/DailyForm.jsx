import React, { useState } from "react";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

export default function DailyForm({ 
    equipos, 
    personas,
    seleccionarEquipo, 
    onSubmit, 
    loading 
}) {
    const [form, setForm] = useState({
        content: "",
        source_type: "teams",
        meeting_date: "",
        team_name: "",
        language: "es",
        duration_minutes: 30,
        participants_count: 1,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 🔥 FORMATEAR MIEMBROS DEL EQUIPO
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
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Registrar Daily</h2>

                <textarea
                    name="content"
                    placeholder="Texto de la reunión..."
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                />

                <input
                    type="date"
                    name="meeting_date"
                    onChange={handleChange}
                    required
                    className={styles.input}
                />

                <select
                    name="team_name"
                    onChange={(e) => {
                        handleChange(e);
                        seleccionarEquipo(e.target.value);
                    }}
                    required
                    className={styles.input}
                >
                    <option value="">Selecciona equipo</option>
                    {equipos?.map((e) => (
                        <option key={e.id} value={e.nombre}>
                            {e.nombre}
                        </option>
                    ))}
                </select>

                {/* 🔥 VISUALIZAR MIEMBROS */}
                {personas?.length > 0 && (
                    <div className={styles.membersPreview}>
                        <h4>Miembros del equipo</h4>
                        <ul>
                            {personas.map((p) => (
                                <li key={p.id}>{p.nombre}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? "Procesando..." : "Enviar"}
                </button>
            </form>
        </>
    );
}