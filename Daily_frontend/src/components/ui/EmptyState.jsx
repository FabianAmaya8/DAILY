import clsx from "clsx";
import styles from "../../assets/css/ui/EmptyState.module.scss";

/**
 * EmptyState — pantalla vacía amable.
 * Útil para cuando una tabla, lista o dashboard está sin datos.
 */
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}) {
    return (
        <div className={clsx(styles.wrap, className)} role="status">
            {Icon && (
                <div className={styles.iconWrap}>
                    <Icon size={28} aria-hidden="true" />
                </div>
            )}
            {title && <h3 className={styles.title}>{title}</h3>}
            {description && (
                <p className={styles.description}>{description}</p>
            )}
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}
