import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useCertificaciones() {
    const [catalogo, setCatalogo] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [relaciones, setRelaciones] = useState([]);
    const [userId, setUserId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ---------------------------------
        FETCH GLOBAL
    --------------------------------- */
    const fetchData = async () => {
        setLoading(true);

        try {
            /* -----------------------------
                1. Usuario
            ----------------------------- */
            const user = (await supabase.auth.getUser()).data.user;
            setUserId(user.id);
            /* -----------------------------
                2. Catálogo
            ----------------------------- */
            const { data: catalogoData, error: e1 } = await supabase
                .from("certificaciones")
                .select("*")
                .eq("activo", true)
                .order("codigo");

            if (e1) throw e1;

            /* -----------------------------
                3. Personas
            ----------------------------- */
            const { data: personasData, error: e2 } = await supabase
                .from("personas")
                .select("id, nombre, correo, rol")
                .eq("activo", true)
                .order("nombre");

            if (e2) throw e2;

            /* -----------------------------
                4. Relaciones
            ----------------------------- */
            const { data: relacionesData, error: e3 } = await supabase
                .from("persona_certificaciones")
                .select("id, persona_id, certificacion_id");

            if (e3) throw e3;

            setCatalogo(catalogoData);
            setPersonas(personasData);
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

    /* ---------------------------------
        VALIDAR SI PERSONA TIENE CERT
    --------------------------------- */
    const tieneCertificacion = (personaId, certId) => {
        return relaciones.some(
            (r) =>
                r.persona_id === personaId &&
                r.certificacion_id === certId
        );
    };

    /* ---------------------------------
        VALIDAR SI USUARIO TIENE CERT
    --------------------------------- */
    const tieneMiCertificacion = (certId) => {
        if (!userId) return false;

        return relaciones.some(
            (r) =>
                r.persona_id === userId &&
                r.certificacion_id === certId
        );
    };

    /* ---------------------------------
        ASIGNAR / QUITAR
    --------------------------------- */
    const toggleCertificacion = async (personaId, certId) => {
        const existe = relaciones.find(
            (r) =>
                r.persona_id === personaId &&
                r.certificacion_id === certId
        );

        if (existe) {
            /* -------- DELETE -------- */
            const { error } = await supabase
                .from("persona_certificaciones")
                .delete()
                .eq("id", existe.id);

            if (error) {
                console.error(error);
                return;
            }
        } else {
            /* -------- INSERT -------- */
            const { error } = await supabase
                .from("persona_certificaciones")
                .insert({
                    persona_id: personaId,
                    certificacion_id: certId,
                });

            if (error) {
                console.error(error);
                return;
            }
        }

        fetchData(); // refresh
    };

    return {
        catalogo,
        personas,
        relaciones,
        tieneCertificacion,
        tieneMiCertificacion,
        toggleCertificacion,
        loading,
        error,
    };
}