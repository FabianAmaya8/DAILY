import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Calendar,
    AlertTriangle,
    BarChart3,
    Info,
} from "lucide-react";
import styles from "../../assets/css/Layout/Inicio.module.scss";

/**
 * Landing pública del producto DAILY.
 * Diseño Linear/Vercel: oscuro denso, jerarquía clara, acento verde,
 * animaciones de entrada con IntersectionObserver (sin librerías).
 */
export default function Inicio() {
    const navigate = useNavigate();
    const rootRef = useRef(null);

    const goToLogin = () => navigate("/login");

    // Reveal-on-scroll con IntersectionObserver
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const targets = root.querySelectorAll("[data-reveal]");

        // Si el usuario prefiere reduced motion, mostrar todo de una
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        if (prefersReduced) {
            targets.forEach((el) => el.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        );

        targets.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.page} ref={rootRef}>
            {/* Fondo decorativo */}
            <div className={styles.gridLines} aria-hidden="true" />
            <div className={styles.bgFx} aria-hidden="true" />

            {/* Nav superior */}
            <nav className={styles.nav} aria-label="Navegación principal">
                <div className={styles.navInner}>
                    <div className={styles.brand}>
                        <span className={styles.brandDot} aria-hidden="true" />
                        DAILY
                    </div>
                    <div className={styles.navActions}>
                        <button
                            type="button"
                            className={styles.btnGhost}
                            onClick={goToLogin}
                            style={{ padding: "8px 16px", fontSize: "var(--font-sm)" }}
                        >
                            Ingresar
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className={styles.hero}>
                <span
                    className={`${styles.badge} reveal`}
                    data-reveal=""
                >
                    <span className={styles.badgeDot} aria-hidden="true" />
                    Sistema de Visibilidad para equipos
                </span>

                <h1 className={`${styles.title} reveal reveal-delay-1`} data-reveal="">
                    La visibilidad del trabajo de tu equipo,
                    <br />
                    <span className={styles.accent}>sin reuniones extra.</span>
                </h1>

                <p className={`${styles.subtitle} reveal reveal-delay-2`} data-reveal="">
                    Registra dailys en 30 segundos, detecta bloqueos antes de que
                    escalen y llega a tus 1:1 con la ocupación semanal del equipo
                    ya lista.
                </p>

                <div className={`${styles.ctas} reveal reveal-delay-3`} data-reveal="">
                    <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={goToLogin}
                    >
                        Ingresar al sistema
                        <ArrowRight size={16} className={styles.btnArrow} />
                    </button>
                    <a
                        className={styles.btnGhost}
                        href="#features"
                    >
                        Ver qué hace
                    </a>
                </div>

                <p className={`${styles.heroHint} reveal reveal-delay-4`} data-reveal="">
                    Acceso restringido · solicita credenciales a tu líder o admin
                </p>
            </header>

            {/* Mockup / preview */}
            <section className={`${styles.preview} reveal`} data-reveal="">
                <div className={styles.previewCard}>
                    <div className={styles.previewBar}>
                        <span className={styles.dot} aria-hidden="true" />
                        <span className={styles.dot} aria-hidden="true" />
                        <span className={styles.dot} aria-hidden="true" />
                        <span className={styles.pill}>vista_dashboard_lider</span>
                    </div>
                    <div className={styles.previewBody}>
                        <div className={styles.statCard}>
                            <div className={styles.label}>Dailys hoy</div>
                            <div className={styles.value}>12 / 14</div>
                            <div className={styles.delta}>+2 vs ayer</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.label}>Ocupación semanal</div>
                            <div className={styles.value}>87%</div>
                            <div
                                className={styles.delta}
                                style={{ color: "var(--color-warning)" }}
                            >
                                3 personas {">"} 100%
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.label}>Bloqueos abiertos</div>
                            <div className={styles.value}>4</div>
                            <div
                                className={styles.delta}
                                style={{ color: "var(--color-danger)" }}
                            >
                                1 vence hoy
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className={styles.features} id="features">
                <div className={`${styles.eyebrow} reveal`} data-reveal="">
                    Qué hace DAILY
                </div>
                <h2 className={`${styles.sectionTitle} reveal reveal-delay-1`} data-reveal="">
                    Todo lo que un líder necesita saber sobre su equipo,
                    en una sola pantalla.
                </h2>

                <div className={styles.featuresGrid}>
                    <article className={`${styles.featureCard} reveal reveal-delay-1`} data-reveal="">
                        <div className={styles.featureIcon}>
                            <Calendar size={20} aria-hidden="true" />
                        </div>
                        <h3 className={styles.featureTitle}>Dailys estructurados</h3>
                        <p className={styles.featureDesc}>
                            Cada miembro registra qué hizo, qué hará y bloqueos.
                            Ligado a Work Items y proyectos. Trazabilidad completa.
                        </p>
                    </article>

                    <article className={`${styles.featureCard} reveal reveal-delay-2`} data-reveal="">
                        <div className={styles.featureIcon}>
                            <AlertTriangle size={20} aria-hidden="true" />
                        </div>
                        <h3 className={styles.featureTitle}>Bloqueos tempranos</h3>
                        <p className={styles.featureDesc}>
                            Los bloqueos suben automáticamente al líder con
                            severidad y responsable. Los riesgos se resuelven
                            antes de que escalen.
                        </p>
                    </article>

                    <article className={`${styles.featureCard} reveal reveal-delay-3`} data-reveal="">
                        <div className={styles.featureIcon}>
                            <BarChart3 size={20} aria-hidden="true" />
                        </div>
                        <h3 className={styles.featureTitle}>Ocupación semanal</h3>
                        <p className={styles.featureDesc}>
                            Saturación por persona y proyecto, calculada en tiempo
                            real desde los dailys. Detecta sobrecargas y huecos.
                        </p>
                    </article>
                </div>
            </section>

            {/* Notice / acceso */}
            <aside className={`${styles.notice} reveal`} data-reveal="" role="note">
                <Info size={18} className={styles.noticeIcon} aria-hidden="true" />
                <div>
                    <strong>Acceso interno.</strong> DAILY es una herramienta
                    privada de tu organización. Para ingresar utiliza las
                    credenciales que te proporcionó tu líder o administrador.
                </div>
            </aside>
        </div>
    );
}
