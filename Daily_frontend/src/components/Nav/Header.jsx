import styles from "../../assets/css/Layout/Header.module.scss";
import { useAuth } from "../../utils/contexts/auth/AuthProvider";
import { useUserRole } from "../../hooks/useUserRole";
import Color from "../Depen/Color";

export default function Header() {
    const { session } = useAuth();
    const role = useUserRole();

    const email = session?.user?.email || "";
    const letter = email.charAt(0).toUpperCase();

    return (
        <header className={styles.Header}>
            <div className={styles.Header_container}>

                {/* Left */}
                <div className={styles.Header_left}>
                    <div className={styles.Header_title}>
                        <h1>Sistema de Visibilidad</h1>
                        <span className={styles.role}>
                            {role}
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className={styles.Header_right}>

                    <Color />

                    <div className={styles.user}>
                        <span className={styles.email}>
                            {email}
                        </span>

                        <div className={styles.avatar}>
                            {letter}
                        </div>
                    </div>

                </div>

            </div>
        </header>
    );
}