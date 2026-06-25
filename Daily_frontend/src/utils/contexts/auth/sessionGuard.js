import { supabase, isAuthError } from "../../supabaseClient";

/**
 * sessionGuard — wrapper alrededor de operaciones Supabase para detectar
 * auth expirada. Si la respuesta indica error de autenticación, hace
 * signOut y devuelve { authExpired: true }.
 *
 * Uso:
 *   const result = await guardedQuery(() =>
 *       supabase.from("dailys").select("*")
 *   );
 *   if (result.authExpired) return; // el AuthProvider redirige a /login
 *   if (result.error) handleError(result.error);
 *   const { data } = result;
 */
export async function guardedQuery(queryFn, { onAuthExpired } = {}) {
    try {
        const result = await queryFn();
        if (isAuthError(result?.error)) {
            await supabase.auth.signOut();
            onAuthExpired?.();
            return { ...result, authExpired: true };
        }
        return { ...result, authExpired: false };
    } catch (err) {
        if (isAuthError(err)) {
            await supabase.auth.signOut();
            onAuthExpired?.();
            return { data: null, error: err, authExpired: true };
        }
        return { data: null, error: err, authExpired: false };
    }
}
