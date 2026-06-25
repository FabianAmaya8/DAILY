import { describe, it, expect } from "vitest";
import { loginSchema } from "../auth.types";

describe("loginSchema", () => {
    it("acepta credenciales válidas", () => {
        const result = loginSchema.safeParse({
            email: "user@empresa.com",
            password: "secret123",
        });
        expect(result.success).toBe(true);
    });

    it("rechaza email inválido", () => {
        const result = loginSchema.safeParse({
            email: "no-es-email",
            password: "secret123",
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(["email"]);
    });

    it("rechaza password con menos de 6 caracteres", () => {
        const result = loginSchema.safeParse({
            email: "user@empresa.com",
            password: "abc",
        });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(["password"]);
    });

    it("rechaza email faltante", () => {
        const result = loginSchema.safeParse({ password: "secret123" });
        expect(result.success).toBe(false);
    });
});
