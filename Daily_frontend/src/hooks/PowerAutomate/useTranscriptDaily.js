import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

/**
 * useTranscriptDaily — envía un payload al flujo de Power Automate.
 *
 * Fase 2:
 *  - YA NO llama directamente al webhook (eso exponía la URL en el bundle).
 *  - Llama al endpoint propio `/api/transcript` (Vercel Serverless Function),
 *    que valida el access_token de Supabase y reenvía al flow real.
 *  - El cliente envuelve el bearer token en cada petición.
 */
export const useTranscriptDaily = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const sendTranscript = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Obtener token vigente
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
            }

            // 2. Llamar al proxy seguro
            const res = await fetch("/api/transcript", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(payload || {}),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(
                    errBody.error || `Power Automate error (${res.status})`,
                );
            }

            const ct = res.headers.get("content-type") || "";
            const result = ct.includes("application/json")
                ? await res.json()
                : await res.text();
            setData(result);
            return result;
        } catch (err) {
            const msg = err?.message || "Error inesperado";
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { sendTranscript, loading, error, data };
};
