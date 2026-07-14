import { useDeferredValue, useMemo, useState } from "react";
import { buildAzureMemberExplorer } from "../../components/Admin/Azure/AzureMiembros/utils";
import { useAzureData } from "./useAzureData";
import { useAzureRefresh } from "./useAzureRefresh";

function resolveLatestSyncedAt(lastLoadedAt, explorerData) {
    return explorerData.latestSyncedAt || lastLoadedAt || null;
}

export function useAzureMembers() {
    const {
        members,
        teams,
        projects,
        teamMembers,
        loading,
        error,
        lastLoadedAt,
        refresh: refreshData,
    } = useAzureData();

    const refreshController = useAzureRefresh(refreshData);

    const [searchTerm, setSearchTermState] = useState("");
    const [statusFilter, setStatusFilterState] = useState("");
    const [projectFilter, setProjectFilterState] = useState("");
    const [teamFilter, setTeamFilterState] = useState("");
    const [pageSize, setPageSizeState] = useState(10);
    const [currentPage, setCurrentPageState] = useState(1);
    const [selectedMemberId, setSelectedMemberIdState] = useState("");

    const explorerData = useMemo(
        () =>
            buildAzureMemberExplorer({
                members,
                teams,
                projects,
                teamMembers,
            }),
        [members, teams, projects, teamMembers],
    );

    const deferredSearchTerm = useDeferredValue(searchTerm);

    const filteredMembers = useMemo(() => {
        const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

        return explorerData.members.filter((member) => {
            const matchesSearch =
                !normalizedSearch || member.searchText.includes(normalizedSearch);
            const matchesStatus = !statusFilter || member.statusValue === statusFilter;
            const matchesProject = !projectFilter || member.projectIds.includes(projectFilter);
            const matchesTeam = !teamFilter || member.teamIds.includes(teamFilter);

            return matchesSearch && matchesStatus && matchesProject && matchesTeam;
        });
    }, [
        deferredSearchTerm,
        explorerData.members,
        projectFilter,
        statusFilter,
        teamFilter,
    ]);

    const totalMembers = members.length;
    const totalTeams = teams.length;
    const totalProjects = projects.length;
    const latestSyncedAt = resolveLatestSyncedAt(lastLoadedAt, explorerData);

    const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedMembers = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * pageSize;
        return filteredMembers.slice(startIndex, startIndex + pageSize);
    }, [filteredMembers, pageSize, safeCurrentPage]);

    const selectedMember =
        explorerData.members.find(
            (member) => member.azure_user_id === selectedMemberId,
        ) || null;

    const setSearchTerm = (value) => {
        setSearchTermState(value);
        setCurrentPageState(1);
    };

    const setStatusFilter = (value) => {
        setStatusFilterState(value);
        setCurrentPageState(1);
    };

    const setProjectFilter = (value) => {
        setProjectFilterState(value);
        setCurrentPageState(1);
    };

    const setTeamFilter = (value) => {
        setTeamFilterState(value);
        setCurrentPageState(1);
    };

    const setPageSize = (value) => {
        setPageSizeState(value);
        setCurrentPageState(1);
    };

    const setCurrentPage = (value) => {
        setCurrentPageState((current) =>
            typeof value === "function" ? value(current) : value,
        );
    };

    const setSelectedMemberId = (value) => {
        setSelectedMemberIdState(value);
    };

    return {
        members,
        teams,
        projects,
        teamMembers,
        explorerData,
        filteredMembers,
        paginatedMembers,
        selectedMember,
        totalMembers,
        totalTeams,
        totalProjects,
        latestSyncedAt,
        totalPages,
        safeCurrentPage,
        loading,
        error,
        searchTerm,
        statusFilter,
        projectFilter,
        teamFilter,
        pageSize,
        currentPage,
        selectedMemberId,
        setSearchTerm,
        setStatusFilter,
        setProjectFilter,
        setTeamFilter,
        setPageSize,
        setCurrentPage,
        setSelectedMemberId,
        refresh: refreshController.refresh,
        refreshing: refreshController.refreshing,
        refreshProgress: refreshController.progress,
        refreshError: refreshController.error,
    };
}
