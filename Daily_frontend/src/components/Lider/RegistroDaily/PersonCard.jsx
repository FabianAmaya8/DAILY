import { useState } from "react";
import { ShieldAlert, Plus } from "lucide-react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import Avatar from "../../Depen/Avatar";
import InlineEdit from "./InlineEdit";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

const SEVERIDADES = [
    { value: "bajo", label: "Baja" },
    { value: "medio", label: "Media" },
    { value: "alto", label: "Alta" },
];

export default function PersonCard({ data, onChange, personas }) {
    const [person, setPerson] = useState(data);

    const update = (updated) => {
        setPerson(updated);
        onChange(updated);
    };

    const handleField = (section, field, value) => {
        update({
            ...person,
            [section]: { ...person[section], [field]: value },
        });
    };

    const handleSelectPersona = (personaId) => {
        const personaSeleccionada = personas.find((p) => p.id === personaId);
        if (!personaSeleccionada) return;
        update({ ...person, persona: personaSeleccionada });
    };

    const tieneBloqueo = !!person.bloqueo?.tiene_bloqueo;

    const toggleBloqueo = () => {
        handleField("bloqueo", "tiene_bloqueo", !tieneBloqueo);
    };

    return (
        <Card padding="md" className={styles.personCard}>
            <header className={styles.personHeader}>
                <Avatar
                    Nombre={person.persona?.nombre}
                    userId={person.persona?.id}
                    size="md"
                />
                <div className={styles.personHeaderText}>
                    <h4 className={styles.personName}>
                        {person.persona?.nombre || "Sin asignar"}
                    </h4>
                    <select
                        className={styles.select}
                        value={person.persona?.id || ""}
                        onChange={(e) => handleSelectPersona(e.target.value)}
                        aria-label="Cambiar persona"
                    >
                        <option value="">Cambiar persona…</option>
                        {personas?.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <section className={styles.personSection}>
                <span className={styles.fieldLabel}>Ayer</span>
                <InlineEdit
                    value={person.daily?.que_hice_ayer}
                    onChange={(v) => handleField("daily", "que_hice_ayer", v)}
                    multiline
                    placeholder="¿Qué hizo ayer?"
                />
            </section>

            <section className={styles.personSection}>
                <span className={styles.fieldLabel}>Hoy</span>
                <InlineEdit
                    value={person.daily?.que_hare_hoy}
                    onChange={(v) => handleField("daily", "que_hare_hoy", v)}
                    multiline
                    placeholder="¿Qué hará hoy?"
                />
            </section>

            <section className={styles.personSection}>
                <button
                    type="button"
                    className={`${styles.blockToggle} ${tieneBloqueo ? styles.blockActive : ""}`}
                    onClick={toggleBloqueo}
                    aria-pressed={tieneBloqueo}
                >
                    {tieneBloqueo ? (
                        <ShieldAlert size={14} aria-hidden="true" />
                    ) : (
                        <Plus size={14} aria-hidden="true" />
                    )}
                    <span>
                        {tieneBloqueo ? "Tiene bloqueo" : "Marcar bloqueo"}
                    </span>
                    {tieneBloqueo && (
                        <Badge variant="warning" size="sm" dot>
                            Activo
                        </Badge>
                    )}
                </button>

                {tieneBloqueo && (
                    <div className={styles.blockContent}>
                        <div className={styles.formGroup}>
                            <span className={styles.fieldLabel}>Descripción</span>
                            <InlineEdit
                                value={person.bloqueo?.descripcion}
                                onChange={(v) =>
                                    handleField("bloqueo", "descripcion", v)
                                }
                                multiline
                                placeholder="Describe el bloqueo…"
                            />
                        </div>

                        <div className={styles.row2}>
                            <div className={styles.formGroup}>
                                <span className={styles.fieldLabel}>Tipo</span>
                                <InlineEdit
                                    value={person.bloqueo?.tipo}
                                    onChange={(v) =>
                                        handleField("bloqueo", "tipo", v)
                                    }
                                    placeholder="Tipo (API, QA…)"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label
                                    htmlFor={`severidad-${person.persona?.id}`}
                                    className={styles.fieldLabel}
                                >
                                    Severidad
                                </label>
                                <select
                                    id={`severidad-${person.persona?.id}`}
                                    className={styles.select}
                                    value={person.bloqueo?.severidad || ""}
                                    onChange={(e) =>
                                        handleField(
                                            "bloqueo",
                                            "severidad",
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">Selecciona…</option>
                                    {SEVERIDADES.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Card>
    );
}
