import { useMemo, useState } from "react";
import DatosAzureView from "../../components/Admin/Azure/AzureSincronizacion/Datos";
import { useAzureDashboardData } from "../../hooks/PowerAutomate/Azure/useAzureDashboardData";
import { useAzureProjects } from "../../hooks/PowerAutomate/Azure/useAzureProjects";
import { useAzureBoard } from "../../hooks/PowerAutomate/Azure/useAzureBoard";

function buildProjectMetrics(projects, teams, teamMembers) {
    const teamsByProject = teams.reduce((acc, team) => {
        const key = team.azure_project_id || "";
        if (!acc[key]) acc[key] = [];
        acc[key].push(team);
        return acc;
    }, {});

    const relationsByTeam = teamMembers.reduce((acc, relation) => {
        const key = relation.azure_team_id || "";
        if (!acc[key]) acc[key] = [];
        acc[key].push(relation);
        return acc;
    }, {});

    return projects.map((project) => {
        const projectTeams = teamsByProject[project.azure_project_id] || [];
        const uniqueMembers = new Set();

        projectTeams.forEach((team) => {
            (relationsByTeam[team.azure_team_id] || []).forEach((relation) => {
                uniqueMembers.add(relation.azure_user_id);
            });
        });

        return {
            ...project,
            teamCount: projectTeams.length,
            memberCount: uniqueMembers.size,
        };
    });
}

export default function DatosAzure() {
    const {
        projects,
        teams,
        members,
        teamMembers,
        loading: dataLoading,
        error: dataError,
        lastLoadedAt,
        refetch: refetchData,
    } = useAzureDashboardData();

    const {
        loading: syncAllLoading,
        error: syncAllError,
        syncSummary,
        fetchProjects,
    } = useAzureProjects({ autoFetch: false });

    const {
        loading: syncProjectLoading,
        error: syncProjectError,
        fetchBoard,
    } = useAzureBoard({ autoFetch: false });

    const [manualSelectedProjectId, setManualSelectedProjectId] = useState("");
    const [manualSelectedTeamId, setManualSelectedTeamId] = useState("");

    const projectsWithMetrics = useMemo(
        () => buildProjectMetrics(projects, teams, teamMembers),
        [projects, teams, teamMembers],
    );

    const selectedProjectId = useMemo(() => {
        if (
            manualSelectedProjectId &&
            projectsWithMetrics.some(
                (project) =>
                    project.azure_project_id === manualSelectedProjectId,
            )
        ) {
            return manualSelectedProjectId;
        }

        return projectsWithMetrics[0]?.azure_project_id || "";
    }, [manualSelectedProjectId, projectsWithMetrics]);

    const selectedProject =
        projectsWithMetrics.find(
            (project) => project.azure_project_id === selectedProjectId,
        ) || null;

    const selectedProjectTeams = useMemo(
        () =>
            teams.filter(
                (team) => team.azure_project_id === selectedProjectId,
            ),
        [teams, selectedProjectId],
    );

    const selectedTeamId = useMemo(() => {
        if (
            manualSelectedTeamId &&
            selectedProjectTeams.some(
                (team) => team.azure_team_id === manualSelectedTeamId,
            )
        ) {
            return manualSelectedTeamId;
        }

        return selectedProjectTeams[0]?.azure_team_id || "";
    }, [manualSelectedTeamId, selectedProjectTeams]);

    const selectedTeam =
        selectedProjectTeams.find((team) => team.azure_team_id === selectedTeamId) ||
        null;

    const selectedTeamMembers = useMemo(() => {
        if (!selectedTeamId) return [];

        const memberIds = new Set(
            teamMembers
                .filter((relation) => relation.azure_team_id === selectedTeamId)
                .map((relation) => relation.azure_user_id),
        );

        return members.filter((member) => memberIds.has(member.azure_user_id));
    }, [members, teamMembers, selectedTeamId]);

    const selectedProjectStats = useMemo(
        () => ({
            teamCount: selectedProject?.teamCount || 0,
            memberCount: selectedProject?.memberCount || 0,
        }),
        [selectedProject],
    );

    const runFullSync = async () => {
        await fetchProjects();
        await refetchData();
    };

    const runProjectSync = async () => {
        if (!selectedProjectId) return;
        await fetchBoard(selectedProjectId);
        await refetchData();
    };

    return (
        <DatosAzureView
            projects={projectsWithMetrics}
            teams={teams}
            members={members}
            teamMembers={teamMembers}
            dataLoading={dataLoading}
            dataError={dataError}
            onRefreshData={refetchData}
            lastLoadedAt={lastLoadedAt}
            selectedProjectId={selectedProjectId}
            onSelectProject={setManualSelectedProjectId}
            selectedTeamId={selectedTeamId}
            onSelectTeam={setManualSelectedTeamId}
            syncAllLoading={syncAllLoading}
            syncAllError={syncAllError}
            onSyncAll={runFullSync}
            syncProjectLoading={syncProjectLoading}
            syncProjectError={syncProjectError}
            onSyncProject={runProjectSync}
            selectedProject={selectedProject}
            selectedTeam={selectedTeam}
            selectedProjectStats={selectedProjectStats}
            selectedTeamMembers={selectedTeamMembers}
            selectedProjectTeams={selectedProjectTeams}
            syncSummary={syncSummary}
        />
    );
}
