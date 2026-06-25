import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabaseClient";

/**
 * useMiDashboard — datos del dashboard del miembro autenticado.
 *
 * Migrado a react-query (Fase 2):
 *  - Caching con staleTime 60s
 *  - Refetch transparente al volver a la pestaña tras 60s
 *  - Errores propagados al UI sin try/catch boilerplate
 *  - 1 sola query con CTEs no es viable porque son 3 fuentes distintas;
 *    usamos 3 queries dependientes con `enabled` para encadenarlas.
 */

const TODAY_ISO = () => new Date().toISOString().split("T")[0];

async function fetchAuthUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
}

async function fetchPersona(email) {
    const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("correo", email)
        .single();
    if (error) throw error;
    return data;
}

async function fetchToday(personaId) {
    const { data, error } = await supabase
        .from("dailys")
        .select("*")
        .eq("persona_id", personaId)
        .eq("fecha", TODAY_ISO())
        .maybeSingle();
    if (error) throw error;
    return data;
}

async function fetchCalendar(personaId) {
    const { data, error } = await supabase
        .from("dailys")
        .select("*")
        .eq("persona_id", personaId)
        .order("fecha", { ascending: false })
        .limit(15);
    if (error) throw error;
    return data || [];
}

export function useMiDashboard() {
    const authQuery = useQuery({
        queryKey: ["auth", "user"],
        queryFn: fetchAuthUser,
        staleTime: 5 * 60 * 1000,
    });

    const personaQuery = useQuery({
        queryKey: ["persona", authQuery.data?.email],
        queryFn: () => fetchPersona(authQuery.data.email),
        enabled: !!authQuery.data?.email,
        staleTime: 5 * 60 * 1000,
    });

    const personaId = personaQuery.data?.id;

    const todayQuery = useQuery({
        queryKey: ["dailys", "today", personaId, TODAY_ISO()],
        queryFn: () => fetchToday(personaId),
        enabled: !!personaId,
    });

    const calendarQuery = useQuery({
        queryKey: ["dailys", "calendar", personaId],
        queryFn: () => fetchCalendar(personaId),
        enabled: !!personaId,
    });

    const loading =
        authQuery.isLoading ||
        personaQuery.isLoading ||
        todayQuery.isLoading ||
        calendarQuery.isLoading;

    const error =
        authQuery.error ||
        personaQuery.error ||
        todayQuery.error ||
        calendarQuery.error;

    return {
        user: personaQuery.data,
        today: todayQuery.data,
        calendar: calendarQuery.data || [],
        loading,
        error,
        refetch: () => {
            todayQuery.refetch();
            calendarQuery.refetch();
        },
    };
}
