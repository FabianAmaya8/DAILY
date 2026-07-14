import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    AlertTriangle,
    Users,
    UserRoundSearch,
    FileSearchCorner,
    UsersRound,
    FolderKanban,
    ListTodo,
    ShieldCheck,
    ArrowLeftToLine,
    LogOut,
    DatabaseZap,
    UsersRound as UsersAzure,
} from "lucide-react";
import { authService } from "../../utils/contexts/auth/authService";
import styles from "../../assets/css/Layout/Sidebar.module.scss";
import { useUser } from "../../utils/contexts/UserContext";
import { Button } from "../ui/Button";
import LOGO from "../../assets/icono_grande_menu_lateral.png";

const MIEMBRO_LINKS = [
    { to: "/miembro/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/miembro/registrar-daily", label: "Registrar Daily", icon: ClipboardList },
    { to: "/miembro/registrar-bloqueo", label: "Mis bloqueos", icon: AlertTriangle },
    { to: "/miembro/bloqueos", label: "Historial bloqueos", icon: ListTodo },
    { to: "/miembro/certificaciones", label: "Certificaciones", icon: ShieldCheck },
];

const LIDER_LINKS = [
    { to: "/lider/dashboard", label: "Panel Líder", icon: LayoutDashboard },
    { to: "/miembro/dashboard", label: "Vista Miembro", icon: UsersRound },
    { to: "/lider/registrar-daily", label: "Registrar Daily", icon: ClipboardList },
    { to: "/lider/bloqueos", label: "Bloqueos", icon: ListTodo },
    { to: "/lider/registrar-persona", label: "Registrar persona", icon: ClipboardList },
    { to: "/lider/equipos", label: "Equipos", icon: UserRoundSearch },
    { to: "/lider/certificaciones", label: "Certificaciones", icon: ShieldCheck },
];

const ADMIN_LINKS = [
    { to: "/admin/dashboard", label: "Panel Admin", icon: LayoutDashboard },
    { to: "/lider/dashboard", label: "Vista Líder", icon: UsersRound },
    { to: "/admin/proyectos", label: "Proyectos", icon: FolderKanban },
    { to: "/admin/equipos", label: "Equipos", icon: UserRoundSearch },
    { to: "/admin/usuarios", label: "Usuarios", icon: Users },
    { to: "/lider/registrar-persona", label: "Registrar persona", icon: ClipboardList },
    { to: "/admin/auditorias", label: "Auditorías", icon: FileSearchCorner },
    { to: "/admin/azure-miembros", label: "Miembros Azure", icon: UsersAzure },
    // Actualizar azure devops rutas nuevas
    { to: "/admin/datosAzure", label: "Actualizar datos Azure", icon: DatabaseZap },
];

function getRoleHome(rol) {
    if (rol === "admin") return "/admin/dashboard";
    if (rol === "lider") return "/lider/dashboard";
    return "/miembro/dashboard";
}

function detectViewFromPath(path) {
    if (path.startsWith("/admin")) return "admin";
    if (path.startsWith("/lider")) return "lider";
    return "miembro";
}

export default function Sidebar({ open, onClose }) {
    const { rol } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const currentView = detectViewFromPath(location.pathname);

    const links =
        currentView === "admin"
            ? ADMIN_LINKS
            : currentView === "lider"
              ? LIDER_LINKS
              : MIEMBRO_LINKS;

    const showBackButton = currentView !== rol;

    const handleLogout = async () => {
        try {
            await authService.logout();
        } finally {
            navigate("/login", { replace: true });
        }
    };

    return (
        <aside
            className={`${styles.sidebar} ${open ? styles.open : ""}`}
            aria-label="Navegación lateral"
        >
            <div className={styles.logo}>
                <img src={LOGO} alt="DAILY" />
            </div>

            <div className={styles.section}>
                <div className={styles.sectionLabel}>
                    {currentView === "admin"
                        ? "Administración"
                        : currentView === "lider"
                          ? "Liderazgo"
                          : "Miembro"}
                </div>
                <nav className={styles.nav}>
                    {links.map(({ to, label, icon }) => {
                        const LinkIcon = icon;
                        return (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${styles.link} ${isActive ? styles.active : ""}`
                                }
                                end
                            >
                                <LinkIcon size={16} aria-hidden="true" />
                                <span>{label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {showBackButton && (
                <NavLink
                    to={getRoleHome(rol)}
                    onClick={onClose}
                    className={styles.backLink}
                >
                    <ArrowLeftToLine size={14} aria-hidden="true" />
                    Volver a mi panel
                </NavLink>
            )}

            <div className={styles.footer}>
                <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    leftIcon={LogOut}
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </Button>
            </div>
        </aside>
    );
}
