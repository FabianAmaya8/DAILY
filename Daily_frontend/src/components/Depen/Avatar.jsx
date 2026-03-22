import styles from "../../assets/css/Layout/MainLayout.module.scss";


export default function Avatar({Nombre}) {
    const letter = Nombre.charAt(0).toUpperCase();
    
    return (
        <div className={styles.avatar}>{letter}</div>
    )
}
