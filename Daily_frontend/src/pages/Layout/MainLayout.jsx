import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Nav/Sidebar";
import Header from "../../components/Nav/Header";
import styles from "../../assets/css/Layout/MainLayout.module.scss";

export default function MainLayout() {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.contentWrapper}>
                <Header />
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}