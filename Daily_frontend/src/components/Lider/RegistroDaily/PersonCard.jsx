import React, { useState } from "react";
import { MessageSquareWarning } from "lucide-react";
import Avatar from "../../Depen/Avatar";
import InlineEdit from "./InlineEdit";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

export default function PersonCard({ data, onChange, personas }) {
    const [person, setPerson] = useState(data);

    // =========================
    // UPDATE GENERAL
    // =========================
    const update = (updated) => {
        setPerson(updated);
        onChange(updated);
    };

    // =========================
    // EDITAR CAMPOS
    // =========================
    const handleChange = (section, field, value) => {
        const updated = {
            ...person,
            [section]: {
                ...person[section],
                [field]: value,
            },
        };

        update(updated);
    };

    // =========================
    // CAMBIAR PERSONA 🔥
    // =========================
    const handleSelectPersona = (personaId) => {
        const personaSeleccionada = personas.find(
            (p) => p.id === personaId
        );

        if (!personaSeleccionada) return;

        update({
            ...person,
            persona: personaSeleccionada,
        });
    };

    // =========================
    // TOGGLE BLOQUEO
    // =========================
    const toggleBloqueo = () => {
        handleChange(
            "bloqueo",
            "tiene_bloqueo",
            !person.bloqueo?.tiene_bloqueo
        );
    };

    const severidades = [
        { value: "bajo", label: "Bajo" },
        { value: "medio", label: "Medio" },
        { value: "alto", label: "Alto" },
    ];

    return (
        <div className={styles.card}>
            {/* HEADER */}
            <div className={styles.cardTop}>
                <Avatar Nombre={person.persona?.nombre} />

                <div className={styles.headerInfo}>
                    <h4 className={styles.name}>
                        {person.persona?.nombre}
                    </h4>

                    <span className={styles.subtle}>
                        Edita el daily directamente
                    </span>

                    {/* 🔥 SELECT PERSONA REAL */}
                    <select
                        className={styles.select}
                        value={person.persona?.id || ""}
                        onChange={(e) =>
                            handleSelectPersona(e.target.value)
                        }
                    >
                        <option value="">
                            Seleccionar persona
                        </option>

                        {personas?.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* =========================
                DAILY
            ========================= */}
            <div className={styles.section}>
                <span className={styles.sectionTitle}>Ayer</span>
                <InlineEdit
                    value={person.daily?.que_hice_ayer}
                    onChange={(val) =>
                        handleChange("daily", "que_hice_ayer", val)
                    }
                    multiline
                    placeholder="¿Qué hiciste ayer?"
                />

                <span className={styles.sectionTitle}>Hoy</span>
                <InlineEdit
                    value={person.daily?.que_hare_hoy}
                    onChange={(val) =>
                        handleChange("daily", "que_hare_hoy", val)
                    }
                    multiline
                    placeholder="¿Qué harás hoy?"
                />
            </div>

            {/* =========================
                BLOQUEO
            ========================= */}
            <div className={styles.section}>
                <div
                    className={`${styles.blockToggle} ${
                        person.bloqueo?.tiene_bloqueo
                            ? styles.active
                            : ""
                    }`}
                    onClick={toggleBloqueo}
                >
                    <div className={styles.checkbox}>
                        {person.bloqueo?.tiene_bloqueo && (
                            <MessageSquareWarning strokeWidth={3} />
                        )}
                    </div>

                    <span>Bloqueo</span>
                </div>

                {person.bloqueo?.tiene_bloqueo && (
                    <>
                        <div className={styles.blockContent}>
                            <span className={styles.sectionTitle}>
                                Descripción
                            </span>

                            <InlineEdit
                                value={person.bloqueo?.descripcion}
                                onChange={(val) =>
                                    handleChange(
                                        "bloqueo",
                                        "descripcion",
                                        val
                                    )
                                }
                                multiline
                                placeholder="Describe el bloqueo..."
                            />
                        </div>

                        <div className={styles.blockContent}>
                            <span className={styles.sectionTitle}>
                                Tipo
                            </span>

                            <InlineEdit
                                value={person.bloqueo?.tipo}
                                onChange={(val) =>
                                    handleChange(
                                        "bloqueo",
                                        "tipo",
                                        val
                                    )
                                }
                                multiline
                                placeholder="Tipo de bloqueo..."
                            />
                        </div>

                        <div className={styles.blockContent}>
                            <span className={styles.sectionTitle}>
                                Severidad
                            </span>

                            <select
                                className={styles.select}
                                value={person.bloqueo?.severidad || ""}
                                onChange={(e) =>
                                    handleChange(
                                        "bloqueo",
                                        "severidad",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Selecciona severidad
                                </option>

                                {severidades.map((s) => (
                                    <option
                                        key={s.value}
                                        value={s.value}
                                    >
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}