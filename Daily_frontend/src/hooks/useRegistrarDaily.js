import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Swal from "sweetalert2";

export function useRegistrarDaily() {
    const [loading, setLoading] = useState(false);

    const registrarDaily = async (form) => {
        try {
            setLoading(true);

            const { data: auth } = await supabase.auth.getUser();
            const userId = auth.user.id;

            const today = new Date().toISOString().split("T")[0];

            const { data, error } = await supabase
                .from("dailys")
                .upsert({
                    persona_id: userId,
                    fecha: today,
                    que_hice_ayer: form.ayer,
                    que_hare_hoy: form.hoy,
                    bloqueos_texto: form.bloqueos,
                    modelo_carga: form.modelo_carga,
                    valor_carga: form.valor_carga,
                })
                .select()
                .single();

            if (error) throw error;

            // ✅ SUCCESS ALERT
            const result = await Swal.fire({
                icon: "success",
                title: "Daily guardado",
                text: "Tu información fue registrada correctamente",
                confirmButtonText: "Continuar",
            });

            // 🔥 SI HAY BLOQUEOS → preguntar
            let goToBloqueos = false;

            if (form.bloqueos && form.bloqueos.trim() !== "") {
                const confirm = await Swal.fire({
                    icon: "question",
                    title: "¿Registrar bloqueos?",
                    text: "Indicastes que tienes bloqueos ¿quieres registrarlos ahora?",
                    showCancelButton: true,
                    confirmButtonText: "Sí",
                    cancelButtonText: "Después",
                });

                if (confirm.isConfirmed) {
                    goToBloqueos = true;
                }
            }

            return {
                data,
                goToBloqueos,
            };
        } catch (err) {
            console.error(err);

            await Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        registrarDaily,
        loading,
    };
}