import styles from "../../assets/css/Layout/Avatar.module.scss";
import { useUser } from "../../utils/contexts/UserContext";
import { UserProfileModal } from "./UserProfileModal";
import { useState, useMemo } from "react";

/* =========================
   HELPERS
========================= */

// Iniciales (máx 2)
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

// Paleta pastel
const pastelColors = [
    "#a7f3d0",
    "#6ee7b7",
    "#93c5fd",
    "#60a5fa",
    "#c4b5fd",
    "#a78bfa",
    "#f9a8d4",
    "#fca5a5",
    "#fdba74",
    "#fde68a",
    "#67e8f9",
    "#99f6e4",
];

// Color estable por usuario
const getColorFromString = (str) => {
    if (!str) return pastelColors[0];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return pastelColors[Math.abs(hash) % pastelColors.length];
};

// Detectar si color es claro → cambiar texto a oscuro
const getTextColor = (bgColor) => {
    const color = bgColor.substring(1);
    const rgb = parseInt(color, 16);

    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 180 ? "#333" : "#eee";
};

export default function Avatar({ userId, Nombre }) {
    const { user } = useUser();
    const [abrirModal, setAbrirModal] = useState(false);
    const [editableAvatar, setEditableAvatar] = useState(false);

    const initials = useMemo(() => getInitials(Nombre), [Nombre]);
    const bgColor = useMemo(() => getColorFromString(Nombre), [Nombre]);
    const textColor = useMemo(() => getTextColor(bgColor), [bgColor]);

    const handleClick = (e) => {
        e.stopPropagation();
        setAbrirModal(true);
        if (userId === user.id) setEditableAvatar(true);
    };

    return (
        <>
            <button
                type="button"
                className={styles.avatar}
                onClick={handleClick}
                style={{
                    backgroundColor: bgColor,
                    color: textColor,
                }}
            >
                {initials}
            </button>

            {abrirModal && (
                <UserProfileModal
                    userId={userId}
                    onClose={() => setAbrirModal(false)}
                    editable={editableAvatar}
                />
            )}
        </>
    );
}