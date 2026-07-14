/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Cargando from "./components/Depen/Cargando";

// ---------------------------------------------------------------
// Eager (rutas iniciales — críticas para TTI)
// ---------------------------------------------------------------
import Inicio from "./pages/Layout/Inicio";
import Login from "./pages/Layout/Login";
import MainLayout from "./pages/Layout/MainLayout";
import Error404 from "./pages/Layout/Error404";

// ---------------------------------------------------------------
// Lazy
// ---------------------------------------------------------------
const MemberDashboard = lazy(() => import("./pages/Miembro/Dashboard"));
const DailyForm = lazy(() => import("./pages/Miembro/RegistrarDaily"));
const RegistrarBloqueo = lazy(() => import("./pages/Miembro/RegistrarBloqueo"));
const Bloqueos = lazy(() => import("./pages/Miembro/Bloqueos"));
const Certificaciones = lazy(() => import("./pages/Miembro/Certificaciones"));

const LiderDashboard = lazy(() => import("./pages/Lider/Dashboard"));
const RegistrarDailyLider = lazy(() => import("./pages/Lider/RegistrarDaily"));
const CertificacionesLider = lazy(
    () => import("./pages/Lider/CertificacionesLider"),
);

const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const RegisterPerson = lazy(() => import("./pages/Admin/Registro"));
const UsersManagement = lazy(() => import("./pages/Admin/UsersManagement"));
const EquiposPage = lazy(() => import("./pages/Admin/Equipos"));
const Auditorias = lazy(() => import("./pages/Admin/Auditorias"));
const Proyectos = lazy(() => import("./pages/Admin/Proyectos"));
const DatosAzure = lazy(() => import("./pages/Admin/DatosAzure.jsx"));
const AzureMiembros = lazy(() => import("./pages/Admin/AzureMiembros.jsx"));

const Lazy = (RouteComponent) => {
    const Component = RouteComponent;
    return (
        <Suspense fallback={<Cargando />}>
            <Component />
        </Suspense>
    );
};

/**
 * URLs kebab-case (Fase 3) + retrocompat con las antiguas
 * via <Navigate replace>. Las viejas siguen funcionando
 * pero el navegador acaba en la nueva URL canónica.
 */
const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/", element: <Inicio /> },

    // --- MIEMBRO + LIDER + ADMIN ---
    {
        element: <MainLayout Roles={["miembro", "lider", "admin"]} />,
        children: [
            { path: "/miembro/dashboard", element: Lazy(MemberDashboard) },
            { path: "/miembro/registrar-daily", element: Lazy(DailyForm) },
            { path: "/miembro/registrar-bloqueo", element: Lazy(RegistrarBloqueo) },
            { path: "/miembro/bloqueos", element: Lazy(Bloqueos) },
            { path: "/miembro/certificaciones", element: Lazy(Certificaciones) },

            // Retrocompat URLs antiguas → redirigen a las nuevas
            {
                path: "/miembro/RegistrarDaily",
                element: <Navigate to="/miembro/registrar-daily" replace />,
            },
            {
                path: "/miembro/RegistrarBloqueos",
                element: <Navigate to="/miembro/registrar-bloqueo" replace />,
            },
            {
                path: "/miembro/Bloqueos",
                element: <Navigate to="/miembro/bloqueos" replace />,
            },
            {
                path: "/miembro/Certificaciones",
                element: <Navigate to="/miembro/certificaciones" replace />,
            },
        ],
    },

    // --- LIDER + ADMIN ---
    {
        element: <MainLayout Roles={["lider", "admin"]} />,
        children: [
            { path: "/lider/dashboard", element: Lazy(LiderDashboard) },
            { path: "/lider/registrar-daily", element: Lazy(RegistrarDailyLider) },
            { path: "/lider/registrar-persona", element: Lazy(RegisterPerson) },
            { path: "/lider/equipos", element: Lazy(EquiposPage) },
            { path: "/lider/bloqueos", element: Lazy(Bloqueos) },
            { path: "/lider/certificaciones", element: Lazy(CertificacionesLider) },

            // Retrocompat
            {
                path: "/lider/RegistroDaily",
                element: <Navigate to="/lider/registrar-daily" replace />,
            },
            {
                path: "/lider/registrar",
                element: <Navigate to="/lider/registrar-persona" replace />,
            },
        ],
    },

    // --- ADMIN ---
    {
        element: <MainLayout Roles={["admin"]} />,
        children: [
            { path: "/admin/dashboard", element: Lazy(AdminDashboard) },
            { path: "/admin/usuarios", element: Lazy(UsersManagement) },
            { path: "/admin/equipos", element: Lazy(EquiposPage) },
            { path: "/admin/proyectos", element: Lazy(Proyectos) },
            { path: "/admin/auditorias", element: Lazy(Auditorias) },

            // actualizar azure devops
            { path: "/admin/datosAzure", element: Lazy(DatosAzure) },
            { path: "/admin/azure-miembros", element: Lazy(AzureMiembros) },

            // Retrocompat
            {
                path: "/admin/users",
                element: <Navigate to="/admin/usuarios" replace />,
            },
        ],
    },

    // 404 catch-all dentro del layout protegido
    {
        element: <MainLayout Roles={["miembro", "lider", "admin"]} />,
        children: [{ path: "*", element: <Error404 /> }],
    },
]);

export default router;
