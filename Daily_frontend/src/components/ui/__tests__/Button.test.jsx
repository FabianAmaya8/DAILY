import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../Button";
import { Save } from "lucide-react";

describe("Button", () => {
    it("renderiza el children como label", () => {
        render(<Button>Guardar</Button>);
        expect(screen.getByRole("button")).toHaveTextContent("Guardar");
    });

    it("llama onClick cuando se hace click", async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        await userEvent.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("queda deshabilitado y no dispara click cuando loading=true", async () => {
        const onClick = vi.fn();
        render(
            <Button loading onClick={onClick}>
                Guardando
            </Button>,
        );
        const btn = screen.getByRole("button");
        expect(btn).toBeDisabled();
        expect(btn).toHaveAttribute("aria-busy", "true");
        await userEvent.click(btn);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("respeta el atributo disabled", async () => {
        const onClick = vi.fn();
        render(
            <Button disabled onClick={onClick}>
                Off
            </Button>,
        );
        await userEvent.click(screen.getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });

    it("renderiza leftIcon cuando se pasa", () => {
        const { container } = render(
            <Button leftIcon={Save}>Guardar</Button>,
        );
        expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("type por defecto es button (no submit accidental)", () => {
        render(<Button>X</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
});
