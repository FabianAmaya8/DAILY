import styles from "../../assets/css/Layout/Avatar.module.scss";
import { UserProfileModal } from "./UserProfileModal";
import { useState } from "react";

export default function Avatar({ userId, Nombre }) {

    const [open, setOpen] = useState(false);

    const letter = Nombre?.charAt(0)?.toUpperCase() || "?";

    const handleClick = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <>
            <button
                type="button"
                className={styles.avatar}
                onClick={handleClick}
            >
                {letter}
            </button>

            {open && (
                <UserProfileModal
                    userId={userId}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}