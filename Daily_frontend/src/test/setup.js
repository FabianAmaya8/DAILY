/**
 * Vitest setup global.
 *  - Limpia el DOM entre tests
 *  - Extiende `expect` con matchers de jest-dom (toBeInTheDocument, etc.)
 *  - Stub mínimo de matchMedia para componentes que lo usan (theme system)
 */
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
    cleanup();
});

// matchMedia no existe en jsdom; los componentes de tema lo consultan.
if (typeof window.matchMedia !== "function") {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        }),
    });
}
