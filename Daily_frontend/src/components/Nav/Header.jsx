import { Menu } from "lucide-react";
import styles from "../../assets/css/Layout/Header.module.scss";
import { useUser } from "../../utils/contexts/UserContext";
import Avatar from "../Depen/Avatar";
import Color from "../Depen/Color";
import { Badge } from "../ui/Badge";

export default function Header({ toggleSidebar, sidebarOpen = false }) {
    const { nombre, rol, user } = useUser();
    const userName = nombre || "Usuario";

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button
                    className={styles.menuBtn}
                    onClick={toggleSidebar}
                    aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={sidebarOpen}
                    type="button"
                >
                    <Menu size={20} aria-hidden="true" />
                </button>

                <div className={styles.titleBlock}>
                    <h1 className={styles.title}>Sistema de Visibilidad</h1>
                    {rol && (
                        <Badge variant="primary" size="sm">
                            {rol}
                        </Badge>
                    )}
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.themeWrap}>
                    <Color compact />
                </div>
                <div className={styles.user}>
                    <span className={styles.userName}>{userName}</span>
                    {user?.id && (
                        <Avatar userId={user.id} Nombre={userName} />
                    )}
                </div>
            </div>
        </header>
    );
}
