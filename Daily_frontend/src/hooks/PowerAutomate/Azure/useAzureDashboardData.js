import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";

async function fetchTable(table, orderBy) {
    let query = supabase.from(table).select("*");

    if (orderBy) {
        query = query.order(orderBy, { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
}

export function useAzureDashboardData({ autoFetch = true } = {}) {
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastLoadedAt, setLastLoadedAt] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [projectsData, teamsData, membersData, teamMembersData] =
                await Promise.all([
                    fetchTable("ado_projects", "nombre"),
                    fetchTable("ado_teams", "nombre"),
                    fetchTable("ado_members", "display_name"),
                    fetchTable("ado_team_members"),
                ]);

            setProjects(projectsData);
            setTeams(teamsData);
            setMembers(membersData);
            setTeamMembers(teamMembersData);
            setLastLoadedAt(new Date().toISOString());

            return {
                projects: projectsData,
                teams: teamsData,
                members: membersData,
                teamMembers: teamMembersData,
            };
        } catch (err) {
            const message =
                err?.message ||
                "No fue posible cargar la información sincronizada de Azure.";
            setError(message);
            setProjects([]);
            setTeams([]);
            setMembers([]);
            setTeamMembers([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch, fetchData]);

    return {
        projects,
        teams,
        members,
        teamMembers,
        loading,
        error,
        lastLoadedAt,
        refetch: fetchData,
    };
}
