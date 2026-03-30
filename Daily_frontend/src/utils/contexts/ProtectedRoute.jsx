import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import { useUser } from "./UserContext";
import Cargando from "../../components/Depen/Cargando";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { session } = useAuth();
    const {rol, loading} = useUser();

    if (loading) return <Cargando />;
    if (!session) return <Navigate to="/login" />;
    if (!rol) return <Navigate to="/login" />;

    if (!allowedRoles.includes(rol)) {
        return <Navigate to={`/${rol}/dashboard`} />;
    }

    return children;
}
