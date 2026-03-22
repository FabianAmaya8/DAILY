import { supabase } from "../utils/supabaseClient";

export function useRegisterPerson() {
    const registerPerson = async (data) => {

        const { data: authData, error: authError } =
            await supabase.auth.signUp({
                email: data.email,
                password: data.password
            });

        if (authError) throw authError;

        const userId = authData.user.id;

        const { error } = await supabase
            .from("personas")
            .insert({
                id: userId,
                nombre: data.display_name,
                correo: data.email,
                rol: data.role,
                capacidad_horas_semana: data.capacity_hours_week,
                zona_horaria: data.timezone,
                activo: data.active,
            });

        if (error) throw error;

        return { success: true };
    };

    return { registerPerson };
}