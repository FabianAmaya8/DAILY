import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { UserPlus, X, Crown } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "../../../utils/supabaseClient";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { EmptyState } from "../../ui/EmptyState";
import Avatar from "../../Depen/Avatar";
import styles from "../../../assets/css/Admin/Equipos.module.scss";

// Estilos react-select alineados con tokens del design system
const selectStyles = {
    control: (base, state) => ({
        ...base,
        background: "var(--color-input-bg)",
        borderColor: state.isFocused
            ? "var(--color-primary)"
            : "var(--color-input-border)",
        boxShadow: state.isFocused
            ? "0 0 0 3px var(--color-primary-soft)"
            : "none",
        borderRadius: "var(--radius-md)",
        minHeight: 40,
        "&:hover": { borderColor: "var(--color-input-border-hover)" },
    }),
    menu: (base) => ({
        ...base,
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        zIndex: 200,
    }),
    option: (base, state) => ({
        ...base,
        background: state.isFocused
            ? "var(--color-bg-hover)"
            : "transparent",
        color: "var(--color-text-primary)",
        cursor: "pointer",
    }),
    singleValue: (base) => ({ ...base, color: "var(--color-text-primary)" }),
    input: (base) => ({ ...base, color: "var(--color-text-primary)" }),
    placeholder: (base) => ({
        ...base,
        color: "var(--color-input-placeholder)",
    }),
};

export default function ModalEquipo({
    equipo,
    usuario,
    onClose,
    agregarMiembro,
    quitarMiembro,
    cambiarLider,
}) {
    const [personas, setPersonas] = useState([]);
    const [personaSeleccionada, setPersonaSeleccionada] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            const { data, error } = await supabase
                .from("personas")
                .select("id,nombre,rol")
                .order("nombre");
            if (error) return;
            if (isMounted) setPersonas(data || []);
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const miembrosIds = useMemo(
        () => equipo.miembros?.map((m) => m.persona.id) || [],
        [equipo],
    );

    const personasDisponibles = useMemo(
        () => personas.filter((p) => !miembrosIds.includes(p.id)),
        [personas, miembrosIds],
    );

    const options = personasDisponibles.map((p) => ({
        value: p.id,
        label: p.nombre,
    }));

    const handleAgregar = async () => {
        if (!personaSeleccionada) return;
        try {
            setLoading(true);
            await agregarMiembro(equipo.id, personaSeleccionada);
            setPersonaSeleccionada("");
        } finally {
            setLoading(false);
        }
    };

    const handleQuitar = async (m) => {
        const ok = await Swal.fire({
            icon: "warning",
            title: `Quitar a ${m.persona.nombre}?`,
            showCancelButton: true,
            confirmButtonText: "Quitar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
        });
        if (ok.isConfirmed) quitarMiembro(equipo.id, m.persona.id);
    };

    const puedeGestionar = usuario?.rol === "admin" || usuario?.rol === "lider";

    return (
        <Modal
            open
            onClose={onClose}
            title={equipo.nombre}
            description={equipo.descripcion || "Gestión del equipo y sus miembros."}
            size="lg"
        >
            <div className={styles.modalBody}>
                {/* Líder actual */}
                <div className={styles.leaderRow}>
                    <Crown size={14} aria-hidden="true" />
                    <span className={styles.leaderLabel}>Líder actual:</span>
                    {equipo.lider?.nombre ? (
                        <Badge variant="warning" size="sm">
                            {equipo.lider.nombre}
                        </Badge>
                    ) : (
                        <Badge variant="neutral" size="sm">
                            Sin asignar
                        </Badge>
                    )}
                </div>

                {/* Agregar miembro */}
                {puedeGestionar && (
                    <div className={styles.addMemberWrapper}>
                        <div className={styles.addMemberGroup}>
                            <Select
                                className={styles.reactSelect}
                                classNamePrefix="rs"
                                styles={selectStyles}
                                placeholder="Seleccionar persona…"
                                isClearable
                                options={options}
                                value={
                                    options.find(
                                        (o) => o.value === personaSeleccionada,
                                    ) || null
                                }
                                onChange={(s) =>
                                    setPersonaSeleccionada(s?.value || "")
                                }
                            />
                            <Button
                                variant="primary"
                                size="md"
                                leftIcon={UserPlus}
                                disabled={!personaSeleccionada || loading}
                                loading={loading}
                                onClick={handleAgregar}
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Lista miembros */}
                <section>
                    <h4 className={styles.sectionTitle}>
                        Miembros ({equipo.miembros?.length ?? 0})
                    </h4>

                    {equipo.miembros && equipo.miembros.length > 0 ? (
                        <ul className={styles.membersList}>
                            {equipo.miembros.map((m) => {
                                const esLider = m.persona.id === equipo.lider?.id;
                                const puedeAscender =
                                    usuario?.rol === "admin" &&
                                    m.persona.rol === "lider" &&
                                    !esLider;

                                return (
                                    <li
                                        key={m.persona.id}
                                        className={styles.memberRow}
                                    >
                                        <div className={styles.memberInfo}>
                                            <Avatar
                                                userId={m.persona.id}
                                                Nombre={m.persona.nombre}
                                                size="sm"
                                            />
                                            <span className={styles.memberName}>
                                                {m.persona.nombre}
                                            </span>
                                            {esLider && (
                                                <Badge
                                                    variant="warning"
                                                    size="sm"
                                                >
                                                    <Crown
                                                        size={11}
                                                        aria-hidden="true"
                                                    />
                                                    Líder
                                                </Badge>
                                            )}
                                        </div>

                                        {puedeGestionar && (
                                            <div className={styles.memberActions}>
                                                {puedeAscender && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        leftIcon={Crown}
                                                        onClick={() =>
                                                            cambiarLider(
                                                                equipo.id,
                                                                m.persona.id,
                                                            )
                                                        }
                                                    >
                                                        Hacer líder
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    leftIcon={X}
                                                    onClick={() => handleQuitar(m)}
                                                    aria-label={`Quitar a ${m.persona.nombre}`}
                                                >
                                                    Quitar
                                                </Button>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <EmptyState
                            icon={UserPlus}
                            title="Aún no hay miembros"
                            description={
                                puedeGestionar
                                    ? "Selecciona una persona arriba para agregarla."
                                    : "Pide al admin que agregue miembros."
                            }
                        />
                    )}
                </section>
            </div>
        </Modal>
    );
}
