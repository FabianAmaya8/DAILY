import React from "react";
import clsx from "clsx";

/**
 * Card - Componente base tipo shadcn
 * Props:
 * - children
 * - className
 * - title (opcional)
 * - description (opcional)
 * - footer (opcional)
 */

export function Card({ children, className, title, description, footer }) {
    return (
        <div
            className={clsx(
                "bg-[var(--color-bg-secondary)]",
                "border border-[var(--color-border)]",
                "rounded-xl shadow-sm",
                "p-6",
                "transition hover:shadow-md",
                className,
            )}
        >
            {(title || description) && (
                <div className="mb-4">
                    {title && (
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div>{children}</div>

            {footer && (
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    {footer}
                </div>
            )}
        </div>
    );
}
