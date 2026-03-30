import { Menu } from "lucide-react";
import styles from "../../assets/css/Layout/Header.module.scss";
import { useUser } from "../../utils/contexts/UserContext";
import Avatar from "../Depen/Avatar";

export default function Header({ toggleSidebar }) {
    const { nombre, rol, user } = useUser();

    const userName = !nombre ? "Usuario" : nombre;

    return (
        <header className={styles.Header}>
            <div className={styles.Header_container}>
                <div className={styles.Header_left}>
                    {/* Mobile menu */}
                    <button className={styles.menuBtn} onClick={toggleSidebar}>
                        <Menu size={22} />
                    </button>

                    <div className={styles.Header_title}>
                        <h1>Sistema de Visibilidad</h1>

                        <span className={styles.role}>{rol}</span>
                    </div>
                </div>

                <div className={styles.Header_right}>
                    <div className={styles.user}>
                        <span className={styles.userName}>{userName}</span>

                        <Avatar 
                            userId={user.id} 
                            Nombre={userName} 
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
