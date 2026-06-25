import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";
import styles from "../../assets/css/ui/Modal.module.scss";

/**
 * Modal accesible:
 *  - Cierra con Escape
 *  - Cierra con click fuera
 *  - Bloquea scroll del body
 *  - Devuelve foco al cerrar
 *  - role="dialog" + aria-modal + aria-labelledby
 *
 * Props:
 *  - open, onClose
 *  - title (opcional, sirve también de aria-label si no hay aria-labelledby)
 *  - description (opcional)
 *  - size: sm | md | lg
 *  - hideCloseButton
 */
export function Modal({
    open,
    onClose,
    title,
    description,
    size = "md",
    hideCloseButton = false,
    children,
    className,
    footer,
}) {
    const dialogRef = useRef(null);
    const previousFocus = useRef(null);

    useEffect(() => {
        if (!open) return;

        previousFocus.current = document.activeElement;
        document.body.style.overflow = "hidden";

        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKey);

        // Focus inicial al dialog
        const t = setTimeout(() => dialogRef.current?.focus(), 0);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
            clearTimeout(t);
            previousFocus.current?.focus?.();
        };
    }, [open, onClose]);

    if (!open) return null;

    const titleId = title ? "modal-title" : undefined;
    const descId = description ? "modal-desc" : undefined;

    return createPortal(
        <div
            className={styles.overlay}
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={dialogRef}
                className={clsx(
                    styles.dialog,
                    styles[`s_${size}`],
                    className,
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || !hideCloseButton) && (
                    <header className={styles.header}>
                        <div className={styles.headerText}>
                            {title && (
                                <h2
                                    id={titleId}
                                    className={styles.title}
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p
                                    id={descId}
                                    className={styles.description}
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        {!hideCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.closeBtn}
                                aria-label="Cerrar"
                            >
                                <X size={18} aria-hidden="true" />
                            </button>
                        )}
                    </header>
                )}

                <div className={styles.body}>{children}</div>

                {footer && <footer className={styles.footer}>{footer}</footer>}
            </div>
        </div>,
        document.body,
    );
}
