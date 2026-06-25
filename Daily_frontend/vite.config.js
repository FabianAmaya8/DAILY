import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

/**
 * Configuración Vite — Fase 4
 *  - Code splitting manual por categoría de dependencia
 *  - Bootstrap removido (no se usaba)
 *  - Vitest configurado para tests unitarios
 */
export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": [
                        "react",
                        "react-dom",
                        "react-router-dom",
                    ],
                    "supabase": ["@supabase/supabase-js"],
                    "react-query": ["@tanstack/react-query"],
                    "forms": [
                        "react-hook-form",
                        "@hookform/resolvers",
                        "zod",
                    ],
                    "charts": ["recharts"],
                    "alerts": ["sweetalert2"],
                    "select": ["react-select"],
                    "icons": ["lucide-react"],
                    "date-fns": ["date-fns"],
                },
            },
        },
    },
    server: {
        port: 5173,
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.js"],
        include: ["src/**/*.test.{js,jsx}"],
        coverage: {
            reporter: ["text", "html"],
            exclude: ["node_modules/**", "dist/**", "**/*.config.js"],
        },
    },
});
