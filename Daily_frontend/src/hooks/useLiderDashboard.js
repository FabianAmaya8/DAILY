import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useLiderDashboard() {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Cargar dashboard
    const fetchDashboard = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("vista_dashboard_lider")
            .select("*")
            .order("nombre");

        if (!error) setMembers(data);

        setLoading(false);
    };

    // 🔹 Cargar calendario por persona
    const fetchCalendar = async (personaId) => {
        const { data, error } = await supabase
            .from("vista_calendario_dailys")
            .select("*")
            .eq("persona_id", personaId)
            .order("fecha", { ascending: false });

        if (!error) setCalendar(data);
    };

    // 🔹 Seleccionar persona
    const selectMember = async (member) => {
        setSelectedMember(member);
        await fetchCalendar(member.id);
    };

    // 🔹 Refrescar
    const refresh = () => fetchDashboard();

    useEffect(() => {
        fetchDashboard();
    }, []);

    return {
        members,
        selectedMember,
        calendar,
        loading,
        selectMember,
        setSelectedMember,
        refresh,
    };
}