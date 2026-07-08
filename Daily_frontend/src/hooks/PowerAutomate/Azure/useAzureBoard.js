import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import {
    collectProjectDetailRows,
} from "./azureSyncHelpers";

const FLOW_URL = import.meta.env.VITE_FLUJO_AZURE_INFO_PROYECTO;

/**
 * Elimina registros duplicados usando una llave única.
 */
function removeDuplicates(items, keySelector) {
    return [...new Map(items.map((item) => [keySelector(item), item])).values()];
}

async function fetchProjectDetail(projectId) {
    if (!FLOW_URL) {
        throw new Error(
            "Falta VITE_FLUJO_AZURE_INFO_PROYECTO en el archivo de entorno.",
        );
    }

    const response = await fetch(FLOW_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            projectId,
        }),
    });

    if (!response.ok) {
        throw new Error(
            `El flujo de detalle del proyecto respondió con ${response.status}`,
        );
    }

    return await response.json();
}

export async function syncAzureProjectDetail(projectId, client = supabase) {
    const detailPayload = await fetchProjectDetail(projectId);
    const rows = collectProjectDetailRows(detailPayload, projectId);

    // ==========================
    // Eliminar duplicados
    // ==========================

    const teams = removeDuplicates(
        rows.teams,
        (team) => team.azure_team_id,
    );

    const members = removeDuplicates(
        rows.members,
        (member) => member.azure_user_id,
    );

    const teamMembers = removeDuplicates(
        rows.teamMembers,
        (relation) =>
            `${relation.azure_team_id}-${relation.azure_user_id}`,
    );

    const summary = {
        projectId,
        teams: teams.length,
        members: members.length,
        teamMembers: teamMembers.length,
    };

    // ==========================
    // Equipos
    // ==========================

    if (teams.length > 0) {
        const { error } = await client
            .from("ado_teams")
            .upsert(teams, {
                onConflict: "azure_team_id",
            });

        if (error) throw error;
    }

    // ==========================
    // Miembros
    // ==========================

    if (members.length > 0) {
        const { error } = await client
            .from("ado_members")
            .upsert(members, {
                onConflict: "azure_user_id",
            });

        if (error) throw error;
    }

    // ==========================
    // Relación Equipo ↔ Miembro
    // ==========================

    if (teamMembers.length > 0) {
        const { error } = await client
            .from("ado_team_members")
            .upsert(teamMembers, {
                onConflict: "azure_team_id,azure_user_id",
            });

        if (error) throw error;
    }

    return {
        ...summary,
        raw: rows.raw,
    };
}

export function useAzureBoard({ projectId, autoFetch = false } = {}) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);

    const fetchBoard = useCallback(
        async (overrideProjectId = projectId) => {
            const targetProjectId = String(overrideProjectId || "").trim();

            if (!targetProjectId) {
                setDetail(null);
                return null;
            }

            setLoading(true);
            setError(null);

            try {
                const result = await syncAzureProjectDetail(targetProjectId);
                setDetail(result);
                setLastSyncedAt(new Date().toISOString());
                return result;
            } catch (err) {
                const message =
                    err?.message ||
                    "No fue posible sincronizar el detalle del proyecto.";

                console.error(err);

                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [projectId],
    );

    useEffect(() => {
        if (!autoFetch) return;

        if (!projectId) {
            setDetail(null);
            return;
        }

        fetchBoard(projectId);
    }, [autoFetch, projectId, fetchBoard]);

    return {
        detail,
        loading,
        error,
        lastSyncedAt,
        fetchBoard,
        syncProjectDetail: fetchBoard,
    };
}