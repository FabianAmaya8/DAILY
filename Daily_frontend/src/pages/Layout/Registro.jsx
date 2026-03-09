import { useForm } from "react-hook-form";
import styles from "../../assets/css/login.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { personSchema } from "../../utils/types/person.schema";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useRegisterPerson } from "../../hooks/useRegisterPerson";
import { useAuth } from "../../utils/contexts/auth/AuthProvider";

export default function RegisterPerson() {

    const navigate = useNavigate();
    const { registerPerson } = useRegisterPerson();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(personSchema),
        defaultValues: {
            display_name: "",
            email: "",
            password: "usuario123",
            role: "member",
            capacity_hours_week: 40,
            timezone: "America/Bogota",
            active: true,
        },
    });

    const onSubmit = async (data) => {
        try {

            await registerPerson(data);

            Swal.fire({
                icon: "success",
                title: "Usuario creado correctamente",
                timer: 2000,
                showConfirmButton: false,
            });

            reset();
            navigate("/admin/dashboard");

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
            });

        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>Registrar Persona</h2>
                <p className={styles.subtitle}>
                    Agrega un nuevo miembro al sistema
                </p>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Nombre */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Nombre</label>
                        <input
                            type="text"
                            className={styles.input}
                            {...register("display_name")}
                        />
                        {errors.display_name && (
                            <span className={styles.error}>
                                {errors.display_name.message}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Correo</label>
                        <input
                            type="email"
                            className={styles.input}
                            {...register("email")}
                            autoComplete="off"
                        />
                        {errors.email && (
                            <span className={styles.error}>
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Contraseña temporal</label>
                        <input
                            type="text"
                            autoComplete="off"
                            className={styles.input}
                            {...register("password")}
                        />
                        {errors.password && (
                            <span className={styles.error}>
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    {/* Rol */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Rol</label>
                        <select
                            className={styles.select + " " + styles.input}
                            {...register("role")}
                        >
                            <option value="member">Miembro</option>
                            <option value="leader">Líder</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    {/* Capacidad */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Capacidad semanal
                        </label>
                        <input
                            type="number"
                            className={styles.input}
                            {...register("capacity_hours_week", {
                                valueAsNumber: true,
                            })}
                        />
                    </div>

                    {/* Timezone */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Zona Horaria</label>
                        <input
                            type="text"
                            className={styles.input}
                            {...register("timezone")}
                        />
                    </div>

                    {/* Activo */}
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            {...register("active")}
                        />
                        <label className={styles.checkboxLabel}>
                            Usuario activo
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <span className={styles.loader}></span>
                        )}
                        {isSubmitting ? "Guardando..." : "Registrar Persona"}
                    </button>
                </form>
            </div>
        </div>
    );
}
