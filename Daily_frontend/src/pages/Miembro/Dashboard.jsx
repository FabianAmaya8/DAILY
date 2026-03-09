import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Card } from "../../components/ui/Card";

export default function MemberDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const load = async () => {
            const user = (await supabase.auth.getUser()).data.user;

            const { data: occupancy } = await supabase.rpc(
                "calculate_weekly_occupancy",
                {
                    person_uuid: user.id,
                    year: new Date().getFullYear(),
                    week_number: 10,
                },
            );

            const { data: blockers } = await supabase
                .from("blockers")
                .select("*")
                .eq("person_id", user.id)
                .eq("status", "Abierto");

            const { data: workItems } = await supabase
                .from("work_items")
                .select("*")
                .eq("assigned_to_person_id", user.id)
                .neq("canonical_state", "Done");

            setStats({
                occupancy,
                blockers: blockers?.length,
                workItems: workItems?.length,
            });
        };

        load();
    }, []);

    if (!stats) return <div>Cargando...</div>;

    return (
        <div className="grid grid-cols-3 gap-6">
            <Card>
                <h3>Ocupación semanal</h3>
                <p className="text-2xl font-bold">{stats.occupancy}%</p>
            </Card>

            <Card>
                <h3>Bloqueos abiertos</h3>
                <p className="text-2xl font-bold">{stats.blockers}</p>
            </Card>

            <Card>
                <h3>Work Items activos</h3>
                <p className="text-2xl font-bold">{stats.workItems}</p>
            </Card>
        </div>
    );
}
