import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAuthError, supabase } from "../supabaseClient";

/**
 * QueryProvider — envuelve la app con react-query.
 *
 * Configuración:
 *  - 1 minuto de staleTime: evita re-fetch agresivo durante navegación
 *  - 1 retry máximo, NO retry en errores de auth
 *  - refetchOnWindowFocus apagado por defecto (lo activan los hooks que
 *    quieran este comportamiento)
 *  - Auto-signout si una query falla por auth (defensa global)
 */
export function QueryProvider({ children }) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        gcTime: 5 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: (failureCount, error) => {
                            if (isAuthError(error)) return false;
                            return failureCount < 1;
                        },
                    },
                    mutations: {
                        retry: false,
                        onError: async (error) => {
                            if (isAuthError(error)) {
                                await supabase.auth.signOut();
                            }
                        },
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}
