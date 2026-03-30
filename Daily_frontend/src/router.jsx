import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Layout/Login";
import MemberDashboard from "./pages/Miembro/Dashboard";
import LiderDashboard from "./pages/Lider/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import MainLayout from "./pages/Layout/MainLayout";
import RegisterPerson from "./pages/Admin/Registro";
import UsersManagement from "./pages/Admin/UsersManagement";
import Error404 from "./pages/Layout/Error404";
import Inicio from "./pages/Layout/Inicio";
import EquiposPage from "./pages/Admin/Equipos";
import Auditorias from "./pages/Admin/auditorias";
import Proyectos from "./pages/Admin/Proyectos";
import DailyForm from "./pages/Miembro/RegistrarDaily";
import RegistrarBloqueo from "./pages/Miembro/RegistrarBloqueo";
import Bloqueos from "./pages/Miembro/Bloqueos";
import Certificaciones from "./pages/Miembro/Certificaciones";
import CertificacionesLider from "./pages/Lider/CertificacionesLider";

const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/", element: <Inicio /> },
    { path: "/registro", element: <RegisterPerson /> },

    {
        element: <MainLayout Roles={["miembro", "lider", "admin"]} />,
        children: [
            {
                path: "*",
                element: (<Error404 />),
            },
            {
                path: "/miembro/dashboard",
                element: (<MemberDashboard />),
            },
            {
                path: "/miembro/RegistrarDaily",
                element: (<DailyForm />),
            },
            {
                path: "/miembro/RegistrarBloqueos",
                element: (<RegistrarBloqueo />),
            },
            {
                path: "/miembro/Bloqueos",
                element: (<Bloqueos />),
            },
            {
                path: "/miembro/Certificaciones",
                element: (<Certificaciones />),
            }
        ],
    },
    {
        element: <MainLayout Roles={["lider", "admin"]} />,
        children: [
            {
                path: "/lider/dashboard",
                element: (<LiderDashboard />),
            },
            {
                path: "/lider/registrar",
                element: (<RegisterPerson />),
            },
            {
                path: "/lider/equipos",
                element: (<EquiposPage />),
            },
            {
                path: "/lider/bloqueos",
                element: (<Bloqueos />),
            },
            {
                path: "/lider/certificaciones",
                element: (<CertificacionesLider />),
            }
        ],
    },
    {
        element: <MainLayout Roles={["admin"]} />,
        children: [
            {
                path: "/admin/dashboard",
                element: (<AdminDashboard />),
            },
            {
                path: "/admin/users",
                element: (<UsersManagement />),
            },
            {
                path: "/admin/registrar",
                element: (<RegisterPerson />),
            },
            {
                path: "/admin/equipos",
                element: (<EquiposPage />),
            },
            {
                path: "/admin/proyectos",
                element: (<Proyectos />),
            },
            {
                path: "/admin/auditorias",
                element: (<Auditorias />),
            }
        ],
    }
]);

export default router;
