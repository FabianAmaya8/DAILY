import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/types/auth.types";
import { authService } from "../../utils/contexts/auth/authService";
import { useUser } from "../../utils/contexts/UserContext";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import styles from "../../assets/css/login.module.scss";

export default function Login() {
    const navigate = useNavigate();
    const { rol } = useUser();

    const [serverError, setServerError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (values) => {
        try {
            setServerError(null);
            setLoading(true);
            await authService.login(values.email, values.password);
        } catch {
            setServerError("Credenciales inválidas. Revisa tu correo y contraseña.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (rol) {
            navigate(`/${rol}/dashboard`);
        }
    }, [rol, navigate]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.cardContainer}>
                <div className={styles.brand}>
                    <span className={styles.brandDot} aria-hidden="true" />
                    DAILY
                </div>

                <h1 className={styles.title}>Inicia sesión</h1>
                <p className={styles.description}>
                    Sistema de Visibilidad para tu equipo
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.form}
                    noValidate
                >
                    {/* EMAIL */}
                    <div className={styles.inputGroup}>
                        <label
                            htmlFor="login-email"
                            className={styles.label}
                        >
                            Correo corporativo
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            placeholder="nombre@empresa.com"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "login-email-error" : undefined}
                            {...register("email")}
                            className={styles.input}
                        />
                        {errors.email && (
                            <p
                                id="login-email-error"
                                className={styles.errorText}
                                role="alert"
                            >
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className={styles.inputGroup}>
                        <label
                            htmlFor="login-password"
                            className={styles.label}
                        >
                            Contraseña
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                aria-invalid={!!errors.password}
                                aria-describedby={
                                    errors.password ? "login-password-error" : undefined
                                }
                                {...register("password")}
                                className={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.eyeButton}
                                aria-label={
                                    showPassword
                                        ? "Ocultar contraseña"
                                        : "Mostrar contraseña"
                                }
                                aria-pressed={showPassword}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} aria-hidden="true" />
                                ) : (
                                    <Eye size={18} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p
                                id="login-password-error"
                                className={styles.errorText}
                                role="alert"
                            >
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {serverError && (
                        <div className={styles.serverError} role="alert">
                            <AlertCircle size={16} aria-hidden="true" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading && (
                            <Loader2
                                size={16}
                                className={styles.loader}
                                aria-hidden="true"
                            />
                        )}
                        {loading ? "Ingresando…" : "Ingresar"}
                    </button>
                </form>

                <div className={styles.cardFooter}>
                    ¿No tienes acceso? Contacta a tu líder o administrador ·{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}
