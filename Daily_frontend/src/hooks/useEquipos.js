import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useEquipos() {
    const [equipos, setEquipos] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ---------------------------
        Obtener usuario y rol
    --------------------------- */

    const fetchUsuario = async () => {
        const { data: sessionData } = await supabase.auth.getUser();

        if (!sessionData?.user) return null;

        const { data } = await supabase
            .from("personas")
            .select("*")
            .eq("id", sessionData.user.id)
            .single();

        setUsuario(data);

        return data;
    };

    /* ---------------------------
        Obtener equipos
    --------------------------- */

    const fetchEquipos = async () => {
        setLoading(true);

        const { data, error } = await supabase.from("equipos").select(`
            id,
            nombre,
            descripcion,
            lider:personas!equipos_lider_id_fkey (
                id,
                nombre,
                correo
            ),
            miembros:miembros_equipo (
                persona:personas (
                id,
                nombre,
                correo
                )
            )
        `);

        if (error) {
            setError(error);
        } else {
            setEquipos(data);
        }

        setLoading(false);
    };

    /* ---------------------------
        Editar equipo
    --------------------------- */

    const editarEquipo = async (equipoId, { nombre, descripcion }) => {
        const { error } = await supabase
            .from("equipos")
            .update({
                nombre,
                descripcion,
            })
            .eq("id", equipoId);

        if (error) {
            setError(error);
            return;
        }

        fetchEquipos();
    };

    /* ---------------------------
        Crear equipo
    --------------------------- */

    const crearEquipo = async ({ nombre, descripcion, lider_id }) => {
        if (!usuario) return;

        let liderFinal = lider_id;

        /* Si es líder, él mismo debe ser líder */
        if (usuario.rol === "lider") {
            liderFinal = usuario.id;
        }

        const { data, error } = await supabase
            .from("equipos")
            .insert([
                {
                    nombre,
                    descripcion,
                    lider_id: liderFinal,
                },
            ])
            .select()
            .single();

        if (error) {
            setError(error);
            return;
        }

        /* agregar líder como miembro del equipo */

        await supabase.from("miembros_equipo").insert([
            {
                equipo_id: data.id,
                persona_id: liderFinal,
                rol: "lider",
            },
        ]);

        fetchEquipos();
    };

    /* ---------------------------
        Eliminar equipo
    --------------------------- */

    const eliminarEquipo = async (equipoId) => {
        const { error } = await supabase
            .from("equipos")
            .delete()
            .eq("id", equipoId);

        if (error) {
            setError(error);
            console.error(error);
            return;
        }

        setEquipos((prev) => prev.filter((e) => e.id !== equipoId));
    };

    /* ---------------------------
    Agregar miembro
    --------------------------- */

    const agregarMiembro = async (equipoId, personaId) => {
        const { error } = await supabase.from("miembros_equipo").insert([
            {
                equipo_id: equipoId,
                persona_id: personaId,
                rol: "miembro",
            },
        ]);

        if (error) {
            setError(error);
            return;
        }

        fetchEquipos();
    };

    /* ---------------------------
    Quitar miembro
    --------------------------- */

    const quitarMiembro = async (equipoId, personaId) => {
        const { error } = await supabase
            .from("miembros_equipo")
            .delete()
            .eq("equipo_id", equipoId)
            .eq("persona_id", personaId);

        if (error) {
            setError(error);
            return;
        }

        fetchEquipos();
    };

    /* ---------------------------
    Cambiar líder
    --------------------------- */

    const cambiarLider = async (equipoId, personaId) => {
        const { error } = await supabase
            .from("equipos")
            .update({ lider_id: personaId })
            .eq("id", equipoId);

        if (error) {
            setError(error);
            return;
        }

        fetchEquipos();
    };

    /* ---------------------------
        Inicialización
    --------------------------- */

    useEffect(() => {
        const init = async () => {
            await fetchUsuario();
            await fetchEquipos();
        };

        init();
    }, []);

    return {
        equipos,
        usuario,
        loading,
        error,
        crearEquipo,
        editarEquipo,
        eliminarEquipo,
        agregarMiembro,
        quitarMiembro,
        cambiarLider,
        refetch: fetchEquipos,
    };
}
