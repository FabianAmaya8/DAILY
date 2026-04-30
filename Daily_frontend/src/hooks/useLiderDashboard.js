import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useLiderDashboard() {
    const [members, setMembers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("all");

    const [selectedMember, setSelectedMember] = useState(null);
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Obtener usuario actual
    const getUserContext = async () => {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) return null;

        const { data: persona, error: personaError } = await supabase
            .from("personas")
            .select("*")
            .eq("id", data.user.id)
            .single();

        if (personaError) return null;

        return persona;
    };

    // 🔹 Equipos donde es líder
    const getLeaderTeams = async (userId) => {
        const { data, error } = await supabase
            .from("equipos")
            .select("*")
            .eq("lider_id", userId);

        if (error) return [];

        return data || [];
    };

    // 🔥 DASHBOARD PRINCIPAL
    const fetchDashboard = async () => {
        setLoading(true);

        try {
            const persona = await getUserContext();

            if (!persona) {
                setMembers([]);
                setLoading(false);
                return;
            }

            // ⚠️ IMPORTANTE: usa la vista nueva con equipos
            const { data, error } = await supabase
                .from("vista_dashboard_lider_full")
                .select("*")
                .order("nombre");

            if (error) {
                console.error(error);
                setMembers([]);
                setLoading(false);
                return;
            }

            let filtered = [];
            let leaderTeams = [];

            // 🟢 ADMIN → ve todo
            if (persona.rol === "admin") {
                filtered = data;

                // traer todos los equipos para filtro
                const { data: allTeams } = await supabase
                    .from("equipos")
                    .select("*")
                    .order("nombre");

                setTeams(allTeams || []);
            }

            // 🔵 LÍDER
            else if (persona.rol === "lider") {
                leaderTeams = await getLeaderTeams(persona.id);
                setTeams(leaderTeams);

                // ❌ no lidera nada
                if (leaderTeams.length === 0) {
                    filtered = [];
                } else {
                    const teamIds = leaderTeams.map((t) => t.id);

                    filtered = data.filter((d) =>
                        teamIds.includes(d.equipo_id)
                    );
                }
            }

            // ⚪ MIEMBRO → no debería ver dashboard
            else {
                filtered = [];
            }

            setMembers(filtered);
        } catch (err) {
            console.error("Error dashboard:", err);
            setMembers([]);
        }

        setLoading(false);
    };

    // 🔹 FILTRO FRONTEND POR EQUIPO
    const filteredMembers = (() => {
        let list = members;

        // 🔹 Filtrar por equipo si aplica
        if (selectedTeam !== "all") {
            list = list.filter((m) => m.equipo_id === selectedTeam);
        }

        // 🔹 1. ELIMINAR DUPLICADOS (persona en varios equipos)
        const uniqueMap = new Map();

        list.forEach((m) => {
            // si ya existe, no lo sobreescribas (mantiene el primero)
            if (!uniqueMap.has(m.id)) {
                uniqueMap.set(m.id, m);
            }
        });

        let uniqueList = Array.from(uniqueMap.values());

        // 🔹 2. ORDENAR (líder primero si hay equipo seleccionado)
        if (selectedTeam !== "all") {
            uniqueList.sort((a, b) => {
                const isLeaderA = a.lider_id === a.id;
                const isLeaderB = b.lider_id === b.id;

                if (isLeaderA && !isLeaderB) return -1;
                if (!isLeaderA && isLeaderB) return 1;

                return a.nombre.localeCompare(b.nombre);
            });
        } else {
            // orden normal cuando es "todos"
            uniqueList.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }

        return uniqueList;
    })();

    // 🔹 CALENDARIO
    const fetchCalendar = async (personaId) => {
        const { data, error } = await supabase
            .from("vista_calendario_dailys")
            .select("*")
            .eq("persona_id", personaId)
            .order("fecha", { ascending: false });

        if (!error) setCalendar(data);
    };

    // 🔹 SELECCIONAR PERSONA
    const selectMember = async (member) => {
        setSelectedMember(member);
        await fetchCalendar(member.id);
    };

    // 🔹 REFRESH
    const refresh = () => fetchDashboard();

    useEffect(() => {
        fetchDashboard();
    }, []);

    return {
        members: filteredMembers, // 🔥 ya filtrados por equipo
        teams,
        selectedTeam,
        setSelectedTeam,

        selectedMember,
        calendar,
        loading,

        selectMember,
        setSelectedMember,
        refresh,
    };
}