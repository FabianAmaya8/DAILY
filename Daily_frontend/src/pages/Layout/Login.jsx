import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/types/auth.types";
import { authService } from "../../utils/contexts/auth/authService";
import { useUser } from "../../utils/contexts/UserContext";
import { Card } from "../../components/ui/Card";
import { Loader2, Eye, EyeOff } from "lucide-react";
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

        } catch (error) {
            setServerError("Credenciales inválidas");
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
            <Card
                className={styles.cardContainer}
                title="Sistema de Visibilidad"
                description="Inicia sesión para continuar"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.form}
                >
                    {/* EMAIL */}
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="Correo corporativo"
                            {...register("email")}
                            className={styles.input}
                        />
                        {errors.email && (
                            <p className={styles.errorText}>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                {...register("password")}
                                className={styles.input}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.eyeButton}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className={styles.errorText}>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {serverError && (
                        <div className={styles.serverError}>
                            {serverError}
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
                            />
                        )}
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </Card>
        </div>
    );
}