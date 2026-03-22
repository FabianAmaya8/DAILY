import { useTheme } from "../../utils/contexts/ColorContexts";
import { Sun, Moon } from "lucide-react";
import styles from "../../assets/css/Layout/MainLayout.module.scss";

export default function Color() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            type="button"
            className={styles.button}
            aria-label="Cambiar tema"
        >
            {theme === "claro" ? (
                <Sun size={20} />
            ) : (
                <Moon size={20} />
            )}
        </button>
    );
}