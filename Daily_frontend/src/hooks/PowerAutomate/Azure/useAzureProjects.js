import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { getFlowItems, normalizeAzureProject } from "./azureSyncHelpers";
import { syncAzureProjectDetail } from "./useAzureBoard";

const FLOW_URL = import.meta.env.VITE_FLUJO_AZURE_PROYECTOS;

function buildErrorMessage(projectId, error) {
    const detail = error?.message || String(error || "Error desconocido");
    return projectId ? `[${projectId}] ${detail}` : detail;
}

export function useAzureProjects({ autoFetch = false } = {}) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);
    const [syncSummary, setSyncSummary] = useState({
        projects: 0,
        teams: 0,
        members: 0,
        teamMembers: 0,
        errors: [],
    });

    const fetchProjects = useCallback(async () => {
        if (!FLOW_URL) {
            const msg =
                "Falta VITE_FLUJO_AZURE_PROYECTOS en el archivo de entorno.";
            setError(msg);
            return [];
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(FLOW_URL, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `El flujo de proyectos respondió con ${response.status}`,
                );
            }
            
            const payload = await response.json();
            const rows = getFlowItems(payload)
            .map(normalizeAzureProject)
            .filter(Boolean);

            if (rows.length > 0) {
                const { error: upsertError } = await supabase
                .from("ado_projects")
                .upsert(rows, {
                    onConflict: "azure_project_id",
                });
                
                if (upsertError) throw upsertError;
            }

            setProjects(rows);
            const resultSummary = {
                projects: rows.length,
                teams: 0,
                members: 0,
                teamMembers: 0,
                errors: [],
            };

            for (const project of rows) {
                try {
                    const detail = await syncAzureProjectDetail(
                        project.azure_project_id,
                    );

                    resultSummary.teams += detail.teams || 0;
                    resultSummary.members += detail.members || 0;
                    resultSummary.teamMembers += detail.teamMembers || 0;
                } catch (detailError) {
                    const message = buildErrorMessage(
                        project.azure_project_id,
                        detailError,
                    );
                    console.error("Error sincronizando proyecto Azure:", message);
                    resultSummary.errors.push(message);
                }
            }

            setSyncSummary(resultSummary);
            setLastSyncedAt(new Date().toISOString());

            if (resultSummary.errors.length > 0) {
                setError(
                    `${resultSummary.errors.length} proyecto(s) fallaron durante la sincronización completa.`,
                );
            }

            return rows;
        } catch (err) {
            const message =
                err?.message ||
                "No fue posible sincronizar los proyectos de Azure.";
            setError(message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchProjects();
        }
    }, [autoFetch, fetchProjects]);

    return {
        projects,
        loading,
        error,
        lastSyncedAt,
        syncSummary,
        fetchProjects,
    };
}
