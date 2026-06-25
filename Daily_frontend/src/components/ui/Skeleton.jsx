import clsx from "clsx";
import styles from "../../assets/css/ui/Skeleton.module.scss";

/**
 * Skeleton — placeholder de carga shimmer.
 * Usar mientras se cargan datos para evitar layout shift.
 *
 * Variants: text | line | rect | circle
 */
export function Skeleton({
    variant = "rect",
    width,
    height,
    className,
    style,
    ...rest
}) {
    const inlineStyle = {
        width,
        height,
        ...style,
    };

    return (
        <span
            aria-hidden="true"
            className={clsx(
                styles.skel,
                styles[`v_${variant}`],
                className,
            )}
            style={inlineStyle}
            {...rest}
        />
    );
}
