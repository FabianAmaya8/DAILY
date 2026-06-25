import { useState, useMemo } from "react";
import { useUser } from "../../utils/contexts/UserContext";
import { UserProfileModal } from "./UserProfileModal";
import styles from "../../assets/css/Layout/Avatar.module.scss";

/* =========================
   HELPERS
========================= */

const getInitials = (name) => {
    if (!name) return "?";
    return name
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
};

// Paleta calibrada para fondos oscuros y claros
const PALETTE = [
    "#3fb950",
    "#56d364",
    "#58a6ff",
    "#7ee787",
    "#79c0ff",
    "#a5d6ff",
    "#a371f7",
    "#bc8cff",
    "#d29922",
    "#e3b341",
    "#ff7b72",
    "#ffa198",
    "#39c5cf",
    "#56d4dd",
];

const getColorFromString = (str) => {
    if (!str) return PALETTE[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PALETTE[Math.abs(hash) % PALETTE.length];
};

// Detecta luminancia y elige texto oscuro o claro
const getTextColor = (bgColor) => {
    const c = bgColor.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 165 ? "#0a0d12" : "#ffffff";
};

export default function Avatar({ userId, Nombre, size = "md" }) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);

    const initials = useMemo(() => getInitials(Nombre), [Nombre]);
    const bgColor = useMemo(() => getColorFromString(Nombre || ""), [Nombre]);
    const textColor = useMemo(() => getTextColor(bgColor), [bgColor]);

    const editable = userId === user?.id;

    const handleClick = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <>
            <button
                type="button"
                className={`${styles.avatar} ${styles[`s_${size}`]}`}
                onClick={handleClick}
                style={{ backgroundColor: bgColor, color: textColor }}
                aria-label={`Abrir perfil de ${Nombre || "usuario"}`}
                title={Nombre || "Usuario"}
            >
                {initials}
            </button>

            {open && (
                <UserProfileModal
                    userId={userId}
                    onClose={() => setOpen(false)}
                    editable={editable}
                />
            )}
        </>
    );
}
