import { useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useCertificaciones() {
    const [categorias, setCategorias] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [relaciones, setRelaciones] = useState([]);
    const [userId, setUserId] = useState(null);
    const [rolGlobal, setRolGlobal] = useState(null);

    /* UI */
    const [seleccion, setSeleccion] = useState(null);
    const [categoriaActiva, setCategoriaActiva] = useState(null);

    /* EQUIPOS */
    const [equipoActivo, setEquipoActivo] = useState(null);
    const [equipos, setEquipos] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* =============================
       FETCH
    ============================= */
    const fetchData = async () => {
        setLoading(true);

        try {
            const { data: authData } = await supabase.auth.getUser();
            const user = authData.user;

            if (!user) throw new Error("Usuario no autenticado");

            setUserId(user.id);

            /* ---------- rol global ---------- */
            const { data: personaGlobal } = await supabase
                .from("personas")
                .select("rol")
                .eq("id", user.id)
                .single();

            setRolGlobal(personaGlobal?.rol);

            /* ---------- categorías ---------- */
            const { data: categoriasData, error: e1 } = await supabase
                .from("categorias_certificacion")
                .select("*")
                .eq("activo", true)
                .order("nombre");

            if (e1) throw e1;

            /* ---------- certificaciones ---------- */
            const { data: certsData, error: e2 } = await supabase
                .from("certificaciones")
                .select("*")
                .eq("activo", true)
                .order("codigo");

            if (e2) throw e2;

            /* =============================
               VISIBILIDAD
            ============================= */

            /* equipos del usuario */
            const { data: equiposRaw, error: eEquipos } = await supabase
                .from("miembros_equipo")
                .select("equipo_id, rol")
                .eq("persona_id", user.id);

            if (eEquipos) throw eEquipos;

            let equipoIds = [];

            if (personaGlobal?.rol === "admin") {
                const { data: todosEquipos } = await supabase
                    .from("equipos")
                    .select("id");

                equipoIds = (todosEquipos || []).map(e => e.id);
            } else {
                equipoIds = (equiposRaw || [])
                    .filter(e => e.rol === "lider")
                    .map(e => e.equipo_id);
            }

            if (equipoIds.length === 0) {
                setPersonas([]);
                setCategorias([]);
                setRelaciones([]);
                setEquipos([]);
                return;
            }

            /* =============================
               EQUIPOS (CON NOMBRE)
            ============================= */
            const { data: equiposData, error: eEq } = await supabase
                .from("equipos")
                .select("id, nombre")
                .in("id", equipoIds);

            if (eEq) throw eEq;

            setEquipos(equiposData || []);

            /* =============================
               PERSONAS MULTI-EQUIPO
            ============================= */
            const { data: personasData, error: e3 } = await supabase
                .from("miembros_equipo")
                .select(`
                    persona:personas(id, nombre),
                    rol,
                    equipo_id
                `)
                .in("equipo_id", equipoIds);

            if (e3) throw e3;

            const personasMap = new Map();

            (personasData || []).forEach((p) => {
                if (!p.persona) return;

                if (!personasMap.has(p.persona.id)) {
                    personasMap.set(p.persona.id, {
                        id: p.persona.id,
                        nombre: p.persona.nombre?.trim(),
                        equipos: [],
                    });
                }

                personasMap.get(p.persona.id).equipos.push({
                    equipo_id: p.equipo_id,
                    rol: p.rol,
                });
            });

            const personasLimpias = Array.from(personasMap.values()).sort((a, b) => {
                const aEsLider = a.equipos.some(e => e.rol === "lider");
                const bEsLider = b.equipos.some(e => e.rol === "lider");

                if (aEsLider && !bEsLider) return -1;
                if (!aEsLider && bEsLider) return 1;

                return a.nombre.localeCompare(b.nombre);
            });

            /* ---------- relaciones ---------- */
            const { data: relacionesData, error: e4 } = await supabase
                .from("persona_certificaciones")
                .select("*");

            if (e4) throw e4;

            /* =============================
               CONSTRUIR ÁRBOL
            ============================= */

            const categoriasMap = new Map();

            categoriasData.forEach((cat) => {
                categoriasMap.set(cat.id, {
                    ...cat,
                    certificaciones: [],
                });
            });

            certsData.forEach((cert) => {
                const cat = categoriasMap.get(cert.categoria_id);

                if (cat) {
                    cat.certificaciones.push({
                        ...cert,
                        personas: new Map(),
                    });
                }
            });

            /* index relaciones */
            const relacionesIndex = new Map();

            relacionesData.forEach((r) => {
                relacionesIndex.set(
                    `${r.persona_id}-${r.certificacion_id}`,
                    r
                );
            });

            /* asignar */
            categoriasMap.forEach((cat) => {
                cat.certificaciones.forEach((cert) => {
                    personasLimpias.forEach((p) => {
                        const key = `${p.id}-${cert.id}`;

                        if (relacionesIndex.has(key)) {
                            cert.personas.set(
                                p.id,
                                relacionesIndex.get(key)
                            );
                        }
                    });
                });
            });

            setCategorias(Array.from(categoriasMap.values()));
            setPersonas(personasLimpias);
            setRelaciones(relacionesData);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* =============================
       UI CONTROL
    ============================= */

    const abrirModal = (persona, cert) => {
        setSeleccion({ persona, cert });
    };

    const cerrarModal = () => {
        setSeleccion(null);
    };

    /* =============================
       FILTROS
    ============================= */

    const categoriasFiltradas = useMemo(() => {
        if (!categoriaActiva) return categorias;
        return categorias.filter(c => c.id === categoriaActiva);
    }, [categorias, categoriaActiva]);

    const personasFiltradas = useMemo(() => {
        if (!equipoActivo) return personas;

        return personas.filter(p =>
            p.equipos.some(e => e.equipo_id === equipoActivo)
        );
    }, [personas, equipoActivo]);

    /* =============================
       HELPERS
    ============================= */

    const relacionesMap = useMemo(() => {
        const map = new Map();

        relaciones.forEach((r) => {
            map.set(`${r.persona_id}-${r.certificacion_id}`, r);
        });

        return map;
    }, [relaciones]);

    const tieneCertificacion = (personaId, certId) => {
        return relacionesMap.has(`${personaId}-${certId}`);
    };

    /* =============================
       MÉTRICAS
    ============================= */

    const getProgresoPersona = (personaId) => {
        let total = 0;
        let obtenidas = 0;

        categoriasFiltradas.forEach((cat) => {
            cat.certificaciones.forEach((cert) => {
                total++;

                if (tieneCertificacion(personaId, cert.id)) {
                    obtenidas++;
                }
            });
        });

        return {
            total,
            obtenidas,
            porcentaje: total
                ? Math.round((obtenidas / total) * 100)
                : 0,
        };
    };

    const getRanking = () => {
        return personasFiltradas
            .map((p) => ({
                ...p,
                ...getProgresoPersona(p.id),
            }))
            .sort((a, b) => b.obtenidas - a.obtenidas);
    };

    const getRelacion = (personaId, certId) => {
        return relacionesMap.get(`${personaId}-${certId}`) || null;
    };

    /* =============================
       TOGGLE
    ============================= */

    const toggleCertificacion = async (personaId, certId, data) => {
        const key = `${personaId}-${certId}`;
        const existe = relacionesMap.get(key);

        const calcularEstado = (fecha_expiracion) => {
            if (!fecha_expiracion) return "vigente";

            const hoy = new Date();
            const exp = new Date(fecha_expiracion);

            const diff = (exp - hoy) / (1000 * 60 * 60 * 24);

            if (diff < 0) return "expirada";
            if (diff <= 30) return "por_vencer";

            return "vigente";
        };

        /* =============================
        ESTADO MANUAL + AUTO
        ============================= */

        let estadoFinal = data.estado;

        // SOLO recalcula si el usuario marcó vigente
        if (data.estado === "vigente") {
            estadoFinal = calcularEstado(
                data.fecha_expiracion
            );
        }

        const payload = {
            estado: estadoFinal,
            fecha_obtencion: data.fecha_obtencion || null,
            fecha_expiracion: data.fecha_expiracion || null,
            credencial_url: data.credencial_url || null,
            validado: data.validado === "true",
            nivel: data.nivel || null,
        };

        if (existe) {
            setRelaciones(prev =>
                prev.map(r =>
                    r.id === existe.id
                        ? { ...r, ...payload }
                        : r
                )
            );

            await supabase
                .from("persona_certificaciones")
                .update(payload)
                .eq("id", existe.id);

        } else {
            const fake = {
                id: crypto.randomUUID(),
                persona_id: personaId,
                certificacion_id: certId,
                ...payload,
            };

            setRelaciones(prev => [...prev, fake]);

            await supabase
                .from("persona_certificaciones")
                .insert({
                    persona_id: personaId,
                    certificacion_id: certId,
                    ...payload,
                });
        }
    };

    return {
        userId,
        rolGlobal,

        categorias,
        categoriasFiltradas,
        categoriaActiva,
        setCategoriaActiva,

        personas: personasFiltradas,
        equipos,
        equipoActivo,
        setEquipoActivo,

        seleccion,
        getRelacion,
        abrirModal,
        cerrarModal,

        tieneCertificacion,
        toggleCertificacion,
        getProgresoPersona,
        getRanking,

        loading,
        error,
    };
}