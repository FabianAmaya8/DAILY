import { supabase } from "../utils/supabaseClient";

export function useRegisterPerson() {
    const registerPerson = async (data) => {
        try {
            // 1️⃣ Crear usuario en Supabase Auth
            const { data: authData, error: authError } =
                await supabase.auth.signUp({
                    email: data.email,
                    password: data.password, // password temporal
                    options: {
                        data: {
                            role: data.role,
                            display_name: data.display_name,
                        },
                    },
                });

            if (authError) throw authError;

            const userId = authData.user.id;

            // 2️⃣ Insertar en tabla people con el mismo ID
            const { error: dbError } = await supabase.from("people").insert({
                id: userId,
                display_name: data.display_name,
                email: data.email,
                role: data.role,
                capacity_hours_week: data.capacity_hours_week,
                timezone: data.timezone,
                active: data.active,
            });

            if (dbError) throw dbError;

            return { success: true };
        } catch (error) {
            throw error;
        }
    };

    return { registerPerson };
}
