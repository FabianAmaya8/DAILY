import { Search, UsersRound } from "lucide-react";
import { Card } from "../../../ui/Card";
import { EmptyState } from "../../../ui/EmptyState";
import { MembersPagination } from "./MembersPagination";
import { MembersTable } from "./MembersTable";
import { MembersToolbar } from "./MembersToolbar";
import { MemberDetailsModal } from "./MemberDetailsModal";
import { SummaryCards } from "./SummaryCards";
import { formatDate } from "./utils";
import styles from "../../../../assets/css/Admin/AzureMiembros.module.scss";

export default function Informacion({
    members: _members = [],
    teams: _teams = [],
    projects: _projects = [],
    teamMembers: _teamMembers = [],
    explorerData = {
        members: [],
        projectOptions: [],
        teamOptions: [],
        latestSyncedAt: null,
    },
    filteredMembers = [],
    paginatedMembers = [],
    selectedMember = null,
    totalMembers = 0,
    totalTeams = 0,
    totalProjects = 0,
    latestSyncedAt = null,
    totalPages = 1,
    safeCurrentPage = 1,
    loading = false,
    error = null,
    searchTerm = "",
    statusFilter = "",
    projectFilter = "",
    teamFilter = "",
    pageSize = 10,
    currentPage: _currentPage = 1,
    selectedMemberId = "",
    setSearchTerm,
    setStatusFilter,
    setProjectFilter,
    setTeamFilter,
    setPageSize,
    setCurrentPage,
    setSelectedMemberId,
    refresh: _refresh,
    refreshing = false,
    refreshProgress = 0,
    refreshError = null,
}) {
    const hasMembers = totalMembers > 0;
    const hasFilteredResults = filteredMembers.length > 0;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Miembros de Azure DevOps</h1>
                    <p className={styles.subtitle}>
                        Consulta de usuarios sincronizados desde Azure DevOps.
                    </p>
                </div>
            </header>

            <SummaryCards
                membersCount={totalMembers}
                teamsCount={totalTeams}
                projectsCount={totalProjects}
                lastSyncedAt={latestSyncedAt}
                dataLoading={loading}
            />

            {error ? (
                <Card
                    title="Estado de datos"
                    description="La vista usa exclusivamente tablas sincronizadas en Supabase."
                    padding="md"
                >
                    <div className={styles.errorText}>{error}</div>
                </Card>
            ) : null}

            <div className={styles.mainPanel}>
                <Card
                    title="Explorador de miembros"
                    description="Busca, filtra y abre el detalle de cualquier miembro sincronizado."
                    padding="sm"
                    footer={
                        <div className={styles.cardFooter}>
                            <span className={styles.footerMeta}>
                                Última carga: {formatDate(latestSyncedAt)}
                            </span>
                            {refreshing ? (
                                <span className={styles.footerMeta}>
                                    Actualizando {refreshProgress}%
                                </span>
                            ) : null}
                            {refreshError ? (
                                <span className={styles.errorText}>{refreshError}</span>
                            ) : null}
                        </div>
                    }
                >
                    {hasMembers ? (
                        hasFilteredResults ? (
                            <div className={styles.membersPanel}>
                                <MembersToolbar
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                    statusFilter={statusFilter}
                                    onStatusFilterChange={setStatusFilter}
                                    projectFilter={projectFilter}
                                    onProjectFilterChange={setProjectFilter}
                                    teamFilter={teamFilter}
                                    onTeamFilterChange={setTeamFilter}
                                    pageSize={pageSize}
                                    onPageSizeChange={setPageSize}
                                    projectOptions={explorerData.projectOptions}
                                    teamOptions={explorerData.teamOptions}
                                    filteredMembersCount={filteredMembers.length}
                                    totalMembersCount={totalMembers}
                                    currentPage={safeCurrentPage}
                                    totalPages={totalPages}
                                />

                                <MembersTable
                                    members={paginatedMembers}
                                    selectedMemberId={selectedMemberId}
                                    onSelectMember={setSelectedMemberId}
                                />

                                <MembersPagination
                                    filteredMembersCount={filteredMembers.length}
                                    totalMembersCount={totalMembers}
                                    currentPage={safeCurrentPage}
                                    totalPages={totalPages}
                                    onPrevious={() =>
                                        setCurrentPage((value) => Math.max(1, value - 1))
                                    }
                                    onNext={() =>
                                        setCurrentPage((value) => Math.min(totalPages, value + 1))
                                    }
                                    onPageSelect={setCurrentPage}
                                />
                            </div>
                        ) : (
                            <div className={styles.emptyWrapper}>
                                <EmptyState
                                    icon={Search}
                                    title="Sin coincidencias"
                                    description="Prueba ajustando los filtros o la búsqueda para encontrar miembros."
                                />
                            </div>
                        )
                    ) : (
                        <EmptyState
                            icon={UsersRound}
                            title="No hay miembros sincronizados"
                            description="La tabla ado_members no contiene registros para mostrar."
                        />
                    )}
                </Card>
            </div>

            <MemberDetailsModal
                open={Boolean(selectedMember)}
                onClose={() => setSelectedMemberId("")}
                member={selectedMember}
            />
        </div>
    );
}
