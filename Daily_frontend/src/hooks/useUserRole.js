import { useAuth } from "../utils/contexts/auth/AuthProvider";

export function useUserRole() {
    const { session } = useAuth();

    if (!session) return null;

    return session.user.user_metadata.role;
}
