import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { supabase } from "../../../utils/supabaseClient";
import styles from "../../../assets/css/Admin/Equipos.module.scss";
import "../../../assets/css/Admin/Select.css";
import Avatar from "../../Depen/Avatar";

export default function ModalEquipo({
    equipo,
    usuario,
    onClose,
    agregarMiembro,
    quitarMiembro,
    cambiarLider,
}) {
    console.log("🚀 ~ ModalEquipo ~ equipo:", equipo)
    const [personas, setPersonas] = useState([]);
    const [personaSeleccionada, setPersonaSeleccionada] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchPersonas = async () => {
            const { data, error } = await supabase
                .from("personas")
                .select("id,nombre")
                .order("nombre");

            if (error) {
                console.error("Error cargando personas:", error);
                return;
            }

            if (isMounted) setPersonas(data || []);
        };

        fetchPersonas();

        return () => {
            isMounted = false;
        };
    }, []);

    // IDs de miembros actuales
    const miembrosIds = useMemo(
        () => equipo.miembros?.map((m) => m.persona.id) || [],
        [equipo],
    );

    // Personas disponibles para agregar
    const personasDisponibles = useMemo(
        () => personas.filter((p) => !miembrosIds.includes(p.id)),
        [personas, miembrosIds],
    );

    const handleAgregar = async () => {
        if (!personaSeleccionada) return;

        try {
            setLoading(true);

            await agregarMiembro(equipo.id, personaSeleccionada);

            setPersonaSeleccionada("");
        } catch (error) {
            console.error("Error agregando miembro:", error);
        } finally {
            setLoading(false);
        }
    };

    const puedeGestionar = usuario?.rol === "admin" || usuario?.rol === "lider";

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{equipo.nombre}</h2>

                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <p className={styles.description}>{equipo.descripcion}</p>

                {/* Lider */}

                <p className={styles.meta}>
                    Líder actual:
                    <span className={styles.highlight}>
                        {equipo.lider?.nombre || "Sin líder"}
                    </span>
                </p>

                {/* Agregar miembro */}
                {puedeGestionar && (
                    <div className={styles.addMemberWrapper}>
                        <div className={styles.addMemberGroup}>
                            <Select
                                className={styles.reactSelect}
                                classNamePrefix="react-select"
                                placeholder="Seleccionar persona"
                                isClearable
                                options={personasDisponibles.map((p) => ({
                                    value: p.id,
                                    label: p.nombre,
                                }))}
                                value={
                                    personasDisponibles
                                        .map((p) => ({
                                            value: p.id,
                                            label: p.nombre,
                                        }))
                                        .find((opt) => opt.value === personaSeleccionada) || null
                                }
                                onChange={(selected) =>
                                    setPersonaSeleccionada(selected?.value || "")
                                }
                            />

                            <button
                                onClick={handleAgregar}
                                disabled={!personaSeleccionada || loading}
                                className={styles.addButton}
                            >
                                {loading ? "..." : "Agregar"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Miembros */}
                <div>
                    <h3>Miembros</h3>

                    <div className={styles.membersList}>
                        {(equipo.miembros || []).map((m) => (
                            <div key={m.persona.id} className={styles.memberRow}>
                                <div className={styles.memberInfo}>
                                    <Avatar userId={m.persona.id} Nombre={m.persona.nombre} />
                                    <span>{m.persona.nombre}</span>
                                </div>

                                {puedeGestionar && (
                                    <div className={styles.memberActions}>
                                        {usuario?.rol === "admin" &&
                                            m.persona.rol === "lider" &&
                                            m.persona.id !== equipo.lider.id && (
                                                <button
                                                    onClick={() =>
                                                        cambiarLider(equipo.id, m.persona.id)
                                                    }
                                                    className={styles.viewButton}
                                                >
                                                    Hacer líder
                                                </button>
                                            )}

                                        <button
                                            onClick={() =>
                                                quitarMiembro(
                                                    equipo.id,
                                                    m.persona.id
                                                )
                                            }
                                            className={styles.deleteButton}
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
