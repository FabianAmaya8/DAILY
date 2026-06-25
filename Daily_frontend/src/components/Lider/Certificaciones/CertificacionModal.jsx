import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import Avatar from "../../Depen/Avatar";
import styles from "../../../assets/css/Lider/CertificacionesLider.module.scss";

const ESTADOS = [
    { value: "vigente", label: "Vigente" },
    { value: "pendiente", label: "Pendiente" },
    { value: "por_vencer", label: "Por vencer" },
    { value: "expirada", label: "Expirada" },
];

const NIVELES = ["Básico", "Intermedio", "Avanzado", "Experto"];

function todayISO() {
    return new Date().toISOString().split("T")[0];
}
function nextYearISO() {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
}

export default function CertificacionModal({
    seleccion,
    onClose,
    onSave,
    getRelacion,
}) {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (!seleccion) return;
        const { persona, cert } = seleccion;
        const relacion = getRelacion(persona.id, cert.id);
        setFormData({
            estado: relacion?.estado || "pendiente",
            fecha_obtencion: relacion?.fecha_obtencion || todayISO(),
            fecha_expiracion: relacion?.fecha_expiracion || nextYearISO(),
            credencial_url: relacion?.credencial_url || "",
            validado: relacion?.validado ? "true" : "false",
            nivel: relacion?.nivel || "Básico",
        });
    }, [seleccion, getRelacion]);

    if (!seleccion || !formData) return null;

    const { persona, cert } = seleccion;

    const set = (key) => (e) =>
        setFormData((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(persona.id, cert.id, formData);
        onClose();
    };

    return (
        <Modal
            open={!!seleccion}
            onClose={onClose}
            title={persona.nombre}
            description={`${cert.codigo} — ${cert.nombre}`}
            size="md"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="cert-modal-form"
                        variant="primary"
                        leftIcon={Save}
                    >
                        Guardar
                    </Button>
                </>
            }
        >
            <div className={styles.modalIdentity}>
                <Avatar
                    userId={persona.id}
                    Nombre={persona.nombre}
                    size="lg"
                />
            </div>

            <form
                id="cert-modal-form"
                onSubmit={handleSubmit}
                className={styles.modalForm}
                noValidate
            >
                <Field label="Estado">
                    <select
                        value={formData.estado}
                        onChange={set("estado")}
                        className={styles.select}
                    >
                        {ESTADOS.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <div className={styles.fieldRow}>
                    <Input
                        type="date"
                        label="Obtención"
                        value={formData.fecha_obtencion}
                        onChange={set("fecha_obtencion")}
                    />
                    <Input
                        type="date"
                        label="Expiración"
                        value={formData.fecha_expiracion}
                        onChange={set("fecha_expiracion")}
                    />
                </div>

                <div className={styles.fieldRow}>
                    <Field label="Nivel">
                        <select
                            value={formData.nivel}
                            onChange={set("nivel")}
                            className={styles.select}
                        >
                            {NIVELES.map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Validación">
                        <select
                            value={formData.validado}
                            onChange={set("validado")}
                            className={styles.select}
                        >
                            <option value="false">No validado</option>
                            <option value="true">Validado</option>
                        </select>
                    </Field>
                </div>

                <Input
                    type="url"
                    label="URL de credencial (opcional)"
                    placeholder="https://..."
                    value={formData.credencial_url}
                    onChange={set("credencial_url")}
                />
            </form>
        </Modal>
    );
}

function Field({ label, children }) {
    return (
        <label className={styles.field}>
            <span className={styles.fieldLabel}>{label}</span>
            {children}
        </label>
    );
}
