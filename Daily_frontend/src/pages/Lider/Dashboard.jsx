import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function LeaderDashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase
                .from("daily_updates")
                .select("*, people(display_name)");

            setData(data);
        };
        fetch();
    }, []);

    return (
        <div>
            <h2>Visión global</h2>
            <table>
                <thead>
                    <tr>
                        <th>Persona</th>
                        <th>Hoy</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((d) => (
                        <tr key={d.id}>
                            <td>{d.people.display_name}</td>
                            <td>{d.today_text}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
