import { useState, useMemo } from "react";
import { Save, AlertOctagon, UserX } from "lucide-react";
import PersonCard from "./PersonCard";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { EmptyState } from "../../ui/EmptyState";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

export default function DailyResult({
    data,
    personas,
    handleGuardar,
    loading,
    error,
}) {
    const [people, setPeople] = useState(data.people || []);

    const updatePerson = (index, updatedPerson) => {
        const newPeople = [...people];
        newPeople[index] = updatedPerson;
        setPeople(newPeople);
    };

    const personasFaltantes = useMemo(() => {
        const ids = people.map((p) => p.persona?.id).filter(Boolean);
        return personas.filter((p) => !ids.includes(p.id));
    }, [people, personas]);

    return (
        <div className={styles.resultContainer}>
            {/* Lista de personas (col izquierda) */}
            <div className={styles.peopleContainer}>
                {people.length === 0 ? (
                    <EmptyState
                        icon={UserX}
                        title="La transcripción no detectó participantes"
                        description="Revisa la transcripción y vuelve a procesarla."
                    />
                ) : (
                    people.map((person, index) => (
                        <PersonCard
                            key={person.persona?.id || `idx-${index}`}
                            data={person}
                            personas={personas}
                            onChange={(updated) => updatePerson(index, updated)}
                        />
                    ))
                )}
            </div>

            {/* Sidebar con resumen + acción */}
            <aside className={styles.sidebar}>
                <Card padding="md" className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>Resumen</h3>

                    <dl className={styles.summary}>
                        <div className={styles.summaryRow}>
                            <dt>Equipo</dt>
                            <dd>{data.team_name || "—"}</dd>
                        </div>
                        <div className={styles.summaryRow}>
                            <dt>Fecha</dt>
                            <dd>{data.meeting_date || "—"}</dd>
                        </div>
                        <div className={styles.summaryRow}>
                            <dt>Procesados</dt>
                            <dd>
                                <Badge variant="primary" size="sm">
                                    {people.length}
                                </Badge>
                            </dd>
                        </div>
                    </dl>

                    {personasFaltantes.length > 0 && (
                        <div className={styles.missingBlock}>
                            <h4 className={styles.missingTitle}>
                                <AlertOctagon size={14} aria-hidden="true" />
                                No aparecieron en la reunión
                            </h4>
                            <ul className={styles.missingList}>
                                {personasFaltantes.map((p) => (
                                    <li key={p.id}>{p.nombre}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorBlock} role="alert">
                            <AlertOctagon size={14} aria-hidden="true" />
                            <span>{error}</span>
                        </div>
                    )}

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        leftIcon={Save}
                        loading={loading}
                        onClick={() => handleGuardar({ ...data, people })}
                        disabled={people.length === 0}
                    >
                        {loading ? "Guardando…" : "Guardar en BD"}
                    </Button>
                </Card>
            </aside>
        </div>
    );
}
