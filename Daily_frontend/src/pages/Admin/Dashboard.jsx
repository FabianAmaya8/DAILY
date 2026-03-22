import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useUser } from "../../utils/contexts/UserContext";

export default function AdminDashboard() {

    const { nombre } = useUser();

    const [stats, setStats] = useState({
        users: 0,
        lider: 0,
        miembro: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {

        const { count: users } = await supabase
            .from("personas")
            .select("*", { count: "exact", head: true });

        const { count: lider } = await supabase
            .from("personas")
            .select("*", { count: "exact", head: true })
            .eq("rol", "lider");

        const { count: miembro } = await supabase
            .from("personas")
            .select("*", { count: "exact", head: true })
            .eq("rol", "miembro");

        setStats({
            users,
            lider,
            miembro
        });
    };

    return (
        <div>

            <h1>Panel Admin</h1>
            <p>Bienvenido {nombre}</p>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

                <div>
                    <h3>Usuarios</h3>
                    <p>{stats.users}</p>
                </div>

                <div>
                    <h3>Líderes</h3>
                    <p>{stats.lider}</p>
                </div>

                <div>
                    <h3>Miembros</h3>
                    <p>{stats.miembro}</p>
                </div>

            </div>

        </div>
    );
}