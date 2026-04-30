import React, { useState, useMemo } from "react";
import PersonCard from "./PersonCard";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

export default function DailyResult({
    data,
    personas,
    handleGuardar,
    loading,
    error
}) {
    // 🔥 estado editable real
    const [people, setPeople] = useState(data.people);

    // =========================
    // UPDATE PERSON
    // =========================
    const updatePerson = (index, updatedPerson) => {
        const newPeople = [...people];
        newPeople[index] = updatedPerson;
        setPeople(newPeople);
    };

    // =========================
    // PERSONAS QUE NO SALIERON EN LA DAILY
    // =========================
    const personasFaltantes = useMemo(() => {
        const idsEnDaily = people.map(p => p.persona?.id);

        return personas.filter(p => !idsEnDaily.includes(p.id));
    }, [people, personas]);

    return (
        <div className={styles.resultContainer}>
            {/* =========================
                LISTA PERSONAS
            ========================= */}
            <div className={styles.peopleContainer}>
                {people.map((person, index) => (
                    <PersonCard
                        key={person.persona?.id || index}
                        data={person}
                        personas={personas}
                        onChange={(updated) =>
                            updatePerson(index, updated)
                        }
                    />
                ))}
            </div>

            {/* =========================
                SIDEBAR
            ========================= */}
            <div className={styles.sidebar}>
                <h3>Resumen</h3>

                <p>
                    <strong>Equipo:</strong> {data.team_name}
                </p>

                <p>
                    <strong>Fecha:</strong> {data.meeting_date}
                </p>

                <p>
                    <strong>Procesados:</strong> {people.length}
                </p>

                {/* 🔥 PERSONAS FALTANTES */}
                {personasFaltantes.length > 0 && (
                    <div>
                        <p>
                            <strong>Faltaron:</strong>
                        </p>
                        <ul style={{ paddingLeft: "16px" }}>
                            {personasFaltantes.map(p => (
                                <li key={p.id}>{p.nombre}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button
                    onClick={() => handleGuardar({ ...data, people })}
                    disabled={loading}
                    className={styles.button}
                >
                    {loading ? "Guardando..." : "Guardar en BD"}
                </button>
            </div>
        </div>
    );
}