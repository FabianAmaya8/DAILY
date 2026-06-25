import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ProtectedRoute from "../../utils/contexts/ProtectedRoute";
import Sidebar from "../../components/Nav/Sidebar";
import Header from "../../components/Nav/Header";
import styles from "../../assets/css/Layout/MainLayout.module.scss";

export default function MainLayout({ Roles }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Cierra el drawer al cambiar de ruta (UX móvil)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <ProtectedRoute allowedRoles={Roles}>
            <div className={styles.layout}>
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {sidebarOpen && (
                    <button
                        type="button"
                        className={styles.overlay}
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Cerrar menú"
                    />
                )}

                <div className={styles.contentWrapper}>
                    <Header
                        toggleSidebar={() => setSidebarOpen((v) => !v)}
                        sidebarOpen={sidebarOpen}
                    />
                    <main className={styles.main}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
