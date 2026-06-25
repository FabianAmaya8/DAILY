import { useMemo, useState } from "react";
import { Search, ShieldCheck, ShieldOff } from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Input } from "../../ui/Input";
import { EmptyState } from "../../ui/EmptyState";
import DetalleCertificacionModal from "./DetalleCertificacionModal";
import styles from "../../../assets/css/Miembro/Certificaciones.module.scss";

const ESTADO_VARIANT = {
    vigente: "success",
    por_vencer: "warning",
    expirada: "danger",
    pendiente: "neutral",
};

const ESTADO_LABEL = {
    vigente: "Vigente",
    por_vencer: "Por vencer",
    expirada: "Expirada",
    pendiente: "Pendiente",
};

export default function MisCertificaciones({
    userId,
    categorias,
    categoriaActiva,
    setCategoriaActiva,
    getRelacion,
}) {
    const [busqueda, setBusqueda] = useState("");
    const [seleccionada, setSeleccionada] = useState(null);

    const certificaciones = useMemo(() => {
        return categorias
            .filter((cat) => !categoriaActiva || cat.id === categoriaActiva)
            .flatMap((cat) => cat.certificaciones || [])
            .filter((cert) => {
                const text =
                    `${cert.nombre} ${cert.codigo} ${cert.entidad}`.toLowerCase();
                return text.includes(busqueda.toLowerCase());
            });
    }, [categorias, categoriaActiva, busqueda]);

    return (
        <>
            <div className={styles.topbar}>
                <Input
                    leftIcon={Search}
                    placeholder="Buscar por nombre, código o entidad…"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.searchInput}
                />

                <div
                    className={styles.filters}
                    role="tablist"
                    aria-label="Filtrar por categoría"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={!categoriaActiva}
                        className={`${styles.filterBtn} ${!categoriaActiva ? styles.filterActive : ""}`}
                        onClick={() => setCategoriaActiva(null)}
                    >
                        Todas
                    </button>
                    {categorias.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            role="tab"
                            aria-selected={categoriaActiva === cat.id}
                            className={`${styles.filterBtn} ${categoriaActiva === cat.id ? styles.filterActive : ""}`}
                            onClick={() => setCategoriaActiva(cat.id)}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {certificaciones.length === 0 ? (
                <EmptyState
                    icon={ShieldOff}
                    title={busqueda ? "Sin resultados" : "No hay certificaciones"}
                    description={
                        busqueda
                            ? "Prueba con otro término o limpia el filtro."
                            : "Aún no hay certificaciones disponibles para esta categoría."
                    }
                />
            ) : (
                <div className={styles.grid}>
                    {certificaciones.map((cert) => {
                        const relacion = getRelacion(userId, cert.id);
                        const estado = relacion?.estado || "pendiente";
                        return (
                            <Card
                                key={cert.id}
                                interactive
                                padding="md"
                                as="button"
                                type="button"
                                onClick={() =>
                                    setSeleccionada({ cert, relacion })
                                }
                                className={styles.certCard}
                                aria-label={`${cert.codigo} ${cert.nombre}`}
                            >
                                <header className={styles.certHeader}>
                                    <span className={styles.certCodigo}>
                                        {cert.codigo}
                                    </span>
                                    <Badge
                                        variant={ESTADO_VARIANT[estado]}
                                        size="sm"
                                        dot={estado === "vigente"}
                                    >
                                        {ESTADO_LABEL[estado] || estado}
                                    </Badge>
                                </header>

                                <h3 className={styles.certNombre}>
                                    {cert.nombre}
                                </h3>

                                <p className={styles.certEntidad}>
                                    <ShieldCheck size={11} aria-hidden="true" />
                                    {cert.entidad || "—"}
                                </p>
                            </Card>
                        );
                    })}
                </div>
            )}

            <DetalleCertificacionModal
                open={!!seleccionada}
                cert={seleccionada?.cert}
                relacion={seleccionada?.relacion}
                onClose={() => setSeleccionada(null)}
            />
        </>
    );
}
