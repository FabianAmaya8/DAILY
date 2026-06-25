import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { supabase } from "../../utils/supabaseClient";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const passwordSchema = z
    .object({
        password: z.string().min(8, "Mínimo 8 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

export function ChangePasswordModal({ onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const ToggleIcon = showPassword ? EyeOff : Eye;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({ resolver: zodResolver(passwordSchema) });

    const onSubmit = async (data) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });
            if (error) throw error;
            await Swal.fire({
                icon: "success",
                title: "Contraseña actualizada",
                timer: 2000,
                showConfirmButton: false,
            });
            reset();
            onClose();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error al cambiar contraseña",
                text: err.message,
            });
        }
    };

    return (
        <Modal
            open
            onClose={onClose}
            title="Cambiar contraseña"
            description="La contraseña debe tener al menos 8 caracteres."
            size="sm"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="change-password-form"
                        variant="primary"
                        leftIcon={KeyRound}
                        loading={isSubmitting}
                    >
                        Guardar
                    </Button>
                </>
            }
        >
            <form
                id="change-password-form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-md)",
                }}
            >
                <Input
                    label="Nueva contraseña"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    rightIcon={ToggleIcon}
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Input
                    label="Confirmar contraseña"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((s) => !s)}
                    leftIcon={ToggleIcon}
                >
                    {showPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
                </Button>
            </form>
        </Modal>
    );
}
