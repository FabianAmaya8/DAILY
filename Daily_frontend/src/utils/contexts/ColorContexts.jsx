import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ColorContexts({ children }) {
    // Leer tema guardado o usar claro por defecto
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "claro";
    });

    // Guardar en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem("theme", theme);

        // Aplicar atributo al body
        document.body.dataset.theme = theme;
    }, [theme]);

    // Cambiar tema
    const toggleTheme = () => {
        setTheme((prev) => (prev === "claro" ? "oscuro" : "claro"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
        </ThemeContext.Provider>
    );
}

// Hook personalizado
export function useTheme() {
    return useContext(ThemeContext);
}