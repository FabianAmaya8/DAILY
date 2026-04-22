import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import styles from "../../assets/css/Layout/Avatar.module.scss";
import Swal from "sweetalert2";
import { supabase } from "../../utils/supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* =========================
   SCHEMA
========================= */

const passwordSchema = z
    .object({
        password: z.string().min(6, "Mínimo 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

export function ChangePasswordModal({ onClose }) {

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data) => {
        try {

            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (error) throw error;

            Swal.fire({
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
                title: "Error",
                text: err.message,
            });

        }
    };

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className={styles.modalHeader}>
                    <h3>Cambiar contraseña</h3>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className={styles.modalBody}>

                        {/* PASSWORD */}
                        <div className={styles.fieldGroup}>
                            <label>Nueva contraseña</label>

                            <div className={styles.inputWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className={styles.input}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.eyeButton}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && (
                                <span className={styles.error}>
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className={styles.fieldGroup}>
                            <label>Confirmar contraseña</label>

                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                className={styles.input}
                            />

                            {errors.confirmPassword && (
                                <span className={styles.error}>
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.secondaryBtn}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className={styles.primaryBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>,
        document.body
    );
}