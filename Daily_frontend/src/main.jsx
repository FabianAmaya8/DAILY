import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { AuthProvider } from "./utils/contexts/auth/AuthProvider";
import { ColorContexts } from "./utils/contexts/ColorContexts";
import "./assets/css/Global.scss";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <ColorContexts>
                <RouterProvider router={router} />
            </ColorContexts>
        </AuthProvider>
    </StrictMode>,
);
