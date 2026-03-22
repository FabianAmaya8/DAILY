import styles from "../../../assets/css/Lider/LiderDashboard.module.scss";
import Avatar from "../../Depen/Avatar";

export default function MemberCard({ member, onClick }) {

    return (
        <div onClick={onClick} className={styles.card}>
            <div className={styles.name}>
                {member.nombre}

                <Avatar Nombre={member.nombre} />
            </div>

            <p className={styles.meta}>
                Proyecto:
                <span className={styles.highlight}>
                    {member.proyecto || "Sin asignar"}
                </span>
            </p>

            <p className={styles.meta}>
                Ocupación:
                <span className={styles.badge}>
                    {member.ocupacion_porcentaje
                        ? `${member.ocupacion_porcentaje}%`
                        : "0%"}
                </span>
            </p>

            <p className={styles.meta}>
                Hoy:
                <span className={styles.highlight}>
                    {member.que_hare_hoy || "—"}
                </span>
            </p>

            {member.bloqueos_texto && (
                <p className={styles.blocker}>
                    🚨 {member.bloqueos_texto}
                </p>
            )}
        </div>
    );
}