import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./router";
import { AuthProvider } from "./utils/contexts/auth/AuthProvider";
import { ColorContexts } from "./utils/contexts/ColorContexts";
import { UserProvider } from "./utils/contexts/UserContext";
import { QueryProvider } from "./utils/contexts/QueryProvider";

// Estilos globales propios — sin Bootstrap (auditado: 0 clases Bootstrap usadas)
import "./assets/css/Global.scss";
import "ldrs/react/Spiral.css";

/**
 * Orden de providers (de fuera hacia dentro):
 *   QueryProvider   → cliente react-query global
 *   ColorContexts   → tema oscuro/claro/sistema
 *   AuthProvider    → sesión Supabase
 *   UserProvider    → datos enriquecidos del usuario actual
 *   RouterProvider  → rutas (todas lazy salvo Login e Inicio)
 */
function ProvidersWrap({ children }) {
    return (
        <QueryProvider>
            <ColorContexts>
                <AuthProvider>
                    <UserProvider>{children}</UserProvider>
                </AuthProvider>
            </ColorContexts>
        </QueryProvider>
    );
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ProvidersWrap>
            <RouterProvider router={router} />
        </ProvidersWrap>
    </StrictMode>,
);
