import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useBloqueos() {
    const [bloqueos, setBloqueos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBloqueos = async () => {
        setLoading(true);

        const { data: auth } = await supabase.auth.getUser();
        const userId = auth.user.id;

        // 🔥 obtener rol
        const { data: persona } = await supabase
            .from("personas")
            .select("rol")
            .eq("id", userId)
            .single();

        let query = supabase.from("bloqueos")
            .select(`
                id,
                tipo,
                severidad,
                estado,
                fecha_limite,
                notas,
                creado_en,
                persona:personas!bloqueos_persona_id_fkey(nombre),
                responsable:personas!bloqueos_responsable_id_fkey(nombre),
                dailys(fecha)
            `)
            .order("creado_en", { ascending: false });

        // 👤 si es miembro → solo sus bloqueos
        if (persona.rol === "miembro") {
            query = query.eq("persona_id", userId);
        }

        const { data, error } = await query;

        if (!error) {
            setBloqueos(data);
        } else {
            console.error(error);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchBloqueos();
    }, []);

    return {
        bloqueos,
        loading,
        refresh: fetchBloqueos,
    };
}