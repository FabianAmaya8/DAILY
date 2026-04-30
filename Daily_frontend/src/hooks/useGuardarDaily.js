import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export const useGuardarDaily = () => {
    const [loading, setLoading] = useState(false);
    const [equipos, setEquipos] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
    const [error, setError] = useState(null);

    // =========================
    // NORMALIZAR
    // =========================
    const normalize = (str) =>
        str?.toLowerCase().trim();

    // =========================
    // CARGAR EQUIPOS
    // =========================
    const fetchEquipos = async () => {
        const { data, error } = await supabase
            .from("equipos")
            .select("*")
            .order("nombre");

        if (!error) setEquipos(data);
    };

    // =========================
    // CARGAR PERSONAS POR EQUIPO
    // =========================
    const fetchPersonasByEquipo = async (equipoId) => {
        if (!equipoId) return;

        const { data, error } = await supabase
            .from("miembros_equipo")
            .select(`
                persona:personas(*)
            `)
            .eq("equipo_id", equipoId);

        if (!error) {
            const personasFormateadas = data.map((p) => p.persona);
            setPersonas(personasFormateadas);
        }
    };

    useEffect(() => {
        fetchEquipos();
    }, []);

    // =========================
    // CUANDO CAMBIA EQUIPO
    // =========================
    useEffect(() => {
        if (equipoSeleccionado?.id) {
            fetchPersonasByEquipo(equipoSeleccionado.id);
        }
    }, [equipoSeleccionado]);

    // =========================
    // SETEAR EQUIPO
    // =========================
    const seleccionarEquipo = (teamName) => {
        const equipo = equipos.find(
            (e) => normalize(e.nombre) === normalize(teamName)
        );

        setEquipoSeleccionado(equipo);
        return equipo;
    };

    // =========================
    // GUARDAR TODO (OPTIMIZADO 🔥)
    // =========================
    const guardarDailyCompleto = async (response) => {
        setLoading(true);
        setError(null);

        try {
            const equipo = seleccionarEquipo(response.team_name);

            if (!equipo) {
                throw new Error("Equipo no encontrado");
            }

            for (const person of response.people) {
                const persona = person.persona;

                // ⚠️ VALIDACIÓN HARD
                if (!persona?.id) {
                    console.warn("Persona sin ID, se omite:", persona);
                    continue;
                }

                // =========================
                // 1. UPSERT DAILY
                // =========================
                const { data: daily, error: dailyError } =
                    await supabase
                        .from("dailys")
                        .upsert(
                            [
                                {
                                    fecha: response.meeting_date,
                                    persona_id: persona.id,
                                    equipo_id: equipo.id,

                                    que_hice_ayer:
                                        person.daily?.que_hice_ayer || null,
                                    que_hare_hoy:
                                        person.daily?.que_hare_hoy || null,
                                    bloqueos_texto:
                                        person.bloqueo?.descripcion || null,

                                    modelo_carga:
                                        person.daily?.modelo_carga || null,
                                    valor_carga:
                                        person.daily?.valor_carga || null,
                                    confianza:
                                        person.daily?.confianza || null,

                                    fuente: "power_automate",
                                },
                            ],
                            {
                                onConflict: "persona_id,fecha",
                            }
                        )
                        .select()
                        .single();

                if (dailyError) throw dailyError;

                // =========================
                // 2. LIMPIAR BLOQUEOS ANTERIORES (🔥 CLAVE)
                // =========================
                await supabase
                    .from("bloqueos")
                    .delete()
                    .eq("daily_id", daily.id);

                // =========================
                // 3. INSERT BLOQUEO
                // =========================
                if (person.bloqueo?.tiene_bloqueo) {
                    const { error: blockError } =
                        await supabase
                            .from("bloqueos")
                            .insert([
                                {
                                    daily_id: daily.id,
                                    persona_id: persona.id,
                                    tipo: person.bloqueo?.tipo || null,
                                    severidad:
                                        person.bloqueo?.severidad || "medio",
                                    notas:
                                        person.bloqueo?.descripcion || null,
                                },
                            ]);

                    if (blockError) throw blockError;
                }
            }

            return true;
        } catch (err) {
            console.error("Error guardando daily:", err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        equipos,
        personas,
        equipoSeleccionado,
        seleccionarEquipo,
        guardarDailyCompleto,
        loading,
        error,
    };
};