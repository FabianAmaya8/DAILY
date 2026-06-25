import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

/**
 * InlineEdit — texto que se vuelve editable al click.
 * Mejorado en Fase 5: usa <textarea>/<input> nativo (mejor accesibilidad
 * que contenteditable), tecla Escape cancela, click fuera guarda.
 */
export default function InlineEdit({
    value,
    onChange,
    placeholder = "Escribe…",
    multiline = false,
}) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value || "");
    const ref = useRef(null);

    useEffect(() => {
        if (editing && ref.current) {
            ref.current.focus();
            // Coloca cursor al final
            const len = ref.current.value.length;
            ref.current.setSelectionRange(len, len);
        }
    }, [editing]);

    useEffect(() => {
        if (!editing) setDraft(value || "");
    }, [value, editing]);

    const commit = () => {
        if (draft !== value) onChange(draft);
        setEditing(false);
    };

    const cancel = () => {
        setDraft(value || "");
        setEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            cancel();
        }
        if (!multiline && e.key === "Enter") {
            e.preventDefault();
            commit();
        }
    };

    if (!editing) {
        return (
            <button
                type="button"
                className={`${styles.inlineText} ${!value ? styles.placeholder : ""}`}
                onClick={() => setEditing(true)}
                aria-label="Editar campo"
            >
                <span>{value || placeholder}</span>
                <Pencil
                    size={12}
                    aria-hidden="true"
                    className={styles.inlineEditIcon}
                />
            </button>
        );
    }

    if (multiline) {
        return (
            <textarea
                ref={ref}
                rows={Math.max(2, Math.ceil((draft?.length || 0) / 60))}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={handleKeyDown}
                className={styles.inlineInput}
                placeholder={placeholder}
            />
        );
    }

    return (
        <input
            ref={ref}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className={styles.inlineInput}
            placeholder={placeholder}
        />
    );
}
