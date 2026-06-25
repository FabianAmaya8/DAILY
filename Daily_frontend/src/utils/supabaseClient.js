import { createClient } from "@supabase/supabase-js";

// Re-export para compatibilidad de imports existentes
export { isAuthError } from "./authErrors";
import { isAuthError } from "./authErrors";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error(
            "[supabase] VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no definidas. " +
                "Crea un .env basado en Example.env.",
        );
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
    },
    global: {
        headers: {
            "x-client-info": "daily-frontend",
        },
    },
});

/**
 * Subscribe a cambios de sesión y dispara `onSignOut` cuando expira o
 * el usuario hace logout. Devuelve función de unsubscribe.
 */
export function onAuthExpired(onSignOut) {
    const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED_FAILED") {
            onSignOut?.();
        }
    });
    return () => data.subscription.unsubscribe();
}

// Re-export para uso en código existente
export { isAuthError as _isAuthError };
