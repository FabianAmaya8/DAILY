import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import styles from "../../assets/css/ui/Button.module.scss";

/**
 * Button — componente base del design system DAILY.
 *
 * Variants: primary | secondary | ghost | danger | link
 * Sizes:    sm | md | lg
 * Props extra: leftIcon, rightIcon, loading, fullWidth
 */
export const Button = forwardRef(function Button(
    {
        variant = "primary",
        size = "md",
        leftIcon: LeftIcon,
        rightIcon: RightIcon,
        loading = false,
        fullWidth = false,
        disabled = false,
        type = "button",
        className,
        children,
        ...rest
    },
    ref,
) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={clsx(
                styles.btn,
                styles[`v_${variant}`],
                styles[`s_${size}`],
                fullWidth && styles.fullWidth,
                className,
            )}
            {...rest}
        >
            {loading ? (
                <Loader2
                    size={size === "sm" ? 14 : 16}
                    className={styles.loader}
                    aria-hidden="true"
                />
            ) : (
                LeftIcon && (
                    <LeftIcon
                        size={size === "sm" ? 14 : 16}
                        aria-hidden="true"
                    />
                )
            )}
            <span className={styles.label}>{children}</span>
            {RightIcon && !loading && (
                <RightIcon
                    size={size === "sm" ? 14 : 16}
                    aria-hidden="true"
                    className={styles.rightIcon}
                />
            )}
        </button>
    );
});
