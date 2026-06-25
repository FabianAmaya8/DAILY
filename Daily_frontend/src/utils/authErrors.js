/**
 * Helpers para detectar errores de autenticación de Supabase.
 *
 * Aislado del cliente Supabase para que sea testeable sin
 * tener que crear un client real (lo que requiere env vars).
 */

/**
 * Detecta si un error es de autenticación.
 * Cubre 401 (sin sesión / token inválido) y mensajes típicos
 * de JWT expirado / refresh token inválido.
 */
export function isAuthError(error) {
    if (!error) return false;
    const status = error?.status ?? error?.code;
    if (status === 401 || status === "401") return true;
    const msg = String(error?.message || "").toLowerCase();
    return (
        msg.includes("jwt expired") ||
        msg.includes("invalid jwt") ||
        msg.includes("invalid refresh token") ||
        msg.includes("not authenticated")
    );
}
