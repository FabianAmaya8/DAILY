import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function useRegistrarBloqueo() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getTodayDaily = async (userId) => {
        const today = new Date().toISOString().split("T")[0];

        const { data } = await supabase
            .from("dailys")
            .select("id")
            .eq("persona_id", userId)
            .eq("fecha", today)
            .maybeSingle(); // ✅ FIX

        return data?.id;
    };

    const crearBloqueo = async (form, dailyIdParam) => {
        try {
            setLoading(true);

            const { data: auth } = await supabase.auth.getUser();
            const userId = auth.user.id;

            let dailyId = dailyIdParam;

            if (!dailyId) {
                dailyId = await getTodayDaily(userId);
            }

            if (!dailyId) {
                await Swal.fire({
                    icon: "warning",
                    title: "Daily requerido",
                    text: "Debes registrar tu daily antes de crear un bloqueo",
                });
                return null;
            }

            const { data, error } = await supabase
                .from("bloqueos")
                .insert({
                    daily_id: dailyId,
                    persona_id: userId,
                    tipo: form.tipo,
                    severidad: form.severidad,
                    responsable_id: form.responsable_id || null,
                    fecha_limite: form.fecha_limite || null,
                    notas: form.notas,
                })
                .select()
                .single();

            if (error) throw error;

            await Swal.fire({
                icon: "success",
                title: "Bloqueo creado",
                timer: 1500,
                showConfirmButton: false,
            }).then(() => {
                navigate("/miembro/dashboard");
            });

            return data;
        } catch (err) {
            console.error(err);

            await Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        crearBloqueo,
        loading,
    };
}