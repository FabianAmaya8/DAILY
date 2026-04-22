import React, { useState } from "react";
import PersonCard from "./PersonCard";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

export default function DailyResult({ data, personas, handleGuardar, loading , error}) {
    const [people, setPeople] = useState(
        data.people.map(p => ({
            ...p,
            persona_id: null
        }))
    );

    const updatePerson = (index, updatedPerson) => {
        const newPeople = [...people];
        newPeople[index] = updatedPerson;
        setPeople(newPeople);
    };

    return (
        <div className={styles.resultContainer}>
            <div className={styles.peopleContainer}>
                {people.map((person, index) => (
                    <PersonCard
                        key={index}
                        data={person}
                        personas={personas}
                        onChange={(updated) =>
                            updatePerson(index, updated)
                        }
                    />
                ))}
            </div>

            <div className={styles.sidebar}>
                <h3>Resumen</h3>

                <p>
                    <strong>Equipo:</strong> {data.team_name}
                </p>

                <p>
                    <strong>Fecha:</strong> {data.meeting_date}
                </p>

                <p>
                    <strong>Procesados:</strong> {data.processed_count}
                </p>

                <button onClick={handleGuardar}>
                    Guardar en BD
                </button>
            </div>
        </div>
    );
}