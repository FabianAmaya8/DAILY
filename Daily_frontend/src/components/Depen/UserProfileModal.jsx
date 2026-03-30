import styles from "../../assets/css/Layout/Avatar.module.scss";
import { useUserProfile } from "../../hooks/useUserProfile";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import Cargando from "./Cargando";

export function UserProfileModal({ userId, onClose }) {

    const { profile, loading, error } = useUserProfile(userId);
    console.log("🚀 ~ UserProfileModal ~ profile:", profile)

    // cerrar con ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    if (!userId) return null;

    if (loading) {
        return createPortal(
            <div className={styles.modalOverlay} onClick={onClose}>
                <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Cargando />
                </div>
            </div>,
            document.body
        );
    }

    if (error) {
        return createPortal(
            <div className={styles.modalOverlay} onClick={onClose}>
                <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <p>Error cargando perfil</p>
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>,
            document.body
        );
    }

    if (!profile) return null;

    const ultimoDaily = profile.ultimo_daily?.[0];

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >

                <div className={styles.modalHeader}>
                    <h2>{profile.nombre}</h2>
                    <button onClick={onClose}>✖</button>
                </div>

                <div className={styles.modalBody}>

                    <p><b>Correo:</b> {profile.correo}</p>
                    <p><b>Rol:</b> {profile.rol}</p>
                    <p><b>Proyecto:</b> {profile.proyecto?.nombre || "N/A"}</p>
                    <p><b>Ocupación:</b> {profile.ocupacion}%</p>

                    <hr />

                    <h4>Último Daily</h4>
                    <p><b>Ayer:</b> {ultimoDaily?.que_hice_ayer || "-"}</p>
                    <p><b>Hoy:</b> {ultimoDaily?.que_hare_hoy || "-"}</p>
                    <p><b>Bloqueos:</b> {ultimoDaily?.bloqueos_texto || "Ninguno"}</p>

                    <hr />

                    <h4>Certificaciones</h4>

                    <ul>
                        {profile.certificaciones?.length > 0
                            ? profile.certificaciones.map((c, i) => (
                                <li key={i}>
                                    {c.certificacion.codigo} - {c.certificacion.nombre}
                                </li>
                            ))
                            : <li>No tiene certificaciones</li>
                        }
                    </ul>

                </div>

            </div>
        </div>,
        document.body
    );
}