import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* ---------------------------
        Obtener proyectos
    --------------------------- */
    const fetchProjects = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("proyectos")
            .select(`
                *,
                lider:lider_proyecto_id (
                    id,
                    nombre,
                    correo
                )
            `)
            .order("creado_en", { ascending: false });

        if (error) {
            setError(error);
            console.error(error);
        } else {
            setProjects(data);
        }

        setLoading(false);
    };

    /* ---------------------------
        Crear proyecto
    --------------------------- */
    const createProject = async (project) => {
        const { data, error } = await supabase
            .from("proyectos")
            .insert([project])
            .select(`
                *,
                lider:lider_proyecto_id (
                    id,
                    nombre,
                    correo
                )
            `);

        if (error) {
            setError(error);
            console.error(error);
            return null;
        }

        setProjects((prev) => [data[0], ...prev]);
        return data[0];
    };

    /* ---------------------------
        Actualizar proyecto
    --------------------------- */
    const updateProject = async (id, updates) => {
        const { data, error } = await supabase
            .from("proyectos")
            .update(updates)
            .eq("id", id)
            .select(`
                *,
                lider:lider_proyecto_id (
                    id,
                    nombre,
                    correo
                )
            `);

        if (error) {
            setError(error);
            console.error(error);
            return null;
        }

        setProjects((prev) =>
            prev.map((p) => (p.id === id ? data[0] : p))
        );

        return data[0];
    };

    /* ---------------------------
        Eliminar proyecto
    --------------------------- */
    const deleteProject = async (id) => {
        const { error } = await supabase
            .from("proyectos")
            .delete()
            .eq("id", id);

        if (error) {
            setError(error);
            console.error(error);
            return false;
        }

        setProjects((prev) => prev.filter((p) => p.id !== id));
        return true;
    };

    /* ---------------------------
        Asignar líder
    --------------------------- */
    const assignLeader = async (projectId, personId) => {
        return await updateProject(projectId, {
            lider_proyecto_id: personId,
        });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        assignLeader,
    };
}