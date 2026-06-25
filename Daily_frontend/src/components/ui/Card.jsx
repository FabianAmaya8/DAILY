import clsx from "clsx";
import styles from "../../assets/css/ui/Card.module.scss";

/**
 * Card — contenedor base reutilizable.
 *
 * Props:
 *  - title, description (opcionales — header automático)
 *  - footer (opcional)
 *  - padding: "none" | "sm" | "md" | "lg" (default md)
 *  - interactive (boolean) — añade hover sutil
 */
export function Card({
    children,
    className,
    title,
    description,
    footer,
    padding = "md",
    interactive = false,
    as: Tag = "div",
    ...rest
}) {
    return (
        <Tag
            className={clsx(
                styles.card,
                styles[`p_${padding}`],
                interactive && styles.interactive,
                className,
            )}
            {...rest}
        >
            {(title || description) && (
                <div className={styles.header}>
                    {title && <h3 className={styles.title}>{title}</h3>}
                    {description && (
                        <p className={styles.description}>{description}</p>
                    )}
                </div>
            )}

            <div className={styles.body}>{children}</div>

            {footer && <div className={styles.footer}>{footer}</div>}
        </Tag>
    );
}
