import { NavLink } from "react-router-dom";
import { useUserRole } from "../../hooks/useUserRole";
import { LayoutDashboard, ClipboardList, AlertTriangle, Users, Settings,} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import styles from "../../assets/css/Layout/Sidebar.module.scss";

export default function Sidebar() {
    const role = useUserRole();

    const logout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    const memberLinks = [
        { to: "/member/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/member/daily", label: "Registrar Daily", icon: ClipboardList },
        { to: "/member/blockers", label: "Mis Bloqueos", icon: AlertTriangle },
    ];

    const leaderLinks = [
        { to: "/leader/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/leader/dailies", label: "Dailies Global", icon: ClipboardList },
        { to: "/leader/blockers", label: "Bloqueos", icon: AlertTriangle },
    ];

    const adminLinks = [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/people", label: "Personas", icon: Users },
        { to: "/admin/projects", label: "Proyectos", icon: Settings },
    ];

    const links =
        role === "member"
            ? memberLinks
            : role === "leader"
                ? leaderLinks
                : adminLinks;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                DAILY
            </div>

            <nav className={styles.nav}>
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ""}`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className={styles.footer}>
                <button onClick={logout} className={styles.logout}>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
