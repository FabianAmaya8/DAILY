import { describe, it, expect } from "vitest";
import { isAuthError } from "../authErrors";

describe("isAuthError", () => {
    it("detecta status 401 numérico", () => {
        expect(isAuthError({ status: 401 })).toBe(true);
    });

    it("detecta status 401 string", () => {
        expect(isAuthError({ code: "401" })).toBe(true);
    });

    it("detecta JWT expired por mensaje", () => {
        expect(isAuthError({ message: "JWT expired" })).toBe(true);
    });

    it("detecta refresh token inválido", () => {
        expect(isAuthError({ message: "Invalid Refresh Token" })).toBe(true);
    });

    it("retorna false en errores no de auth", () => {
        expect(isAuthError({ status: 500, message: "Server error" })).toBe(
            false,
        );
        expect(isAuthError(null)).toBe(false);
        expect(isAuthError(undefined)).toBe(false);
    });
});
