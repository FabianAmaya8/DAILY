import { useState } from "react";
import ProtectedRoute from "../../utils/contexts/ProtectedRoute";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Nav/Sidebar";
import Header from "../../components/Nav/Header";
import styles from "../../assets/css/Layout/MainLayout.module.scss";

export default function MainLayout({ Roles }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ProtectedRoute allowedRoles={Roles}>
            <div className={styles.layout}>
                {/* SIDEBAR */}
                <Sidebar open={sidebarOpen} />

                {/* OVERLAY */}
                {sidebarOpen && (
                    <div
                        className={styles.overlay}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className={styles.contentWrapper}>
                    <Header
                        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    />

                    <main className={styles.main}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
