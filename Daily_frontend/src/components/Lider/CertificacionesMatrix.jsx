import { useCertificaciones } from "../../hooks/useCertificaciones";
import styles from "../../assets/css/Lider/CertificacionesLider.module.scss";
import Cargando from "../Depen/Cargando";
import Swal from "sweetalert2";

export default function CertificacionesMatrix() {
    const {
        catalogo,
        personas,
        tieneCertificacion,
        toggleCertificacion,
        loading,
        error,
    } = useCertificaciones();

    if (loading) return <Cargando />;
    if (error) return <p>Error: {error}</p>;

    const handleToggle = async (persona, cert) => {
        const tiene = tieneCertificacion(persona.id, cert.id);

        const accion = tiene
            ? "quitar esta certificación"
            : "asignar esta certificación";

        const result = await Swal.fire({
            title: `¿Seguro que deseas ${accion}?`,
            html: `
                <strong>${cert.codigo} - ${cert.nombre}</strong><br/>
                a <b>${persona.nombre}</b>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "Cancelar",
            confirmButtonColor: tiene ? "#ef4444" : "#22c55e",
        });

        if (result.isConfirmed) {
            await toggleCertificacion(persona.id, cert.id);

            Swal.fire({
                title: "Actualizado",
                text: `Certificación ${
                    tiene ? "removida" : "asignada"
                } correctamente`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.stickyCol}>Persona</th>

                        {catalogo.map((cert) => (
                            <th key={cert.id} className={styles.th}>
                                <span className={styles.certCode}>
                                    {cert.codigo}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {personas.map((persona) => (
                        <tr key={persona.id} className={styles.row}>
                            <td className={styles.nombre}>
                                {persona.nombre}
                            </td>

                            {catalogo.map((cert) => {
                                const tiene = tieneCertificacion(
                                    persona.id,
                                    cert.id,
                                );

                                return (
                                    <td
                                        key={cert.id}
                                        className={`${styles.cell} ${
                                            tiene
                                                ? styles.activa
                                                : styles.inactiva
                                        }`}
                                        onClick={() =>
                                            handleToggle(persona, cert)
                                        }
                                    >
                                        <span className={styles.icon}>
                                            {tiene ? "✔" : "—"}
                                        </span>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
