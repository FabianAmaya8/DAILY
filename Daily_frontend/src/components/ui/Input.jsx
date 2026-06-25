import { forwardRef, useId } from "react";
import clsx from "clsx";
import styles from "../../assets/css/ui/Input.module.scss";

/**
 * Input — componente base con label, error y ayuda integrados.
 *
 * Props:
 *  - label, hint, error
 *  - leftIcon, rightIcon (componente lucide)
 *  - id (opcional, autogenera si no se pasa)
 */
export const Input = forwardRef(function Input(
    {
        label,
        hint,
        error,
        id,
        leftIcon: LeftIcon,
        rightIcon: RightIcon,
        className,
        type = "text",
        disabled = false,
        ...rest
    },
    ref,
) {
    const reactId = useId();
    const inputId = id || `input-${reactId}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
        <div className={clsx(styles.wrap, className)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={styles.label}
                >
                    {label}
                </label>
            )}

            <div className={clsx(styles.inputWrap, error && styles.hasError)}>
                {LeftIcon && (
                    <LeftIcon
                        size={16}
                        aria-hidden="true"
                        className={styles.leftIcon}
                    />
                )}

                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={describedBy}
                    className={clsx(
                        styles.input,
                        LeftIcon && styles.hasLeftIcon,
                        RightIcon && styles.hasRightIcon,
                    )}
                    {...rest}
                />

                {RightIcon && (
                    <RightIcon
                        size={16}
                        aria-hidden="true"
                        className={styles.rightIcon}
                    />
                )}
            </div>

            {hint && !error && (
                <p
                    id={hintId}
                    className={styles.hint}
                >
                    {hint}
                </p>
            )}

            {error && (
                <p
                    id={errorId}
                    className={styles.error}
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
});
