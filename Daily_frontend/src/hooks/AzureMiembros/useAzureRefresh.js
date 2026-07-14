import { useCallback, useEffect, useRef, useState } from "react";

export function useAzureRefresh(onRefresh) {
    const [refreshing, setRefreshing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const resetTimerRef = useRef(null);

    const refresh = useCallback(async () => {
        if (resetTimerRef.current) {
            clearTimeout(resetTimerRef.current);
            resetTimerRef.current = null;
        }

        setRefreshing(true);
        setProgress(10);
        setError(null);

        try {
            setProgress(45);
            const result = await onRefresh?.();
            setProgress(100);
            return result;
        } catch (err) {
            const message =
                err?.message || "No fue posible actualizar los datos de Azure.";
            setError(message);
            throw err;
        } finally {
            setRefreshing(false);
            resetTimerRef.current = setTimeout(() => {
                setProgress(0);
                resetTimerRef.current = null;
            }, 250);
        }
    }, [onRefresh]);

    useEffect(() => {
        return () => {
            if (resetTimerRef.current) {
                clearTimeout(resetTimerRef.current);
            }
        };
    }, []);

    return {
        refreshing,
        progress,
        error,
        refresh,
    };
}
