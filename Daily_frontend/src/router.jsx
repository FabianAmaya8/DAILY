import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./utils/contexts/auth/ProtectedRoute";
import Login from "./pages/Layout/Login";
import MemberDashboard from "./pages/Miembro/Dashboard";
import LeaderDashboard from "./pages/Lider/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import MainLayout from "./pages/Layout/MainLayout";
import RegisterPerson from "./pages/Layout/Registro";

const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/", element: <RegisterPerson /> },

    {
        element: <MainLayout />,
        children: [
            {
                path: "/member/dashboard",
                element: (
                    <ProtectedRoute allowedRoles={["member"]}>
                        <MemberDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/leader/dashboard",
                element: (
                    <ProtectedRoute allowedRoles={["leader"]}>
                        <LeaderDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin/dashboard",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;
