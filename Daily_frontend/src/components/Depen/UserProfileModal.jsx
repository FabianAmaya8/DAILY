import { useState } from "react";
import { Mail, Briefcase, Activity, KeyRound, ShieldCheck, AlertOctagon } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { useUserProfile } from "../../hooks/useUserProfile";
import Cargando from "./Cargando";
import { ChangePasswordModal } from "./ChangePasswordModal";
import styles from "../../assets/css/Layout/UserProfile.module.scss";

const ROLE_VARIANT = {
    admin: "danger",
    lider: "warning",
    miembro: "info",
};

export function UserProfileModal({ userId, onClose, editable }) {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { profile, loading, error } = useUserProfile(userId);

    if (!userId) return null;

    const ultimoDaily = profile?.ultimo_daily?.[0];

    return (
        <>
            <Modal
                open
                onClose={onClose}
                title={profile?.nombre || "Perfil"}
                description={profile?.proyecto?.nombre}
                size="md"
            >
                {loading ? (
                    <Cargando />
                ) : error ? (
                    <EmptyState
                        icon={AlertOctagon}
                        title="No se pudo cargar el perfil"
                        description={error.message || error}
                    />
                ) : !profile ? null : (
                    <div className={styles.body}>
                        {/* Datos clave */}
                        <section className={styles.section}>
                            <div className={styles.row}>
                                <span className={styles.rowIcon}>
                                    <Mail size={14} aria-hidden="true" />
                                </span>
                                <span className={styles.rowLabel}>Correo</span>
                                <span className={styles.rowValue}>
                                    {profile.correo}
                                </span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.rowIcon}>
                                    <Briefcase size={14} aria-hidden="true" />
                                </span>
                                <span className={styles.rowLabel}>Rol</span>
                                <span className={styles.rowValue}>
                                    <Badge
                                        variant={ROLE_VARIANT[profile.rol] || "neutral"}
                                        size="sm"
                                    >
                                        {profile.rol}
                                    </Badge>
                                </span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.rowIcon}>
                                    <Activity size={14} aria-hidden="true" />
                                </span>
                                <span className={styles.rowLabel}>Ocupación</span>
                                <span className={styles.rowValueMono}>
                                    {profile.ocupacion ?? 0}%
                                </span>
                            </div>
                        </section>

                        {/* Último daily */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Último daily</h3>
                            {ultimoDaily ? (
                                <div className={styles.dailyBlock}>
                                    <Field label="Ayer">
                                        {ultimoDaily.que_hice_ayer || "—"}
                                    </Field>
                                    <Field label="Hoy">
                                        {ultimoDaily.que_hare_hoy || "—"}
                                    </Field>
                                    <Field label="Bloqueos">
                                        {ultimoDaily.bloqueos_texto || "Ninguno"}
                                    </Field>
                                </div>
                            ) : (
                                <p className={styles.muted}>
                                    No hay dailys registrados.
                                </p>
                            )}
                        </section>

                        {/* Certificaciones */}
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <ShieldCheck size={14} aria-hidden="true" />
                                Certificaciones
                            </h3>
                            {profile.certificaciones?.length ? (
                                <ul className={styles.certList}>
                                    {profile.certificaciones.map((c, i) => (
                                        <li key={i}>
                                            <code className={styles.certCode}>
                                                {c.certificacion.codigo}
                                            </code>
                                            <span>{c.certificacion.nombre}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.muted}>Sin certificaciones registradas.</p>
                            )}
                        </section>

                        {editable && (
                            <section className={styles.section}>
                                <Button
                                    variant="secondary"
                                    leftIcon={KeyRound}
                                    onClick={() => setShowPasswordModal(true)}
                                >
                                    Cambiar contraseña
                                </Button>
                            </section>
                        )}
                    </div>
                )}
            </Modal>

            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </>
    );
}

function Field({ label, children }) {
    return (
        <div className={styles.field}>
            <span className={styles.fieldLabel}>{label}</span>
            <p className={styles.fieldValue}>{children}</p>
        </div>
    );
}
