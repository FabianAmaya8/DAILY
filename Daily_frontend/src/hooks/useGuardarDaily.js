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
    // CARGAR PERSONAS POR EQUIPO 🔥
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
    // SETEAR EQUIPO DESDE UI
    // =========================
    const seleccionarEquipo = (teamName) => {
        const equipo = equipos.find(
            (e) => normalize(e.nombre) === normalize(teamName)
        );

        setEquipoSeleccionado(equipo);
        return equipo;
    };

    // =========================
    // BUSCAR O CREAR PERSONA
    // =========================
    const getOrCreatePersona = async (personaFlow) => {
        const nombreNormalizado = normalize(personaFlow.nombre);

        let persona = personas.find(
            (p) => normalize(p.nombre) === nombreNormalizado
        );

        if (persona) return persona;

        // ⚠️ crear si no existe
        const { data, error } = await supabase
            .from("personas")
            .insert([
                {
                    id: crypto.randomUUID(),
                    nombre: personaFlow.nombre,
                    correo:
                        personaFlow.correo ||
                        `${personaFlow.nombre.replace(/\s/g, "").toLowerCase()}@temp.com`,
                    rol: "miembro",
                },
            ])
            .select()
            .single();

        if (error) throw error;

        // 🔥 agregar al equipo automáticamente
        if (equipoSeleccionado) {
            await supabase.from("miembros_equipo").insert([
                {
                    equipo_id: equipoSeleccionado.id,
                    persona_id: data.id,
                },
            ]);
        }

        setPersonas((prev) => [...prev, data]);

        return data;
    };

    // =========================
    // GUARDAR TODO
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
                // 1. persona
                const persona = await getOrCreatePersona(
                    person.persona
                );

                // 2. UPSERT DAILY
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
                                        person.daily.que_hice_ayer,
                                    que_hare_hoy:
                                        person.daily.que_hare_hoy,
                                    bloqueos_texto:
                                        person.bloqueo.descripcion,

                                    modelo_carga:
                                        person.daily.modelo_carga,
                                    valor_carga:
                                        person.daily.valor_carga,
                                    confianza:
                                        person.daily.confianza,

                                    fuente: "power_automate",
                                },
                            ],
                            {
                                onConflict:
                                    "persona_id,fecha",
                            }
                        )
                        .select()
                        .single();

                if (dailyError) throw dailyError;

                // 3. BLOQUEO
                if (person.bloqueo.tiene_bloqueo) {
                    const { error: blockError } =
                        await supabase
                            .from("bloqueos")
                            .insert([
                                {
                                    daily_id: daily.id,
                                    persona_id: persona.id,
                                    tipo: person.bloqueo.tipo,
                                    severidad:
                                        person.bloqueo.severidad ||
                                        "medio",
                                    notas:
                                        person.bloqueo.descripcion,
                                },
                            ]);

                    if (blockError) throw blockError;
                }
            }

            return true;
        } catch (err) {
            console.error(err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        equipos,
        personas,
        seleccionarEquipo,
        guardarDailyCompleto,
        loading,
        error,
    };
};