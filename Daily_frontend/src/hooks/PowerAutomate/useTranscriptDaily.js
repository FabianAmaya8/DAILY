import { useState } from "react";
export const useTranscriptDaily = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const sendTranscript = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                import.meta.env.VITE_FLUJO_TRANSCRIPT_DAILY,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                },
            );
            if (!response.ok) {
                throw new Error("Error en el flujo de Power Automate");
            }
            const result = await response.json();
            setData(result);
            return result;
        } catch (err) {
            setError(err.message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };
    return { sendTranscript, loading, error, data };
};
