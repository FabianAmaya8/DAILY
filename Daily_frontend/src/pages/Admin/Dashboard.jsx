import { supabase } from "../../utils/supabaseClient";

export default function AdminDashboard() {
    const createPerson = async () => {
        await supabase.from("people").insert({
            display_name: "Nuevo Usuario",
            email: "nuevo@company.com",
            role: "member",
        });
    };

    return (
        <div>
            <h2>Panel Admin</h2>
            <button onClick={createPerson}>Crear usuario</button>
        </div>
    );
}
