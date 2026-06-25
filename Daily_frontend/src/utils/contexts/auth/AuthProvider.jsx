import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext(null);

/**
 * AuthProvider — fuente de verdad de la sesión Supabase.
 *
 * Mejoras Fase 2:
 *  - Reacciona a `SIGNED_OUT`, `TOKEN_REFRESHED`, `USER_UPDATED`
 *  - Si el refresh token falla (sesión expirada), limpia la sesión
 *    y deja al gating (ProtectedRoute) redirigir a /login
 */
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Carga inicial
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setSession(data.session);
            setLoading(false);
        });

        // Suscripción a cambios
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, newSession) => {
                if (!mounted) return;
                if (
                    event === "SIGNED_OUT" ||
                    event === "USER_DELETED" ||
                    event === "TOKEN_REFRESHED_FAILED"
                ) {
                    setSession(null);
                    return;
                }
                setSession(newSession);
            },
        );

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
};
