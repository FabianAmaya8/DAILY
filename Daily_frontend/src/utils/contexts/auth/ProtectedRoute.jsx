import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useUserRole } from "../../../hooks/useUserRole";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { session, loading } = useAuth();
    const role = useUserRole();

    if (loading) return <div>Loading...</div>;
    if (!session) return <Navigate to="/login" />;

    if (!allowedRoles.includes(role)) {
        return <Navigate to={`/${role}/dashboard`} />;
    }

    return children;
}
