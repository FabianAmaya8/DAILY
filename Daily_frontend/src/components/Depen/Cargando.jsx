import { Spiral } from 'ldrs/react'
import styles from "../../assets/css/Layout/MainLayout.module.scss";

export default function Cargando() {
    return (
        <div className={styles.cargando} >
            <Spiral 
                color= "var(--color-primary)"
                size={100}
            />
        </div>
    )
}
