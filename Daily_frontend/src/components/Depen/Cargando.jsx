import { Spiral } from "ldrs/react";
import styles from "../../assets/css/Layout/Cargando.module.scss";

/**
 * Loader centrado para Suspense fallback y estados de carga page-level.
 * Tiene un mínimo de 240px de alto para evitar layout shift.
 */
export default function Cargando({ size = 56, label = "Cargando…" }) {
    return (
        <div
            className={styles.wrap}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <Spiral color="var(--color-primary)" size={size} />
            <span className={styles.label}>{label}</span>
        </div>
    );
}
