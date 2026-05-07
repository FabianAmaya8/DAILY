import { useEffect, useState } from "react";
import styles from "../../../assets/css/Lider/CertificacionesLider.module.scss";
import Avatar from "../../Depen/Avatar";

export default function CertificacionModal({
    seleccion,
    onClose,
    onSave,
    getRelacion,
}) {
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (seleccion) {
            const { persona, cert } = seleccion;
            const relacion = getRelacion(persona.id, cert.id);

            // 🔥 fechas helper
            const hoy = new Date();
            const hoyStr = hoy.toISOString().split("T")[0];

            const nextYear = new Date();
            nextYear.setFullYear(hoy.getFullYear() + 1);
            const nextYearStr = nextYear.toISOString().split("T")[0];

            // 🔥 DEFAULTS INTELIGENTES
            setFormData({
                estado: relacion?.estado || "pendiente",
                fecha_obtencion: relacion?.fecha_obtencion || hoyStr,
                fecha_expiracion: relacion?.fecha_expiracion || nextYearStr,
                credencial_url: relacion?.credencial_url || "",
                validado: relacion?.validado ? "false" : "true",
                nivel: relacion?.nivel || "Básico",
            });

            setTimeout(() => setVisible(true), 10);
        }
    }, [seleccion]);

    if (!seleccion || !formData) return null;

    const { persona, cert } = seleccion;

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onClose(), 200);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave(persona.id, cert.id, formData);
        handleClose();
    };

    return (
        <div
            className={`${styles.modalOverlay} ${
                visible ? styles.overlayShow : ""
            }`}
            onClick={handleClose}
        >
            <div
                className={`${styles.modal} ${
                    visible ? styles.modalShow : ""
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <Avatar userId={persona.id} Nombre={persona.nombre} />
                    <div>
                        <div className={styles.modalTitle}>{persona.nombre}</div>
                        <div className={styles.sub}>
                            {cert.codigo} — {cert.nombre}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleClose} 
                    className={styles.btnClose}
                >
                    X
                </button>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    {/* ESTADO */}
                    <div className={styles.field}>
                        <label>Estado</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                        >
                            <option value="vigente">Vigente</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="expirada">Expirada</option>
                            <option value="por_vencer">Por vencer</option>
                        </select>
                    </div>

                    {/* FECHAS */}
                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label>Obtención</label>
                            <input
                                type="date"
                                name="fecha_obtencion"
                                value={formData.fecha_obtencion}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Expiración</label>
                            <input
                                type="date"
                                name="fecha_expiracion"
                                value={formData.fecha_expiracion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* VALIDADO */}
                    <div className={styles.field}>
                        <label>Validación</label>
                        <select
                            name="validado"
                            value={formData.validado}
                            onChange={handleChange}
                        >
                            <option value="false">No validado</option>
                            <option value="true">Validado</option>
                        </select>
                    </div>

                    {/* ACTIONS */}
                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles.btnCancel}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className={styles.btnSave}
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}