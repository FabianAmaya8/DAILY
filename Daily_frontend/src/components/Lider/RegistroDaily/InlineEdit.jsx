import { useState, useRef, useEffect } from "react";
import styles from "../../../assets/css/Lider/RegistrarDaily.module.scss";

export default function InlineEdit({
    value,
    onChange,
    placeholder = "Escribe...",
    multiline = false
}) {
    const [editing, setEditing] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (editing && ref.current) {
            ref.current.focus();
        }
    }, [editing]);

    const handleBlur = () => {
        setEditing(false);
    };

    const handleKeyDown = (e) => {
        if (!multiline && e.key === "Enter") {
            e.preventDefault();
            setEditing(false);
        }
    };

    return (
        <div className={styles.inlineWrapper}>
            {editing ? (
                <div
                    ref={ref}
                    contentEditable
                    suppressContentEditableWarning
                    className={styles.inlineInput}
                    onBlur={handleBlur}
                    onInput={(e) => onChange(e.currentTarget.textContent)}
                    onKeyDown={handleKeyDown}
                >
                    {value}
                </div>
            ) : (
                <p
                    className={`${styles.inlineText} ${
                        !value ? styles.placeholder : ""
                    }`}
                    onClick={() => setEditing(true)}
                >
                    {value || placeholder}
                </p>
            )}
        </div>
    );
}