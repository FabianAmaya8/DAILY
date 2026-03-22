import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useAuditoria() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("auditoria")
            .select(
                `
                id,
                entidad,
                entidad_id,
                accion,
                creado_en,
                actor:personas!auditoria_actor_id_fkey (
                    id,
                    nombre,
                    correo
                )
            `,
            )
            .order("creado_en", { ascending: false })
            .limit(100);

        if (error) {
            console.error("Error auditoría:", error);
            setError(error.message);
            setLogs([]);
        } else {
            setLogs(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return {
        logs,
        loading,
        error,
        refetch: fetchLogs,
    };
}
