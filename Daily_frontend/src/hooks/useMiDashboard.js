import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useMiDashboard() {
    const [user, setUser] = useState(null);
    const [today, setToday] = useState(null);
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const { data: auth } = await supabase.auth.getUser();

        if (!auth?.user) return;

        const { data } = await supabase
            .from("personas")
            .select("*")
            .eq("correo", auth.user.email)
            .single();

        setUser(data);
        return data;
    };

    const fetchToday = async (userId) => {
        const todayDate = new Date().toISOString().split("T")[0];

        const { data } = await supabase
            .from("dailys")
            .select("*")
            .eq("persona_id", userId)
            .eq("fecha", todayDate)
            .maybeSingle();

        setToday(data);
    };

    const fetchCalendar = async (userId) => {
        const { data } = await supabase
            .from("dailys")
            .select("*")
            .eq("persona_id", userId)
            .order("fecha", { ascending: false })
            .limit(15);

        setCalendar(data || []);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);

            const userData = await fetchUser();
            if (userData) {
                await fetchToday(userData.id);
                await fetchCalendar(userData.id);
            }

            setLoading(false);
        };

        init();
    }, []);

    return {
        user,
        today,
        calendar,
        loading,
    };
}
