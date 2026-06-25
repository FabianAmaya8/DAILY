import clsx from "clsx";
import styles from "../../assets/css/ui/Badge.module.scss";

/**
 * Badge / Pill / Status indicator.
 * Variants: neutral | primary | success | warning | danger | info
 * Sizes: sm | md
 */
export function Badge({
    variant = "neutral",
    size = "sm",
    dot = false,
    className,
    children,
    ...rest
}) {
    return (
        <span
            className={clsx(
                styles.badge,
                styles[`v_${variant}`],
                styles[`s_${size}`],
                className,
            )}
            {...rest}
        >
            {dot && <span className={styles.dot} aria-hidden="true" />}
            {children}
        </span>
    );
}
