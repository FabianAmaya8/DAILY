import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";

export function useUserProfile(userId) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        let isMounted = true;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from("personas")
                    .select(`
                        id,
                        nombre,
                        correo,
                        rol,
                        capacidad_horas_semana,

                        proyecto:proyectos!personas_proyecto_principal_id_fkey(
                            nombre
                        ),

                        certificaciones:persona_certificaciones(
                            fecha_obtencion,
                            certificacion:certificaciones(
                                nombre,
                                codigo
                            )
                        ),

                        ultimo_daily:dailys!dailys_persona_id_fkey(
                            fecha,
                            que_hice_ayer,
                            que_hare_hoy,
                            bloqueos_texto
                        )
                        .order(fecha, { ascending:false })
                        .limit(1)
                    `)
                    .eq("id", userId)
                    .single();

                if (error) throw error;

                const { data: ocupacion } = await supabase
                    .from("vista_ocupacion_semanal")
                    .select("ocupacion_porcentaje")
                    .eq("persona_id", userId)
                    .single();

                if (isMounted) {
                    setProfile({
                        ...data,
                        ocupacion: ocupacion?.ocupacion_porcentaje || 0
                    });
                }

            } catch (err) {
                console.error(err);
                if (isMounted) setError(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    return { profile, loading, error };
}