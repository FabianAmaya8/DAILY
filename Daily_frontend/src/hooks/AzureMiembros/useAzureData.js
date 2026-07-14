import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

async function fetchTable(table, orderBy) {
    let query = supabase.from(table).select("*");

    if (orderBy) {
        query = query.order(orderBy, { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
}

export function useAzureData({ autoFetch = true } = {}) {
    const [members, setMembers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [projects, setProjects] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastLoadedAt, setLastLoadedAt] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [membersData, teamsData, projectsData, teamMembersData] =
                await Promise.all([
                    fetchTable("ado_members", "display_name"),
                    fetchTable("ado_teams", "nombre"),
                    fetchTable("ado_projects", "nombre"),
                    fetchTable("ado_team_members"),
                ]);

            setMembers(membersData);
            setTeams(teamsData);
            setProjects(projectsData);
            setTeamMembers(teamMembersData);
            setLastLoadedAt(new Date().toISOString());

            return {
                members: membersData,
                teams: teamsData,
                projects: projectsData,
                teamMembers: teamMembersData,
            };
        } catch (err) {
            const message =
                err?.message ||
                "No fue posible cargar la información sincronizada de Azure.";

            setError(message);
            setMembers([]);
            setTeams([]);
            setProjects([]);
            setTeamMembers([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            refresh();
        }
    }, [autoFetch, refresh]);

    return {
        members,
        teams,
        projects,
        teamMembers,
        loading,
        error,
        lastLoadedAt,
        refresh,
    };
}

