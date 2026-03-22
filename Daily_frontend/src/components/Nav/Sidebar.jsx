import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    AlertTriangle,
    Users,
    UserRoundSearch,
    FileSearchCorner,
    UsersRound,
    FolderKanban ,
    ArrowLeftToLine 
} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import styles from "../../assets/css/Layout/Sidebar.module.scss";
import { useUser } from "../../utils/contexts/UserContext";
import Color from "../Depen/Color";

export default function Sidebar({ open }) {
    const { rol } = useUser();
    const location = useLocation();
    const path = location.pathname;

    const logout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    /* ==============================
        LINKS POR ROL
    ============================== */

    const miembroLinks = [
        { to: "/miembro/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/miembro/RegistrarDaily", label: "Registrar Daily", icon: ClipboardList },
        { to: "/miembro/RegistrarBloqueos", label: "Mis Bloqueos", icon: AlertTriangle },
    ];

    const liderLinks = [
        { to: "/lider/dashboard", label: "Panel Lider", icon: LayoutDashboard },
        { to: "/miembro/dashboard", label: "Panel Miembro", icon: UsersRound },
        { to: "/lider/blockers", label: "Bloqueos", icon: AlertTriangle },
        { to: "/lider/registrar", label: "Registrar", icon: ClipboardList },
        { to: "/lider/equipos", label: "Equipos", icon: UserRoundSearch },
    ];

    const adminLinks = [
        { to: "/admin/dashboard", label: "Panel Admin", icon: LayoutDashboard },
        { to: "/lider/dashboard", label: "Panel Lider", icon: UsersRound },
        { to: "/admin/proyectos", label: "Proyectos", icon: FolderKanban },
        { to: "/admin/equipos", label: "Equipos", icon: UserRoundSearch },
        { to: "/admin/users", label: "Usuarios", icon: Users },
        { to: "/admin/registrar", label: "Registrar", icon: ClipboardList },
        { to: "/admin/auditorias", label: "Auditorias", icon: FileSearchCorner, },
    ];

    /* ==============================
        DETECTAR VISTA SEGÚN LA RUTA
    ============================== */

    let currentRoleView = "miembro";

    if (path.startsWith("/admin")) {
        currentRoleView = "admin";
    } else if (path.startsWith("/lider")) {
        currentRoleView = "lider";
    } else if (path.startsWith("/miembro")) {
        currentRoleView = "miembro";
    }

    /* ==============================
        LINKS SEGÚN LA VISTA
    ============================== */

    const links =
        currentRoleView === "miembro"
            ? miembroLinks
            : currentRoleView === "lider"
                ? liderLinks
                : adminLinks;

    /* ==============================
        VOLVER A PANEL PRINCIPAL
    ============================== */

    const getHomeByRole = () => {
        if (rol === "admin") return "/admin/dashboard";
        if (rol === "lider") return "/lider/dashboard";
        return "/miembro/dashboard";
    };

    const showBackButton = currentRoleView !== rol;

    /* ==============================
        RENDER
    ============================== */

    return (
        <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
            <div className={styles.logo}>DAILY</div>

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

                {showBackButton && (
                    <NavLink 
                        to={getHomeByRole()} 
                        className={styles.link}
                    >
                        <ArrowLeftToLine size={18} />
                        Volver a mi panel
                    </NavLink>
                )}
            </nav>

            <div className={styles.footer}>
                <button onClick={logout} className={styles.logout}>
                    Cerrar sesión
                </button>

                <Color />
            </div>
        </aside>
    );
}
