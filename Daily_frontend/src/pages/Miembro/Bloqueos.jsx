import styles from '../../assets/css/Miembro/Bloqueos.module.scss'
import BloqueosList from '../../components/Depen/BloqueosList'

export default function Bloqueos() {
    return (
        <div className={styles.container}>
            <h2>Bloqueos</h2>
            <BloqueosList />
        </div>
    )
}
