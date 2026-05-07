import { useMemo, useState } from "react";

import styles from "../../../assets/css/Miembro/Certificaciones.module.scss";

import DetalleCertificacionModal from "./DetalleCertificacionModal";

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
            .filter((cat) => {
                if (!categoriaActiva) return true;

                return cat.id === categoriaActiva;
            })
            .flatMap(
                (cat) => cat.certificaciones || [],
            )
            .filter((cert) => {
                const text = `
                    ${cert.nombre}
                    ${cert.codigo}
                    ${cert.entidad}
                `.toLowerCase();

                return text.includes(
                    busqueda.toLowerCase(),
                );
            });
    }, [
        categorias,
        categoriaActiva,
        busqueda,
    ]);

    return (
        <>
            <div className={styles.topbar}>
                <input
                    type="text"
                    placeholder="Buscar certificación..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                    className={styles.search}
                />

                <div className={styles.filters}>
                    <button
                        className={
                            !categoriaActiva
                                ? styles.active
                                : ""
                        }
                        onClick={() =>
                            setCategoriaActiva(null)
                        }
                    >
                        Todas
                    </button>

                    {categorias.map((cat) => (
                        <button
                            key={cat.id}
                            className={
                                categoriaActiva === cat.id
                                    ? styles.active
                                    : ""
                            }
                            onClick={() =>
                                setCategoriaActiva(cat.id)
                            }
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.grid}>
                {certificaciones.map((cert) => {
                    const relacion = getRelacion(
                        userId,
                        cert.id,
                    );

                    const estado = relacion?.estado;

                    return (
                        <div
                            key={cert.id}
                            onClick={() =>
                                setSeleccionada({
                                    cert,
                                    relacion,
                                })
                            }
                            className={`
                                ${styles.card}
                                ${styles[estado]}
                            `}
                        >
                            <div className={styles.header}>
                                <span className={styles.codigo}>
                                    {cert.codigo}
                                </span>

                                <span
                                    className={`
                                        ${styles.estadoBadge}
                                        ${styles[estado]}
                                    `}
                                >
                                    {estado}
                                </span>
                            </div>

                            <h3 className={styles.nombre}>
                                {cert.nombre}
                            </h3>

                            <p className={styles.entidad}>
                                {cert.entidad}
                            </p>
                        </div>
                    );
                })}
            </div>

            <DetalleCertificacionModal
                open={!!seleccionada}
                cert={seleccionada?.cert}
                relacion={seleccionada?.relacion}
                onClose={() =>
                    setSeleccionada(null)
                }
            />
        </>
    );
}