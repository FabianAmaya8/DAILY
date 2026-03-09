import { useTheme } from "../../utils/contexts/ColorContexts";
import { Sun, Moon } from "lucide-react";

export default function Color() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
        onClick={toggleTheme}
        type="button"
        className={` btn btn-outline-secondary d-flex align-items-center justify-content-center rounded-circle shadow-sm p-2 transition `}
        style={{
            width: "42px",
            height: "42px",
        }}
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