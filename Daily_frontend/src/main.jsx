import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";

import { AuthProvider } from "./utils/contexts/auth/AuthProvider";
import { ColorContexts } from "./utils/contexts/ColorContexts";
import { UserProvider } from "./utils/contexts/UserContext";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/css/Global.scss";
import 'ldrs/react/Spiral.css'

function ProvidersWrap({ children }) {
    return (
        <AuthProvider>
            <UserProvider>
                <ColorContexts>
                    {children}
                </ColorContexts>
            </UserProvider>
        </AuthProvider>
    );
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ProvidersWrap>
            <RouterProvider router={router} />
        </ProvidersWrap>
    </StrictMode>,
);
